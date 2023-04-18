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
  import ScreenDetailsModal from "./ScreenDetailsModal.svelte"
  import sanitizeUrl from "builderStore/store/screenTemplates/utils/sanitizeUrl"
  import { makeComponentUnique } from "builderStore/componentUtils"

  import { _ } from "lang/i18n"

  export let screenId

  let confirmDeleteDialog
  let screenDetailsModal

  $: screen = $store.screens.find(screen => screen._id === screenId)
  $: noPaste = !$store.componentToPaste

  const pasteComponent = mode => {
    try {
      store.actions.components.paste(screen.props, mode, screen)
    } catch (error) {
      notifications.error(
        $_(
          "pages.builder.app.application.design.screenId.screens._components.ScreenDropdownMenu.Error_saving"
        )
      )
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
      notifications.error(
        $_(
          "pages.builder.app.application.design.screenId.screens._components.ScreenDropdownMenu.Error_duplicating"
        )
      )
    }
  }

  const deleteScreen = async () => {
    try {
      await store.actions.screens.delete(screen)
      notifications.success(
        $_(
          "pages.builder.app.application.design.screenId.screens._components.ScreenDropdownMenu.Deleted_screen"
        )
      )
    } catch (err) {
      notifications.error(
        $_(
          "pages.builder.app.application.design.screenId.screens._components.ScreenDropdownMenu.Error_deleting"
        )
      )
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
    {$_(
      "pages.builder.app.application.design.screenId.screens._components.ScreenDropdownMenu.Paste_inside"
    )}
  </MenuItem>
  <MenuItem icon="Duplicate" on:click={duplicateScreen}
    >{$_(
      "pages.builder.app.application.design.screenId.screens._components.ScreenDropdownMenu.Duplicate"
    )}</MenuItem
  >
  <MenuItem icon="Delete" on:click={confirmDeleteDialog.show}
    >{$_(
      "pages.builder.app.application.design.screenId.screens._components.ScreenDropdownMenu.Delete"
    )}</MenuItem
  >
</ActionMenu>

<ConfirmDialog
  bind:this={confirmDeleteDialog}
  title={$_(
    "pages.builder.app.application.design.screenId.screens._components.ScreenDropdownMenu.Confirm_Deletion"
  )}
  body={$_(
    "pages.builder.app.application.design.screenId.screens._components.ScreenDropdownMenu.wish_delete"
  )}
  okText={$_(
    "pages.builder.app.application.design.screenId.screens._components.ScreenDropdownMenu.Delete_screen"
  )}
  onOk={deleteScreen}
/>

<Modal bind:this={screenDetailsModal}>
  <ScreenDetailsModal
    onConfirm={createDuplicateScreen}
    screenUrl={screen?.routing.route}
    screenRole={screen?.routing.roleId}
    confirmText={$_(
      "pages.builder.app.application.design.screenId.screens._components.ScreenDropdownMenu.Duplicate"
    )}
  />
</Modal>

<style>
  .icon {
    display: grid;
    place-items: center;
  }
</style>
