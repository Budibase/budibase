<script>
  import { goto, url } from "@roxi/routify"
  import { tables, datasources } from "@/stores/builder"
  import { notifications, Input, ModalContent } from "@budibase/bbui"
  import TableDataImport from "../TableDataImport.svelte"
  import {
    BUDIBASE_INTERNAL_DB_ID,
    BUDIBASE_DATASOURCE_TYPE,
    DB_TYPE_INTERNAL,
  } from "@/constants/backend"

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
      type: "table",
      sourceId: targetDatasourceId,
      sourceType: DB_TYPE_INTERNAL,
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
      notifications.error(e.message || e)
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
  size="M"
>
  <Input
    thin
    label="Table Name"
    on:input={checkValid}
    bind:value={name}
    {error}
  />
  <TableDataImport
    {promptUpload}
    bind:rows
    bind:schema
    bind:allValid
    bind:displayColumn
  />
</ModalContent>
