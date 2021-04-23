<script>
  import { goto } from "@roxi/routify"
  import { datasources } from "stores/backend"
  import { notifications } from "@budibase/bbui"
  import { Icon, Popover } from "@budibase/bbui"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { DropdownContainer, DropdownItem } from "components/common/Dropdowns"

  export let datasource

  let anchor
  let dropdown
  let confirmDeleteDialog

  function hideEditor() {
    dropdown?.hide()
  }

  function showModal() {
    hideEditor()
    confirmDeleteDialog.show()
  }

  async function deleteDatasource() {
    const wasSelectedSource = $datasources.selected
    console.log(wasSelectedSource)
    console.log(datasource)
    await datasources.delete(datasource)
    notifications.success("Datasource deleted")
    // navigate to first index page if the source you are deleting is selected
    if (wasSelectedSource === datasource._id) {
      $goto("./datasource")
    }
    hideEditor()
  }
</script>

<div on:click|stopPropagation>
  <div bind:this={anchor} class="icon" on:click={dropdown.show}>
    <Icon s hoverable name="MoreSmallList" />
  </div>
  <Popover align="left" {anchor} bind:this={dropdown}>
    <DropdownContainer>
      <DropdownItem
        icon="ri-delete-bin-line"
        title="Delete"
        on:click={showModal}
        data-cy="delete-datasource"
      />
    </DropdownContainer>
  </Popover>
</div>
<ConfirmDialog
  bind:this={confirmDeleteDialog}
  okText="Delete Datasource"
  onOk={deleteDatasource}
  title="Confirm Deletion"
>
  Are you sure you wish to delete the datasource
  <i>{datasource.name}?</i>
  This action cannot be undone.
</ConfirmDialog>

<style>
  div.icon {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }
</style>
