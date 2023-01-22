<script>
  import {
    ModalContent,
    Label,
    notifications,
    Body,
    Layout,
  } from "@budibase/bbui"
  import TableDataImport from "../../TableNavigator/TableDataImport.svelte"
  import { API } from "api"
  import { createEventDispatcher } from "svelte"

  const dispatch = createEventDispatcher()

  export let tableId
  let dataImport

  $: valid = dataImport?.csvString != null && dataImport?.valid

  async function importData() {
    try {
      await API.importTableData({
        tableId,
        data: dataImport,
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
  disabled={!valid}
>
  <Body size="S">
    Import rows to an existing table from a CSV. Only columns from the CSV which
    exist in the table will be imported.
  </Body>
  <Layout gap="XS" noPadding>
    <Label grey extraSmall>CSV to import</Label>
    <TableDataImport bind:dataImport bind:existingTableId={tableId} />
  </Layout>
</ModalContent>
