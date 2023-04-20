<script>
  import { _ } from "../../../../../../../../../../../lang/i18n"
  import { store } from "builderStore"
  import { ActionMenu, MenuItem, Icon, notifications } from "@budibase/bbui"

  export let component

  $: definition = store.actions.components.getDefinition(component?._component)
  $: noPaste = !$store.componentToPaste

  // "editable" has been repurposed for inline text editing.
  // It remains here for legacy compatibility.
  // Future components should define "static": true for indicate they should
  // not show a context menu.
  $: showMenu = definition?.editable !== false && definition?.static !== true

  const storeComponentForCopy = (cut = false) => {
    store.actions.components.copy(component, cut)
  }

  const pasteComponent = mode => {
    try {
      store.actions.components.paste(component, mode)
    } catch (error) {
      notifications.error(
        $_(
          "pages.builder.app.application.design.screenId.components.componentId._components.navigation.ScreenslotDropdownMenu.Error_saving"
        )
      )
    }
  }
</script>

{#if showMenu}
  <ActionMenu>
    <div slot="control" class="icon">
      <Icon size="S" hoverable name="MoreSmallList" />
    </div>
    <MenuItem
      icon="Copy"
      keyBind="Ctrl+C"
      on:click={() => storeComponentForCopy(false)}
    >
      {$_(
        "pages.builder.app.application.design.screenId.components.componentId._components.navigation.ScreenslotDropdownMenu.Copy"
      )}
    </MenuItem>
    <MenuItem
      icon="LayersSendToBack"
      keyBind="Ctrl+V"
      on:click={() => pasteComponent("inside")}
      disabled={noPaste}
    >
      {$_(
        "pages.builder.app.application.design.screenId.components.componentId._components.navigation.ScreenslotDropdownMenu.Paste"
      )}
    </MenuItem>
  </ActionMenu>
{/if}

<style>
  .icon {
    display: grid;
    place-items: center;
  }
</style>
