<script>
  import Panel from "components/design/Panel.svelte"
  import ComponentTree from "./ComponentTree.svelte"
  import { dndStore } from "./dndStore.js"
  import { goto, isActive } from "@roxi/routify"
  import { store, selectedScreen, selectedComponent } from "builderStore"
  import NavItem from "components/common/NavItem.svelte"
  import ScreenslotDropdownMenu from "./ScreenslotDropdownMenu.svelte"
  import { setContext, onMount } from "svelte"
  import DNDPositionIndicator from "./DNDPositionIndicator.svelte"
  import { DropPosition } from "./dndStore"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { notifications, Button } from "@budibase/bbui"
  import { findComponent } from "builderStore/componentUtils"

  let scrollRef
  let confirmDeleteDialog
  let confirmEjectDialog
  let componentToDelete
  let componentToEject

  const keyHandlers = {
    ["^ArrowUp"]: async component => {
      await store.actions.components.moveUp(component)
    },
    ["^ArrowDown"]: async component => {
      await store.actions.components.moveDown(component)
    },
    ["^c"]: component => {
      store.actions.components.copy(component, false)
    },
    ["^x"]: component => {
      store.actions.components.copy(component, true)
    },
    ["^v"]: async component => {
      await store.actions.components.paste(component, "inside")
    },
    ["^d"]: async component => {
      store.actions.components.copy(component)
      await store.actions.components.paste(component, "below")
    },
    ["^e"]: component => {
      componentToEject = component
      confirmEjectDialog.show()
    },
    ["^Enter"]: () => {
      $goto("./new")
    },
    ["Delete"]: component => {
      // Don't show confirmation for the screen itself
      if (component?._id === $selectedScreen.props._id) {
        return false
      }
      componentToDelete = component
      confirmDeleteDialog.show()
    },
    ["ArrowUp"]: () => {
      store.actions.components.selectPrevious()
    },
    ["ArrowDown"]: () => {
      store.actions.components.selectNext()
    },
    ["Escape"]: () => {
      if (!$isActive("/new")) {
        return false
      }
      $goto("./")
    },
  }

  const scrollTo = bounds => {
    if (!bounds) {
      return
    }
    const sidebarWidth = 259
    const navItemHeight = 32
    const { scrollLeft, scrollTop, offsetHeight } = scrollRef
    let scrollBounds = scrollRef.getBoundingClientRect()
    let newOffsets = {}

    // Calculate left offset
    const offsetX = bounds.left + bounds.width + scrollLeft - 36
    if (offsetX > sidebarWidth) {
      newOffsets.left = offsetX - sidebarWidth
    } else {
      newOffsets.left = 0
    }
    if (newOffsets.left === scrollLeft) {
      delete newOffsets.left
    }

    // Calculate top offset
    const offsetY = bounds.top - scrollBounds?.top + scrollTop
    if (offsetY > scrollTop + offsetHeight - 2 * navItemHeight) {
      newOffsets.top = offsetY - offsetHeight + 2 * navItemHeight
    } else if (offsetY < scrollTop + navItemHeight) {
      newOffsets.top = offsetY - navItemHeight
    } else {
      delete newOffsets.top
    }

    // Skip if offset is unchanged
    if (newOffsets.left == null && newOffsets.top == null) {
      return
    }

    // Smoothly scroll to the offset
    scrollRef.scroll({
      ...newOffsets,
      behavior: "smooth",
    })
  }

  // Set scroll context so components can invoke scrolling when selected
  setContext("scroll", {
    scrollTo,
  })

  const onDrop = async () => {
    try {
      await dndStore.actions.drop()
    } catch (error) {
      console.error(error)
      notifications.error("Error saving component")
    }
  }

  const handleKeyAction = async (component, key, ctrlKey = false) => {
    if (!component || !key) {
      return false
    }
    try {
      // Delete and backspace are the same
      if (key === "Backspace") {
        key = "Delete"
      }
      // Prefix key with a caret for ctrl modifier
      if (ctrlKey) {
        key = "^" + key
      }
      const handler = keyHandlers[key]
      if (!handler) {
        return false
      }
      return handler(component)
    } catch (error) {
      console.log(error)
      notifications.error("Error handling key press")
    }
  }

  const handleKeyPress = async e => {
    // Ignore repeating events
    if (e.repeat) {
      return
    }
    // Ignore events when typing
    const activeTag = document.activeElement?.tagName.toLowerCase()
    if (["input", "textarea"].indexOf(activeTag) !== -1 && e.key !== "Escape") {
      return
    }
    // Key events are always for the selected component
    return handleKeyAction($selectedComponent, e.key, e.ctrlKey || e.metaKey)
  }

  const handleComponentMenu = async e => {
    // Menu events can be for any component
    const { id, key, ctrlKey } = e.detail
    const component = findComponent($selectedScreen.props, id)
    return await handleKeyAction(component, key, ctrlKey)
  }

  onMount(() => {
    document.addEventListener("keydown", handleKeyPress)
    document.addEventListener("component-menu", handleComponentMenu)
    return () => {
      document.removeEventListener("keydown", handleKeyPress)
      document.removeEventListener("component-menu", handleComponentMenu)
    }
  })
</script>

<Panel title="Components" showExpandIcon borderRight>
  <div class="add-component">
    <Button on:click={() => $goto("./new")} cta>Add component</Button>
  </div>
  <div class="nav-items-container" bind:this={scrollRef}>
    <ul>
      <li
        on:click={() => {
          $store.selectedComponentId = $selectedScreen?.props._id
        }}
        id={`component-${$selectedScreen?.props._id}`}
      >
        <NavItem
          text="Screen"
          indentLevel={0}
          selected={$store.selectedComponentId === $selectedScreen?.props._id}
          opened
          scrollable
          icon="WebPage"
          on:drop={onDrop}
        >
          <ScreenslotDropdownMenu component={$selectedScreen?.props} />
        </NavItem>
        <ComponentTree
          level={0}
          components={$selectedScreen?.props._children}
        />

        <!-- Show drop indicators for the target and the parent -->
        {#if $dndStore.dragging && $dndStore.valid}
          <DNDPositionIndicator
            component={$dndStore.target}
            position={$dndStore.dropPosition}
          />
          {#if $dndStore.dropPosition !== DropPosition.INSIDE}
            <DNDPositionIndicator
              component={$dndStore.targetParent}
              position={DropPosition.INSIDE}
            />
          {/if}
        {/if}
      </li>
    </ul>
  </div>
</Panel>
<ConfirmDialog
  bind:this={confirmDeleteDialog}
  title="Confirm Deletion"
  body={`Are you sure you want to delete "${componentToDelete?._instanceName}"?`}
  okText="Delete Component"
  onOk={() => store.actions.components.delete(componentToDelete)}
/>
<ConfirmDialog
  bind:this={confirmEjectDialog}
  title="Eject block"
  body={`Ejecting a block breaks it down into multiple components. Are you sure you want to eject "${componentToEject?._instanceName}"?`}
  onOk={() => store.actions.components.requestEjectBlock(componentToEject?._id)}
  okText="Eject block"
/>

<style>
  .add-component {
    padding: var(--spacing-xl) var(--spacing-l);
    padding-bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
  .nav-items-container {
    padding: var(--spacing-xl) 0;
    flex: 1 1 auto;
    overflow: auto;
    height: 0;
  }
  ul {
    list-style: none;
    padding-left: 0;
    margin: 0;
    position: relative;
  }
  ul,
  li {
    min-width: max-content;
  }
</style>
