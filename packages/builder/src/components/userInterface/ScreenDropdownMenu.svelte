<script>
  import { goto } from "@sveltech/routify"
  import { store } from "builderStore"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { DropdownMenu } from "@budibase/bbui"
  import { DropdownContainer, DropdownItem } from "components/common/Dropdowns"

  export let screen

  let confirmDeleteDialog
  let dropdown
  let anchor

  const deleteScreen = () => {
    store.deleteScreens(screen, $store.currentPageName)
    // update the page if required
    store.update((state) => {
      if (state.currentPreviewItem.name === screen.name) {
        store.setCurrentPage($store.currentPageName)
        $goto(`./:page/page-layout`)
      }
      return state
    })
  }
</script>

<div bind:this={anchor} on:click|stopPropagation>
  <div class="icon" on:click={() => dropdown.show()}>
    <i class="ri-more-line" />
  </div>
  <DropdownMenu bind:this={dropdown} {anchor} align="left">
    <DropdownContainer>
      <DropdownItem
        icon="ri-delete-bin-line"
        title="Delete"
        on:click={() => confirmDeleteDialog.show()} />
    </DropdownContainer>
  </DropdownMenu>
</div>
<ConfirmDialog
  bind:this={confirmDeleteDialog}
  title="Confirm Delete"
  body={`Are you sure you wish to delete the screen '${screen.props._instanceName}' ?`}
  okText="Delete Screen"
  onOk={deleteScreen} />

<style>
  .icon i {
    font-size: 16px;
  }
</style>
