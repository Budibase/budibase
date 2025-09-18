import { MenuItem } from "@/types"

const getAppContextMenuItems = ({
  app,
  onDuplicate,
  onExportDev,
  onExportProd,
  onDelete,
}: {
  app: { deployed: boolean }
  onDuplicate: () => void
  onExportDev: () => void
  onExportProd: () => void
  onDelete: () => void
}): MenuItem[] => {
  return [
    {
      icon: "copy",
      name: "Duplicate",
      keyBind: null,
      visible: true,
      disabled: false,
      callback: onDuplicate,
    },
    {
      icon: "export",
      name: `Export latest edited workspace`,
      keyBind: null,
      visible: true,
      disabled: false,
      callback: onExportDev,
    },
    {
      icon: "export",
      name: `Export latest published workspace`,
      keyBind: null,
      visible: true,
      disabled: !app.deployed,
      callback: onExportProd,
    },
    {
      icon: "trash",
      name: "Delete",
      keyBind: null,
      visible: true,
      disabled: false,
      callback: onDelete,
    },
  ]
}

export default getAppContextMenuItems
