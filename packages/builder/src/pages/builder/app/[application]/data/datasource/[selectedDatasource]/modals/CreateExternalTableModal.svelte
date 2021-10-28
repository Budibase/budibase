<script>
  import { ModalContent, Body, Input } from "@budibase/bbui"
  import { tables, datasources } from "stores/backend"
  import { goto } from "@roxi/routify"

  export let datasource

  let name = ""

  $: valid = name && name.length > 0

  function buildDefaultTable(tableName, datasourceId) {
    return {
      name: tableName,
      type: "external",
      primary: ["id"],
      sourceId: datasourceId,
      schema: {
        id: {
          autocolumn: true,
          type: "number",
        },
      },
    }
  }

  async function saveTable() {
    const table = await tables.save(buildDefaultTable(name, datasource._id))
    await datasources.fetch()
    $goto(`../../table/${table._id}`)
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
  <Input label="Table Name" bind:value={name} />
</ModalContent>
