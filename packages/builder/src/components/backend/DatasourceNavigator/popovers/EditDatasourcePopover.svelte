<script>
  import { goto } from "@sveltech/routify"
  import { datasources } from 'builderStore/store/backend/'
  import { notifier } from "builderStore/store/notifications"
  import { DropdownMenu } from "@budibase/bbui"
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
    await datasources.delete(datasource)
    notifier.success("Datasource deleted")
    $goto('./datasource')
    hideEditor()
  }
</script>

<div on:click|stopPropagation>
  <div bind:this={anchor} class="icon" on:click={dropdown.show}>
    <i class="ri-more-line" />
  </div>
  <DropdownMenu align="left" {anchor} bind:this={dropdown}>
    <DropdownContainer>
      <DropdownItem
        icon="ri-delete-bin-line"
        title="Delete"
        on:click={showModal}
        data-cy="delete-datasource" />
    </DropdownContainer>
  </DropdownMenu>
</div>
<ConfirmDialog
  bind:this={confirmDeleteDialog}
  okText="Delete Datasource"
  onOk={deleteDatasource}
  title="Confirm Deletion">
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

  div.icon i {
    font-size: 16px;
  }
</style>
