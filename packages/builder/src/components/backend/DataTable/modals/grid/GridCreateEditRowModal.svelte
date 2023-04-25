<script>
  import CreateEditRow from "../../modals/CreateEditRow.svelte"
  import { getContext, onMount } from "svelte"
  import { Modal, notifications } from "@budibase/bbui"
  import { cloneDeep } from "lodash/fp"

  const { subscribe, rows } = getContext("grid")

  let modal
  let row

  const deleteRow = e => {
    rows.actions.deleteRows([e.detail])
    notifications.success("Deleted 1 row")
  }

  onMount(() =>
    subscribe("add-row", () => {
      row = {}
      modal.show()
    })
  )
  onMount(() =>
    subscribe("edit-row", rowToEdit => {
      row = cloneDeep(rowToEdit)
      modal.show()
    })
  )
</script>

<Modal bind:this={modal}>
  <CreateEditRow
    {row}
    on:updaterows={e => rows.actions.refreshRow(e.detail)}
    on:deleteRows={deleteRow}
  />
</Modal>
