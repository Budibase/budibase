module.exports = () => ({
  database: "pouch",
  adminSecret: "",
  port: 4001,
  latestPackagesFolder: ".",
  extraMasterPlugins: {},
  customizeMaster: appDefinition => appDefinition,
  useAppRootPath: true,
})
