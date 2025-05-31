const getAppContextMenuItems = ({
  app,
  onDuplicate,
  onExportDev,
  onExportProd,
  onDelete,
}) => {
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
      name: "Export latest edited app",
      keyBind: null,
      visible: true,
      disabled: false,
      callback: onExportDev,
    },
    {
      icon: "export",
      name: "Export latest published app",
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
