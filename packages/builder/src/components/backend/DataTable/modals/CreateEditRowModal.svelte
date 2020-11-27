<script>
  import { backendUiStore } from "builderStore"
  import { TableNames } from "constants"
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
  {#if creating && table._id === TableNames.USERS}
    <RowFieldControl
      {creating}
      meta={{ name: 'password', type: 'password' }}
      bind:value={row.password} />
  {/if}
  {#each tableSchema as [key, meta]}
    <div>
      <RowFieldControl {meta} bind:value={row[key]} {creating} />
    </div>
  {/each}
</ModalContent>
