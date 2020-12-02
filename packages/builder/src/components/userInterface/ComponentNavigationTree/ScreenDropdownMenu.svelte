<script>
  import { goto } from "@sveltech/routify"
  import { store, allScreens } from "builderStore"
  import { notifier } from "builderStore/store/notifications"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import EditScreenLayoutModal from "./EditScreenLayoutModal.svelte"
  import { DropdownMenu, Modal, ModalContent } from "@budibase/bbui"
  import { DropdownContainer, DropdownItem } from "components/common/Dropdowns"

  export let screenId

  let confirmDeleteDialog
  let editLayoutDialog
  let dropdown
  let anchor

  $: screen = $allScreens.find(screen => screen._id === screenId)

  const deleteScreen = () => {
    store.actions.screens.delete(screen)
    store.actions.routing.fetch()
  }

  async function saveScreen() {
    try {
      await store.actions.screens.save(screen)
    } catch (err) {
      notifier.danger("Error saving page.")
    }
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
      <DropdownItem
        icon="ri-layout-line"
        title="Set Layout"
        on:click={() => editLayoutDialog.show()} />
    </DropdownContainer>
  </DropdownMenu>
</div>
<ConfirmDialog
  bind:this={confirmDeleteDialog}
  title="Confirm Deletion"
  body={'Are you sure you wish to delete this screen?'}
  okText="Delete Screen"
  onOk={deleteScreen} />

<Modal bind:this={editLayoutDialog}>
  <ModalContent onConfirm={saveScreen} title={'Set Layout For Screen'}>
    <EditScreenLayoutModal bind:layout={screen.props.layoutId} />
  </ModalContent>
</Modal>

<style>
  .icon i {
    font-size: 16px;
  }
</style>
