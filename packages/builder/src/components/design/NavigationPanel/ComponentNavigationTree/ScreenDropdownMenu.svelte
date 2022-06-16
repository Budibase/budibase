<script>
  import { goto } from "@roxi/routify"
  import { store, allScreens } from "builderStore"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import {
    ActionMenu,
    MenuItem,
    Icon,
    Modal,
    Helpers,
    notifications,
  } from "@budibase/bbui"
  import ScreenDetailsModal from "../ScreenDetailsModal.svelte"
  import sanitizeUrl from "builderStore/store/screenTemplates/utils/sanitizeUrl"
  import { makeComponentUnique } from "builderStore/componentUtils"

  export let screenId

  let confirmDeleteDialog
  let screenDetailsModal

  $: screen = $allScreens.find(screen => screen._id === screenId)

  const duplicateScreen = () => {
    screenDetailsModal.show()
  }

  const createDuplicateScreen = async ({ screenName, screenUrl }) => {
    // Create a dupe and ensure it is unique
    let duplicateScreen = Helpers.cloneDeep(screen)
    delete duplicateScreen._id
    delete duplicateScreen._rev
    makeComponentUnique(duplicateScreen.props)

    // Attach the new name and URL
    duplicateScreen.routing.route = sanitizeUrl(screenUrl)
    duplicateScreen.props._instanceName = screenName

    try {
      // Create the screen
      await store.actions.screens.save(duplicateScreen)
    } catch (error) {
      notifications.error("Error duplicating screen")
      console.log(error)
    }
  }

  const deleteScreen = async () => {
    try {
      await store.actions.screens.delete(screen)
      $goto("../")
      notifications.success("Deleted screen successfully.")
    } catch (err) {
      notifications.error("Error deleting screen")
    }
  }

  const pasteComponent = mode => {
    try {
      store.actions.components.paste(screen?.props, mode)
    } catch (error) {
      notifications.error("Error saving component")
    }
  }
</script>

<ActionMenu>
  <div slot="control" class="icon">
    <Icon size="S" hoverable name="MoreSmallList" />
  </div>
  <MenuItem icon="Duplicate" on:click={duplicateScreen}>Duplicate</MenuItem>
  <MenuItem
    icon="ShowOneLayer"
    on:click={() => pasteComponent("inside")}
    disabled={!$store.componentToPaste}
  >
    Paste inside
  </MenuItem>
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
    screenName={screen?.props._instanceName}
    screenUrl={screen?.routing.route}
    confirmText="Duplicate"
  />
</Modal>

<style>
  .icon {
    display: grid;
    place-items: center;
  }
</style>
