const getAppContextMenuItems = ({
  app,
  onDuplicate,
  onExportDev,
  onExportProd,
  onDelete,
}) => {
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
      name: "Export latest edited app",
      keyBind: null,
      visible: true,
      disabled: false,
      callback: onExportDev,
    },
    {
      icon: "Export",
      name: "Export latest published app",
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
