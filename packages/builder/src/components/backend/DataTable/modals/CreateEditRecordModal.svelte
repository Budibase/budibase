<script>
  import { backendUiStore } from "builderStore"
  import { notifier } from "builderStore/store/notifications"
  import RecordFieldControl from "../RecordFieldControl.svelte"
  import * as api from "../api"
  import { Modal } from "components/common/Modal"
  import ErrorsBox from "components/common/ErrorsBox.svelte"

  export let record = {}
  export let visible

  let modal
  let errors = []

  $: creating = record?._id == null
  $: model = record.modelId
    ? $backendUiStore.models.find(model => model._id === record?.modelId)
    : $backendUiStore.selectedModel
  $: modelSchema = Object.entries(model?.schema ?? {})

  async function saveRecord() {
    const recordResponse = await api.saveRecord(
      { ...record, modelId: model._id },
      model._id
    )
    if (recordResponse.errors) {
      errors = Object.keys(recordResponse.errors)
        .map(k => ({ dataPath: k, message: recordResponse.errors[k] }))
        .flat()
      // Prevent modal closing if there were errors
      return false
    }
    notifier.success("Record saved successfully.")
    backendUiStore.actions.records.save(recordResponse)
  }
</script>

<Modal
  bind:visible
  title={creating ? 'Create Row' : 'Edit Row'}
  confirmText={creating ? 'Create Row' : 'Save Row'}
  onConfirm={saveRecord}>
  <ErrorsBox {errors} />
  {#each modelSchema as [key, meta]}
    <div>
      <RecordFieldControl {meta} bind:value={record[key]} />
    </div>
  {/each}
</Modal>
