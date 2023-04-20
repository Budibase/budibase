<script>
  import { _ } from "../../../../../../../../../../../lang/i18n"
  import { store } from "builderStore"
  import { ActionMenu, MenuItem, Icon } from "@budibase/bbui"

  export let component

  $: definition = store.actions.components.getDefinition(component?._component)
  $: noPaste = !$store.componentToPaste
  $: isBlock = definition?.block === true

  const keyboardEvent = (key, ctrlKey = false) => {
    document.dispatchEvent(
      new CustomEvent("component-menu", {
        detail: {
          key,
          ctrlKey,
          id: component?._id,
        },
      })
    )
  }
</script>

<ActionMenu>
  <div slot="control" class="icon">
    <Icon size="S" hoverable name="MoreSmallList" />
  </div>
  <MenuItem
    icon="Delete"
    keyBind="!BackAndroid"
    on:click={() => keyboardEvent("Delete")}
  >
    {$_(
      "pages.builder.app.application.design.screenId.components.componentId._components.navigation.ComponentDropDownMenu.Delete"
    )}
  </MenuItem>
  {#if isBlock}
    <MenuItem
      icon="Export"
      keyBind="Ctrl+E"
      on:click={() => keyboardEvent("e", true)}
    >
      {$_(
        "pages.builder.app.application.design.screenId.components.componentId._components.navigation.ComponentDropDownMenu.Eject_block"
      )}
    </MenuItem>
  {/if}
  <MenuItem
    icon="ChevronUp"
    keyBind="Ctrl+!ArrowUp"
    on:click={() => keyboardEvent("ArrowUp", true)}
  >
    {$_(
      "pages.builder.app.application.design.screenId.components.componentId._components.navigation.ComponentDropDownMenu.Move_up"
    )}
  </MenuItem>
  <MenuItem
    icon="ChevronDown"
    keyBind="Ctrl+!ArrowDown"
    on:click={() => keyboardEvent("ArrowDown", true)}
  >
    {$_(
      "pages.builder.app.application.design.screenId.components.componentId._components.navigation.ComponentDropDownMenu.Move_down"
    )}
  </MenuItem>
  <MenuItem
    icon="Duplicate"
    keyBind="Ctrl+D"
    on:click={() => keyboardEvent("d", true)}
  >
    {$_(
      "pages.builder.app.application.design.screenId.components.componentId._components.navigation.ComponentDropDownMenu.Duplicate"
    )}
  </MenuItem>
  <MenuItem
    icon="Cut"
    keyBind="Ctrl+X"
    on:click={() => keyboardEvent("x", true)}
  >
    {$_(
      "pages.builder.app.application.design.screenId.components.componentId._components.navigation.ComponentDropDownMenu.Cut"
    )}
  </MenuItem>
  <MenuItem
    icon="Copy"
    keyBind="Ctrl+C"
    on:click={() => keyboardEvent("c", true)}
  >
    {$_(
      "pages.builder.app.application.design.screenId.components.componentId._components.navigation.ComponentDropDownMenu.Copy"
    )}
  </MenuItem>
  <MenuItem
    icon="LayersSendToBack"
    keyBind="Ctrl+V"
    on:click={() => keyboardEvent("v", true)}
    disabled={noPaste}
  >
    {$_(
      "pages.builder.app.application.design.screenId.components.componentId._components.navigation.ComponentDropDownMenu.Paste"
    )}
  </MenuItem>
</ActionMenu>

<style>
  .icon {
    display: grid;
    place-items: center;
  }
</style>
