<script>
  import { store } from "builderStore"
  import { ActionMenu, MenuItem, Icon } from "@budibase/bbui"

  export let component

  $: noPaste = !$store.componentToPaste

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
    Delete
  </MenuItem>
  <MenuItem
    icon="ChevronUp"
    keyBind="Ctrl+!ArrowUp"
    on:click={() => keyboardEvent("ArrowUp", true)}
  >
    Move up
  </MenuItem>
  <MenuItem
    icon="ChevronDown"
    keyBind="Ctrl+!ArrowDown"
    on:click={() => keyboardEvent("ArrowDown", true)}
  >
    Move down
  </MenuItem>
  <MenuItem
    icon="Duplicate"
    keyBind="Ctrl+D"
    on:click={() => keyboardEvent("d", true)}
  >
    Duplicate
  </MenuItem>
  <MenuItem
    icon="Cut"
    keyBind="Ctrl+X"
    on:click={() => keyboardEvent("x", true)}
  >
    Cut
  </MenuItem>
  <MenuItem
    icon="Copy"
    keyBind="Ctrl+C"
    on:click={() => keyboardEvent("c", true)}
  >
    Copy
  </MenuItem>
  <MenuItem
    icon="LayersSendToBack"
    keyBind="Ctrl+V"
    on:click={() => keyboardEvent("v", true)}
    disabled={noPaste}
  >
    Paste
  </MenuItem>
</ActionMenu>

<style>
  .icon {
    display: grid;
    place-items: center;
  }
</style>
