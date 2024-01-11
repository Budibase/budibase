<script>
  import { store } from "builderStore"
  import { ActionMenu, MenuItem, Icon } from "@budibase/bbui"

  export let component
  export let opened

  $: definition = store.actions.components.getDefinition(component?._component)
  $: noPaste = !$store.componentToPaste
  $: isBlock = definition?.block === true
  $: canEject = !(definition?.ejectable === false)

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
  {#if isBlock && canEject}
    <MenuItem
      icon="Export"
      keyBind="Ctrl+E"
      on:click={() => keyboardEvent("e", true)}
    >
      Eject block
    </MenuItem>
  {/if}
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

  {#if component._children.length > 0}
    <MenuItem
      icon="TreeExpand"
      keyBind="!ArrowRight"
      on:click={() => keyboardEvent("ArrowRight", false)}
      disabled={opened}
    >
      Expand
    </MenuItem>
    <MenuItem
      icon="TreeCollapse"
      keyBind="!ArrowLeft"
      on:click={() => keyboardEvent("ArrowLeft", false)}
      disabled={!opened}
    >
      Collapse
    </MenuItem>
    <MenuItem
      icon="TreeExpandAll"
      keyBind="Ctrl+!ArrowRight"
      on:click={() => keyboardEvent("ArrowRight", true)}
    >
      Expand All
    </MenuItem>
    <MenuItem
      icon="TreeCollapseAll"
      keyBind="Ctrl+!ArrowLeft"
      on:click={() => keyboardEvent("ArrowLeft", true)}
    >
      Collapse All
    </MenuItem>
  {/if}
</ActionMenu>

<style>
  .icon {
    display: grid;
    place-items: center;
  }
</style>
