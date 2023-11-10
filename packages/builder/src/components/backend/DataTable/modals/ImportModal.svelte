<script>
  import {
    ModalContent,
    Label,
    notifications,
    Body,
    Layout,
  } from "@budibase/bbui"
  import TableDataImport from "../../TableNavigator/ExistingTableDataImport.svelte"
  import { API } from "api"
  import { createEventDispatcher } from "svelte"

  const dispatch = createEventDispatcher()

  export let tableId
  export let tableType

  let rows = []
  let allValid = false
  let displayColumn = null
  let identifierFields = []

  async function importData() {
    try {
      await API.importTableData({
        tableId,
        rows,
        identifierFields,
      })
      notifications.success("Rows successfully imported")
    } catch (error) {
      notifications.error("Unable to import data")
    }

    // Always refresh rows just to be sure
    dispatch("importrows")
  }
</script>

<ModalContent
  title="Import Data"
  confirmText="Import"
  onConfirm={importData}
  disabled={!allValid}
>
  <Body size="S">
    Import rows to an existing table from a CSV or JSON file. Only columns from
    the file which exist in the table will be imported.
  </Body>
  <Layout gap="XS" noPadding>
    <Label grey extraSmall>CSV or JSON file to import</Label>
    <TableDataImport
      {tableId}
      {tableType}
      bind:rows
      bind:allValid
      bind:displayColumn
      bind:identifierFields
    />
  </Layout>
</ModalContent>
