<script>
  import { backendUiStore } from "builderStore"
  import { notifier } from "builderStore/store/notifications"
  import RecordFieldControl from "../RecordFieldControl.svelte"
  import * as api from "../api"
  import { ModalContent } from "@budibase/bbui"
  import ErrorsBox from "components/common/ErrorsBox.svelte"

  export let record = {}

  let errors = []

  $: creating = record?._id == null
  $: table = record.tableId
    ? $backendUiStore.tables.find(table => table._id === record?.tableId)
    : $backendUiStore.selectedTable
  $: tableSchema = Object.entries(table?.schema ?? {})

  async function saveRecord() {
    const recordResponse = await api.saveRecord(
      { ...record, tableId: table._id },
      table._id
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

<ModalContent
  title={creating ? 'Create Row' : 'Edit Row'}
  confirmText={creating ? 'Create Row' : 'Save Row'}
  onConfirm={saveRecord}>
  <ErrorsBox {errors} />
  {#each tableSchema as [key, meta]}
    <div>
      <RecordFieldControl {meta} bind:value={record[key]} />
    </div>
  {/each}
</ModalContent>
