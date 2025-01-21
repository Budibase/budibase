import { get } from "svelte/store"
import { componentStore } from "@/stores/builder"
import { notifications } from "@budibase/bbui"

const getContextMenuItems = (component, showCopy) => {
  const noPaste = !get(componentStore).componentToPaste

  const storeComponentForCopy = (cut = false) => {
    componentStore.copy(component, cut)
  }

  const pasteComponent = mode => {
    try {
      componentStore.paste(component, mode)
    } catch (error) {
      notifications.error("Error saving component")
    }
  }

  return [
    {
      icon: "Copy",
      name: "Copy",
      keyBind: "Ctrl+C",
      visible: showCopy,
      disabled: false,
      callback: () => storeComponentForCopy(false),
    },
    {
      icon: "LayersSendToBack",
      name: "Paste",
      keyBind: "Ctrl+V",
      visible: true,
      disabled: noPaste,
      callback: () => pasteComponent("inside"),
    },
  ]
}

export default getContextMenuItems
