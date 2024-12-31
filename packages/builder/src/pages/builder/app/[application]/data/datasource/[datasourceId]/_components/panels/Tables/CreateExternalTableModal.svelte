<script>
  import { ModalContent, Body, Input, notifications } from "@budibase/bbui"
  import { tables, datasources } from "@/stores/builder"
  import { goto } from "@roxi/routify"
  import { DB_TYPE_EXTERNAL } from "@/constants/backend"

  export let datasource

  let name = ""
  let submitted = false
  $: valid = name && name.length > 0 && !datasource?.entities?.[name]
  $: error =
    !submitted && name && datasource?.entities?.[name]
      ? "Table name already in use."
      : null

  function buildDefaultTable(tableName, datasourceId) {
    return {
      name: tableName,
      type: "table",
      primary: ["id"],
      sourceId: datasourceId,
      sourceType: DB_TYPE_EXTERNAL,
      schema: {
        id: {
          name: "id",
          autocolumn: true,
          type: "number",
        },
      },
    }
  }

  async function saveTable() {
    try {
      submitted = true
      const table = await tables.save(buildDefaultTable(name, datasource._id))
      await datasources.fetch()
      $goto(`../../table/${table._id}`)
    } catch (error) {
      notifications.error(
        `Error saving table - ${error?.message || "unknown error"}`
      )
    }
  }
</script>

<ModalContent
  title="Create new table"
  confirmText="Create"
  onConfirm={saveTable}
  disabled={!valid}
>
  <Body
    >Provide a name for your new table; you can add columns once it is created.</Body
  >
  <Input label="Table Name" bind:error bind:value={name} />
</ModalContent>
