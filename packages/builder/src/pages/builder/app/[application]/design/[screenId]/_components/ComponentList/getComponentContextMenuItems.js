import { get } from "svelte/store"
import { componentStore } from "@/stores/builder"

const getContextMenuItems = (component, componentCollapsed) => {
  const definition = componentStore.getDefinition(component?._component)
  const noPaste = !get(componentStore).componentToPaste
  const isBlock = definition?.block === true
  const canEject = !(definition?.ejectable === false)
  const hasChildren = component?._children?.length

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

  return [
    {
      icon: "Delete",
      name: "Delete",
      keyBind: "!BackAndroid",
      visible: true,
      disabled: false,
      callback: () => keyboardEvent("Delete"),
    },
    {
      icon: "ChevronUp",
      name: "Move up",
      keyBind: "Ctrl+!ArrowUp",
      visible: true,
      disabled: false,
      callback: () => keyboardEvent("ArrowUp", true),
    },
    {
      icon: "ChevronDown",
      name: "Move down",
      keyBind: "Ctrl+!ArrowDown",
      visible: true,
      disabled: false,
      callback: () => keyboardEvent("ArrowDown", true),
    },
    {
      icon: "Duplicate",
      name: "Duplicate",
      keyBind: "Ctrl+D",
      visible: true,
      disabled: false,
      callback: () => keyboardEvent("d", true),
    },
    {
      icon: "Cut",
      name: "Cut",
      keyBind: "Ctrl+X",
      visible: true,
      disabled: false,
      callback: () => keyboardEvent("x", true),
    },
    {
      icon: "Copy",
      name: "Copy",
      keyBind: "Ctrl+C",
      visible: true,
      disabled: false,
      callback: () => keyboardEvent("c", true),
    },
    {
      icon: "LayersSendToBack",
      name: "Paste",
      keyBind: "Ctrl+V",
      visible: true,
      disabled: noPaste,
      callback: () => keyboardEvent("v", true),
    },
    {
      icon: "Export",
      name: "Eject block",
      keyBind: "Ctrl+E",
      visible: isBlock && canEject,
      disabled: false,
      callback: () => keyboardEvent("e", true),
    },
    {
      icon: "TreeExpand",
      name: "Expand",
      keyBind: "!ArrowRight",
      visible: hasChildren,
      disabled: !componentCollapsed,
      callback: () => keyboardEvent("ArrowRight", false),
    },
    {
      icon: "TreeExpandAll",
      name: "Expand All",
      keyBind: "Ctrl+!ArrowRight",
      visible: hasChildren,
      disabled: !componentCollapsed,
      callback: () => keyboardEvent("ArrowRight", true),
    },
    {
      icon: "TreeCollapse",
      name: "Collapse",
      keyBind: "!ArrowLeft",
      visible: hasChildren,
      disabled: componentCollapsed,
      callback: () => keyboardEvent("ArrowLeft", false),
    },
    {
      icon: "TreeCollapseAll",
      name: "Collapse All",
      keyBind: "Ctrl+!ArrowLeft",
      visible: hasChildren,
      disabled: componentCollapsed,
      callback: () => keyboardEvent("ArrowLeft", true),
    },
  ]
}

export default getContextMenuItems
