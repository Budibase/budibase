<script>
  import CreateEditRow from "../../modals/CreateEditRow.svelte"
  import { getContext, onMount } from "svelte"
  import { Modal } from "@budibase/bbui"
  import { cloneDeep } from "lodash/fp"

  const { subscribe, rows } = getContext("sheet")

  let modal
  let row

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
  <CreateEditRow {row} on:updaterows={e => rows.actions.refreshRow(e.detail)} />
</Modal>
