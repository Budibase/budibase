<script>
  import { notifications } from "@budibase/bbui"
  import { ActionMenu, MenuItem, Icon, Popover } from "@budibase/bbui"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { DropdownContainer, DropdownItem } from "components/common/Dropdowns"

  export let query
  
  let dropdown
  let confirmDeleteDialog

  function hideEditor() {
    dropdown?.hide()
  }

  function showModal() {
    hideEditor()
    confirmDeleteDialog.show()
  }

  async function deleteQuery() {
    await queries.delete(query)
    notifications.success("Query deleted")
    hideEditor()
  }
</script>

<ActionMenu bind:this={dropdown}>
  <div slot="button" class="icon" on:click={dropdown.show}>
    <Icon s hoverable name="MoreSmallList" />
  </div>
  <MenuItem icon="Delete" on:click={showModal}>Delete</MenuItem>
</ActionMenu>

<ConfirmDialog
  bind:this={confirmDeleteDialog}
  okText="Delete Query"
  onOk={deleteQuery}
  title="Confirm Deletion"
>
  Are you sure you wish to delete this query? This action cannot be undone.
</ConfirmDialog>

<style>
  div.icon {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }
</style>
