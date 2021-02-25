<script>
  import { backendUiStore } from "builderStore"
  import { notifier } from "builderStore/store/notifications"
  import RowFieldControl from "../RowFieldControl.svelte"
  import * as api from "../api"
  import { ModalContent } from "@budibase/bbui"
  import ErrorsBox from "components/common/ErrorsBox.svelte"

  export let row = {}

  let errors = []

  $: creating = row?._id == null
  $: table = row.tableId
    ? $backendUiStore.tables.find(table => table._id === row?.tableId)
    : $backendUiStore.selectedTable
  $: tableSchema = Object.entries(table?.schema ?? {})

  async function saveRow() {
    const rowResponse = await api.saveRow(
      { ...row, tableId: table._id },
      table._id
    )

    if (rowResponse.errors) {
      errors = Object.entries(rowResponse.errors)
        .map(([key, error]) => ({ dataPath: key, message: error }))
        .flat()
      // Prevent modal closing if there were errors
      return false
    } else if (rowResponse.status === 400 || rowResponse.status === 500) {
      errors = [{ message: rowResponse.message }]
      return false
    }

    notifier.success("Row saved successfully.")
    backendUiStore.actions.rows.save(rowResponse)
  }
</script>

<ModalContent
  title={creating ? 'Create Row' : 'Edit Row'}
  confirmText={creating ? 'Create Row' : 'Save Row'}
  onConfirm={saveRow}>
  <ErrorsBox {errors} />
  {#each tableSchema as [key, meta]}
    {#if !meta.autocolumn}
      <div>
        <RowFieldControl {meta} bind:value={row[key]} />
      </div>
    {/if}
  {/each}
</ModalContent>

<style>
  div {
    min-width: 0;
  }
</style>
