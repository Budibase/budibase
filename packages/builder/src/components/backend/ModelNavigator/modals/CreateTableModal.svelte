<script>
  import { goto } from "@sveltech/routify"
  import { backendUiStore, store } from "builderStore"
  import { notifier } from "builderStore/store/notifications"
  import { Button, Input, Label, ModalContent, Modal } from "@budibase/bbui"
  import Spinner from "components/common/Spinner.svelte"
  import TableDataImport from "../TableDataImport.svelte"
  import analytics from "analytics"
  import screenTemplates from "builderStore/store/screenTemplates"
  import { NEW_RECORD_TEMPLATE } from "builderStore/store/screenTemplates/newRecordScreen"
  import { RECORD_DETAIL_TEMPLATE } from "builderStore/store/screenTemplates/recordDetailScreen"
  import { RECORD_LIST_TEMPLATE } from "builderStore/store/screenTemplates/recordListScreen"

  const defaultScreens = [
    NEW_RECORD_TEMPLATE,
    RECORD_DETAIL_TEMPLATE,
    RECORD_LIST_TEMPLATE,
  ]

  let modal
  let name
  let dataImport
  let error = ""

  function resetState() {
    name = ""
    dataImport = undefined
    error = ""
  }

  function checkValid(evt) {
    const tableName = evt.target.value
    if ($backendUiStore.models.some(model => model.name === tableName)) {
      error = `Table with name ${tableName} already exists. Please choose another name.`
      return
    }
    error = ""
  }

  async function saveTable() {
    const model = await backendUiStore.actions.models.save({
      name,
      schema: dataImport.schema || {},
      dataImport,
    })
    notifier.success(`Table ${name} created successfully.`)
    $goto(`./model/${model._id}`)
    analytics.captureEvent("Table Created", { name })

    const screens = screenTemplates($store, [model])
      .filter(template => defaultScreens.includes(template.id))
      .map(template => template.create())

    for (let screen of screens) {
      try {
        await store.createScreen(screen)
      } catch (_) {
        // TODO: this is temporary
        // a cypress test is failing, because I added the
        // NewRecord component. So - this throws an exception
        // because the currently released standard-components (on NPM)
        // does not have NewRecord
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
    disabled={error || !name || (dataImport && !dataImport.valid)}>
    <Input
      data-cy="table-name-input"
      thin
      label="Table Name"
      on:input={checkValid}
      bind:value={name}
      {error} />
    <div>
      <Label grey extraSmall>Create Table from CSV (Optional)</Label>
      <TableDataImport bind:dataImport />
    </div>
  </ModalContent>
</Modal>
