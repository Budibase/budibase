<script>
  import { goto } from "@sveltech/routify"
  import { backendUiStore } from "builderStore"
  import { notifier } from "builderStore/store/notifications"
  import { Button, Input, Label } from "@budibase/bbui"
  import Spinner from "components/common/Spinner.svelte"
  import TableDataImport from "../TableDataImport.svelte"
  import analytics from "analytics"
  import { Modal } from "components/common/Modal"

  let visible = false
  let name
  let dataImport
  let loading = false

  function resetState() {
    name = ""
    dataImport = undefined
    loading = false
  }

  async function saveTable() {
    loading = true
    const model = await backendUiStore.actions.models.save({
      name,
      schema: dataImport.schema || {},
      dataImport,
    })
    notifier.success(`Table ${name} created successfully.`)
    $goto(`./model/${model._id}`)
    analytics.captureEvent("Table Created", { name })
    visible = false
    resetState()
  }

  function onClosed() {
    visible = false
    resetState()
  }
</script>

<Button primary wide on:click={() => (visible = true)}>Create New Table</Button>
<Modal
  bind:visible
  {loading}
  title="Create Table"
  on:hide={onClosed}
  confirmText="Create"
  onConfirm={saveTable}
  disabled={!name || (dataImport && !dataImport.valid)}>
  <Input data-cy="table-name-input" thin label="Table Name" bind:value={name} />
  <div>
    <Label grey extraSmall>Create Table from CSV (Optional)</Label>
    <TableDataImport bind:dataImport />
  </div>
</Modal>
