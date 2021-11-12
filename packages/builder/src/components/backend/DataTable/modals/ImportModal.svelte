<script>
  import { ModalContent, Label, notifications } from "@budibase/bbui"
  import TableDataImport from "../../TableNavigator/TableDataImport.svelte"
  import api from "builderStore/api"
  import { createEventDispatcher } from "svelte"

  const dispatch = createEventDispatcher()

  export let tableId
  let dataImport

  $: valid = dataImport?.csvString != null && dataImport?.valid

  async function importData() {
    const response = await api.post(`/api/tables/${tableId}/import`, {
      dataImport,
    })
    if (response.status !== 200) {
      const error = await response.text()
      notifications.error(`Unable to import data - ${error}`)
    } else {
      notifications.success("Rows successfully imported.")
    }
    dispatch("updaterows")
  }
</script>

<ModalContent
  title="Import Data"
  confirmText="Import"
  onConfirm={importData}
  disabled={!valid}
>
  <Label grey extraSmall>CSV to import</Label>
  <TableDataImport bind:dataImport bind:existingTableId={tableId} />
</ModalContent>
