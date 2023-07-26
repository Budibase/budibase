<script>
  import { goto, url } from "@roxi/routify"
  import { tables } from "stores/backend"
  import { notifications } from "@budibase/bbui"
  import { Input, Label, ModalContent, Layout } from "@budibase/bbui"
  import { datasources } from "stores/backend"
  import TableDataImport from "../TableDataImport.svelte"
  import {
    BUDIBASE_INTERNAL_DB_ID,
    BUDIBASE_DATASOURCE_TYPE,
  } from "constants/backend"

  $: tableNames = $tables.list.map(table => table.name)
  $: selectedSource = $datasources.list.find(
    source => source._id === $datasources.selected
  )

  $: isSelectedInternal = selectedSource?.type === BUDIBASE_DATASOURCE_TYPE
  $: targetDatasourceId = isSelectedInternal
    ? selectedSource._id
    : BUDIBASE_INTERNAL_DB_ID

  export let promptUpload = false
  export let name
  export let beforeSave = async () => {}
  export let afterSave = async table => {
    notifications.success(`Table ${name} created successfully.`)

    // Navigate to new table
    const currentUrl = $url()
    const path = currentUrl.endsWith("data")
      ? `./table/${table._id}`
      : `../../table/${table._id}`
    $goto(path)
  }

  let error = ""

  let schema = {}
  let rows = []
  let allValid = true
  let displayColumn = null

  function checkValid(evt) {
    const tableName = evt.target.value
    if (tableNames.includes(tableName)) {
      error = `Table with name ${tableName} already exists. Please choose another name.`
      return
    }
    error = ""
  }

  async function saveTable() {
    let newTable = {
      name,
      schema: { ...schema },
      rows,
      type: "internal",
      sourceId: targetDatasourceId,
    }

    // Only set primary display if defined
    if (displayColumn && displayColumn.length) {
      newTable.primaryDisplay = displayColumn
    }

    // Create table
    let table
    try {
      await beforeSave()
      table = await tables.save(newTable)
      await datasources.fetch()
      await afterSave(table)
    } catch (e) {
      notifications.error(e)
      // reload in case the table was created
      await tables.fetch()
    }
  }
</script>

<ModalContent
  title="Create Table"
  confirmText="Create"
  onConfirm={saveTable}
  disabled={error ||
    !name ||
    (rows.length && (!allValid || displayColumn == null))}
>
  <Input
    thin
    label="Table Name"
    on:input={checkValid}
    bind:value={name}
    {error}
  />
  <div>
    <Layout gap="XS" noPadding>
      <Label grey extraSmall
        >Create a Table from a CSV or JSON file (Optional)</Label
      >
      <TableDataImport
        {promptUpload}
        bind:rows
        bind:schema
        bind:allValid
        bind:displayColumn
      />
    </Layout>
  </div>
</ModalContent>
