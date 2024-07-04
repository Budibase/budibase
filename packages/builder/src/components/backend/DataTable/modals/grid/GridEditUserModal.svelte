<script>
import { Modal } from "@budibase/bbui"
import { cloneDeep } from "lodash/fp"
import { getContext, onMount } from "svelte"
import CreateEditUser from "../../modals/CreateEditUser.svelte"

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
