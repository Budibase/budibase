<script>
  import { store } from "builderStore"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import {
    ActionMenu,
    MenuItem,
    Icon,
    Modal,
    Helpers,
    notifications,
  } from "@budibase/bbui"
  import ScreenDetailsModal from "components/design/ScreenDetailsModal.svelte"
  import sanitizeUrl from "builderStore/store/screenTemplates/utils/sanitizeUrl"
  import { makeComponentUnique } from "builderStore/componentUtils"

  export let screenId

  let confirmDeleteDialog
  let screenDetailsModal

  $: screen = $store.screens.find(screen => screen._id === screenId)
  $: noPaste = !$store.componentToPaste

  const pasteComponent = mode => {
    try {
      store.actions.components.paste(screen.props, mode, screen)
    } catch (error) {
      notifications.error("Error saving component")
    }
  }

  const duplicateScreen = () => {
    screenDetailsModal.show()
  }

  const createDuplicateScreen = async ({ screenName, screenUrl }) => {
    // Create a dupe and ensure it is unique
    let duplicateScreen = Helpers.cloneDeep(screen)
    delete duplicateScreen._id
    delete duplicateScreen._rev
    duplicateScreen.props = makeComponentUnique(duplicateScreen.props)

    // Attach the new name and URL
    duplicateScreen.routing.route = sanitizeUrl(screenUrl)
    duplicateScreen.routing.homeScreen = false
    duplicateScreen.props._instanceName = screenName

    try {
      // Create the screen
      await store.actions.screens.save(duplicateScreen)
    } catch (error) {
      notifications.error("Error duplicating screen")
    }
  }

  const deleteScreen = async () => {
    try {
      await store.actions.screens.delete(screen)
      notifications.success("Deleted screen successfully")
    } catch (err) {
      notifications.error("Error deleting screen")
    }
  }
</script>

<ActionMenu>
  <div slot="control" class="icon">
    <Icon size="S" hoverable name="MoreSmallList" />
  </div>
  <MenuItem
    icon="ShowOneLayer"
    on:click={() => pasteComponent("inside")}
    disabled={noPaste}
  >
    Paste inside
  </MenuItem>
  <MenuItem icon="Duplicate" on:click={duplicateScreen}>Duplicate</MenuItem>
  <MenuItem icon="Delete" on:click={confirmDeleteDialog.show}>Delete</MenuItem>
</ActionMenu>

<ConfirmDialog
  bind:this={confirmDeleteDialog}
  title="Confirm Deletion"
  body={"Are you sure you wish to delete this screen?"}
  okText="Delete screen"
  onOk={deleteScreen}
/>

<Modal bind:this={screenDetailsModal}>
  <ScreenDetailsModal
    onConfirm={createDuplicateScreen}
    screenUrl={screen?.routing.route}
    screenRole={screen?.routing.roleId}
    confirmText="Duplicate"
  />
</Modal>

<style>
  .icon {
    display: grid;
    place-items: center;
  }
</style>
