<script>
  import { onMount } from "svelte"
  import { selectedComponent, selectedScreen, store } from "builderStore"
  import { findComponent } from "builderStore/componentUtils"
  import { goto, isActive } from "@roxi/routify"
  import { notifications } from "@budibase/bbui"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"

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

  const handleKeyAction = async (event, component, key, ctrlKey = false) => {
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
      } else if (event) {
        event.preventDefault()
        event.stopPropagation()
      }
      return await handler(component)
    } catch (error) {
      notifications.error(error || "Error handling key press")
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
    return await handleKeyAction(
      e,
      $selectedComponent,
      e.key,
      e.ctrlKey || e.metaKey
    )
  }

  const handleComponentMenu = async e => {
    // Menu events can be for any component
    const { id, key, ctrlKey } = e.detail
    const component = findComponent($selectedScreen.props, id)
    return await handleKeyAction(null, component, key, ctrlKey)
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
  body={`Ejecting a block breaks it down into multiple components and cannot be undone. Are you sure you want to eject "${componentToEject?._instanceName}"?`}
  onOk={() => store.actions.components.requestEjectBlock(componentToEject?._id)}
  okText="Eject block"
/>
