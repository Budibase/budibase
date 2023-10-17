<script>
  import CreateEditUser from "../../modals/CreateEditUser.svelte"
  import { getContext, onMount } from "svelte"
  import { Modal } from "@budibase/bbui"
  import { cloneDeep } from "lodash/fp"

  const { subscribe, rows } = getContext("grid")

  let modal
  let row

  onMount(() =>
    subscribe("edit-row", rowToEdit => {
      row = cloneDeep(rowToEdit)
      modal.show()
    })
  )
</script>

<Modal bind:this={modal}>
  <CreateEditUser
    {row}
    on:updaterows={e => rows.actions.refreshRow(e.detail)}
  />
</Modal>
