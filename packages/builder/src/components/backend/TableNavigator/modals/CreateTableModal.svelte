<script>
  import { goto } from "@sveltech/routify"
  import { backendUiStore, store } from "builderStore"
  import { notifier } from "builderStore/store/notifications"
  import { Button, Input, Label, ModalContent, Modal } from "@budibase/bbui"
  import Spinner from "components/common/Spinner.svelte"
  import TableDataImport from "../TableDataImport.svelte"
  import analytics from "analytics"
  import screenTemplates from "builderStore/store/screenTemplates"
  import { NEW_ROW_TEMPLATE } from "builderStore/store/screenTemplates/newRowScreen"
  import { ROW_DETAIL_TEMPLATE } from "builderStore/store/screenTemplates/rowDetailScreen"
  import { ROW_LIST_TEMPLATE } from "builderStore/store/screenTemplates/rowListScreen"

  const defaultScreens = [
    NEW_ROW_TEMPLATE,
    ROW_DETAIL_TEMPLATE,
    ROW_LIST_TEMPLATE,
  ]

  let modal
  let name
  let dataImport

  function resetState() {
    name = ""
    dataImport = undefined
  }

  async function saveTable() {
    const table = await backendUiStore.actions.tables.save({
      name,
      schema: dataImport.schema || {},
      dataImport,
    })
    notifier.success(`Table ${name} created successfully.`)
    $goto(`./table/${table._id}`)
    analytics.captureEvent("Table Created", { name })

    const screens = screenTemplates($store, [table])
      .filter(template => defaultScreens.includes(template.id))
      .map(template => template.create())

    for (let screen of screens) {
      try {
        await store.createScreen(screen)
      } catch (_) {
        // TODO: this is temporary
        // a cypress test is failing, because I added the
        // NewRow component. So - this throws an exception
        // because the currently released standard-components (on NPM)
        // does not have NewRow
        // we should remove this after this has been released
      }
    }
  }
</script>

<Button primary wide on:click={modal.show}>Create New Table</Button>
<Modal bind:this={modal} on:hide={resetState}>
  <ModalContent
    title="Create Table"
    confirmText="Create"
    onConfirm={saveTable}
    disabled={!name || (dataImport && !dataImport.valid)}>
    <Input
      data-cy="table-name-input"
      thin
      label="Table Name"
      bind:value={name} />
    <div>
      <Label grey extraSmall>Create Table from CSV (Optional)</Label>
      <TableDataImport bind:dataImport />
    </div>
  </ModalContent>
</Modal>
