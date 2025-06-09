import { featureFlag } from "@/helpers"
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
  const appOrWorkspace = featureFlag.isEnabled("WORKSPACE_APPS")
    ? "workspace"
    : "app"
  return [
    {
      icon: "Copy",
      name: "Duplicate",
      keyBind: null,
      visible: true,
      disabled: false,
      callback: onDuplicate,
    },
    {
      icon: "Export",
      name: `Export latest edited ${appOrWorkspace}`,
      keyBind: null,
      visible: true,
      disabled: false,
      callback: onExportDev,
    },
    {
      icon: "Export",
      name: `Export latest published ${appOrWorkspace}`,
      keyBind: null,
      visible: true,
      disabled: !app.deployed,
      callback: onExportProd,
    },
    {
      icon: "Delete",
      name: "Delete",
      keyBind: null,
      visible: true,
      disabled: false,
      callback: onDelete,
    },
  ]
}

export default getAppContextMenuItems
