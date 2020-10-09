<script>
  import { goto } from "@sveltech/routify"
  import { backendUiStore } from "builderStore"
  import { notifier } from "builderStore/store/notifications"
  import { Button, Input, Label, ModalContent, Modal } from "@budibase/bbui"
  import Spinner from "components/common/Spinner.svelte"
  import TableDataImport from "../TableDataImport.svelte"
  import analytics from "analytics"

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
