<script>
  import { screenStore, componentStore, navigationStore } from "stores/builder"
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
  import sanitizeUrl from "helpers/sanitizeUrl"
  import { makeComponentUnique } from "helpers/components"
  import { capitalise } from "helpers"

  export let screenId

  let confirmDeleteDialog
  let screenDetailsModal

  $: screen = $screenStore.screens.find(screen => screen._id === screenId)
  $: noPaste = !$componentStore.componentToPaste

  const pasteComponent = mode => {
    try {
      componentStore.paste(screen.props, mode, screen)
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
      await screenStore.save(duplicateScreen)

      // Add new screen to navigation
      await navigationStore.saveLink(
        duplicateScreen.routing.route,
        capitalise(duplicateScreen.routing.route.split("/")[1]),
        duplicateScreen.routing.roleId
      )
    } catch (error) {
      notifications.error("Error duplicating screen")
    }
  }

  const deleteScreen = async () => {
    try {
      await screenStore.delete(screen)
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
