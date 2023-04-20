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
  import { _ } from "../../../../../lang/i18n"

  const dispatch = createEventDispatcher()

  export let tableId
  let rows = []
  let allValid = false
  let displayColumn = null

  async function importData() {
    try {
      await API.importTableData({
        tableId,
        rows,
      })
      notifications.success(
        $_("components.backend.DataTable.modals.ImportModal.Rows_imported")
      )
    } catch (error) {
      notifications.error(
        $_("components.backend.DataTable.modals.ImportModal.Unable_data")
      )
    }

    // Always refresh rows just to be sure
    dispatch("importrows")
  }
</script>

<ModalContent
  title={$_("components.backend.DataTable.modals.ImportModal.Import_Data")}
  confirmText={$_("components.backend.DataTable.modals.ImportModal.Import")}
  onConfirm={importData}
  disabled={!allValid}
>
  <Body size="S">
    {$_("components.backend.DataTable.modals.ImportModal.Import_rows")}
  </Body>
  <Layout gap="XS" noPadding>
    <Label grey extraSmall
      >{$_("components.backend.DataTable.modals.ImportModal.import")}</Label
    >
    <TableDataImport {tableId} bind:rows bind:allValid bind:displayColumn />
  </Layout>
</ModalContent>
