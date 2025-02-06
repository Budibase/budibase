<script>
  import { onMount } from "svelte"
  import {
    selectedScreen,
    componentStore,
    selectedComponent,
    componentTreeNodesStore,
  } from "@/stores/builder"
  import { findComponent, getChildIdsForComponent } from "@/helpers/components"
  import { goto, isActive } from "@roxi/routify"
  import { notifications } from "@budibase/bbui"
  import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"

  let confirmDeleteDialog
  let confirmEjectDialog
  let componentToDelete
  let componentToEject

  const keyHandlers = {
    ["Ctrl+ArrowUp"]: async component => {
      await componentStore.moveUp(component)
    },
    ["Ctrl+ArrowDown"]: async component => {
      await componentStore.moveDown(component)
    },
    ["Ctrl+c"]: component => {
      componentStore.copy(component, false)
    },
    ["Ctrl+x"]: component => {
      componentStore.copy(component, true)
    },
    ["Ctrl+v"]: async component => {
      await componentStore.paste(component, "inside")
    },
    ["Ctrl+d"]: async component => {
      componentStore.copy(component)
      await componentStore.paste(component, "below")
    },
    ["Ctrl+e"]: component => {
      const definition = componentStore.getDefinition(component._component)
      const isBlock = definition?.block === true
      const canEject = !(definition?.ejectable === false)
      if (isBlock && canEject) {
        componentToEject = component
        confirmEjectDialog.show()
      }
    },
    ["Ctrl+Enter"]: () => {
      $goto(`./:componentId/new`)
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
      componentStore.selectPrevious()
    },
    ["ArrowDown"]: () => {
      componentStore.selectNext()
    },
    ["ArrowRight"]: component => {
      componentTreeNodesStore.expandNodes([component._id])
    },
    ["ArrowLeft"]: component => {
      // Select the collapsing root component to ensure the currently selected component is not
      // hidden in a collapsed node
      componentStore.select(component._id)
      componentTreeNodesStore.collapseNodes([component._id])
    },
    ["Ctrl+ArrowRight"]: component => {
      const childIds = getChildIdsForComponent(component)
      componentTreeNodesStore.expandNodes(childIds)
    },
    ["Ctrl+ArrowLeft"]: component => {
      // Select the collapsing root component to ensure the currently selected component is not
      // hidden in a collapsed node
      componentStore.select(component._id)

      const childIds = getChildIdsForComponent(component)
      componentTreeNodesStore.collapseNodes(childIds)
    },
    ["Escape"]: () => {
      if ($isActive(`./:componentId/new`)) {
        $goto(`./${$componentStore.selectedComponentId}`)
      }
    },
  }

  const handleKeyAction = async ({
    event,
    component,
    key,
    ctrlKey = false,
    shiftKey = false,
  }) => {
    if (!component || !key) {
      return false
    }
    try {
      // Delete and backspace are the same
      if (key === "Backspace") {
        key = "Delete"
      }
      // Prefix keys for modifiers
      if (shiftKey) {
        key = "Shift+" + key
      }
      if (ctrlKey) {
        key = "Ctrl+" + key
      }
      const handler = keyHandlers[key]
      if (!handler) {
        return false
      }

      if (event && key !== "Escape") {
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
    const inCodeEditor =
      document.activeElement?.classList?.contains("cm-content")
    const inPosthogSurvey =
      document.activeElement?.classList?.[0]?.startsWith("PostHogSurvey")
    if (
      (inCodeEditor ||
        inPosthogSurvey ||
        ["input", "textarea"].indexOf(activeTag) !== -1) &&
      e.key !== "Escape"
    ) {
      return
    }
    // Key events are always for the selected component
    return await handleKeyAction({
      event: e,
      component: $selectedComponent,
      key: e.key,
      ctrlKey: e.ctrlKey || e.metaKey,
      shiftKey: e.shiftKey,
    })
  }

  const handleComponentMenu = async e => {
    // Menu events can be for any component
    const { id, key, ctrlKey, shiftKey } = e.detail
    const component = findComponent($selectedScreen.props, id)
    return await handleKeyAction({
      event: null,
      component,
      key,
      ctrlKey,
      shiftKey,
    })
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
  onOk={() => componentStore.delete(componentToDelete)}
/>
<ConfirmDialog
  bind:this={confirmEjectDialog}
  title="Eject block"
  body={`Ejecting a block breaks it down into multiple components and cannot be undone. Are you sure you want to eject "${componentToEject?._instanceName}"?`}
  onOk={() => componentStore.requestEjectBlock(componentToEject?._id)}
  okText="Eject block"
/>
