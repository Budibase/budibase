<script>
  import { goto, url } from "@roxi/routify"
  import { tables } from "stores/backend"
  import { notifications } from "@budibase/bbui"
  import {
    Input,
    Label,
    ModalContent,
    Toggle,
    Divider,
    Layout,
  } from "@budibase/bbui"
  import { datasources } from "stores/backend"
  import TableDataImport from "../TableDataImport.svelte"
  import {
    BUDIBASE_INTERNAL_DB_ID,
    BUDIBASE_DATASOURCE_TYPE,
  } from "constants/backend"
  import { buildAutoColumn, getAutoColumnInformation } from "builderStore/utils"

  $: tableNames = $tables.list.map(table => table.name)
  $: selectedSource = $datasources.list.find(
    source => source._id === $datasources.selected
  )

  $: isSelectedInternal = selectedSource?.type === BUDIBASE_DATASOURCE_TYPE
  $: targetDatasourceId = isSelectedInternal
    ? selectedSource._id
    : BUDIBASE_INTERNAL_DB_ID

  export let name
  let dataImport
  let error = ""
  let autoColumns = getAutoColumnInformation()

  function addAutoColumns(tableName, schema) {
    for (let [subtype, col] of Object.entries(autoColumns)) {
      if (!col.enabled) {
        continue
      }
      schema[col.name] = buildAutoColumn(tableName, col.name, subtype)
    }
    return schema
  }

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
      schema: addAutoColumns(name, dataImport.schema || {}),
      dataImport,
      type: "internal",
      sourceId: targetDatasourceId,
    }

    // Only set primary display if defined
    if (dataImport.primaryDisplay && dataImport.primaryDisplay.length) {
      newTable.primaryDisplay = dataImport.primaryDisplay
    }

    // Create table
    let table
    try {
      table = await tables.save(newTable)
      notifications.success(`Table ${name} created successfully.`)

      // Navigate to new table
      const currentUrl = $url()
      const path = currentUrl.endsWith("data")
        ? `./table/${table._id}`
        : `../../table/${table._id}`
      $goto(path)
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
  disabled={error || !name || (dataImport && !dataImport.valid)}
>
  <Input
    data-cy="table-name-input"
    thin
    label="Table Name"
    on:input={checkValid}
    bind:value={name}
    {error}
  />
  <div class="autocolumns">
    <Label extraSmall grey>Auto Columns</Label>
    <div class="toggles">
      <div class="toggle-1">
        <Toggle text="Created by" bind:value={autoColumns.createdBy.enabled} />
        <Toggle text="Created at" bind:value={autoColumns.createdAt.enabled} />
        <Toggle text="Auto ID" bind:value={autoColumns.autoID.enabled} />
      </div>
      <div class="toggle-2">
        <Toggle text="Updated by" bind:value={autoColumns.updatedBy.enabled} />
        <Toggle text="Updated at" bind:value={autoColumns.updatedAt.enabled} />
      </div>
    </div>
    <Divider />
  </div>
  <div>
    <Layout gap="XS" noPadding>
      <Label grey extraSmall>Create Table from CSV (Optional)</Label>
      <TableDataImport bind:dataImport />
    </Layout>
  </div>
</ModalContent>

<style>
  .autocolumns {
    margin-bottom: -10px;
  }

  .toggles {
    display: flex;
    width: 100%;
    margin-top: 6px;
  }

  .toggle-1 :global(> *) {
    margin-bottom: 10px;
  }

  .toggle-2 :global(> *) {
    margin-bottom: 10px;
    margin-left: 20px;
  }
</style>
