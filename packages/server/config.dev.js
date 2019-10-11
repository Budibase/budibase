

module.exports = () => ({
    datastore: "local",
    datastoreConfig: {
        rootPath: "./.data"
    },
    keys: ["secret1", "secret2"],
    port: 4001,
    latestPackagesFolder: ".",
    extraMasterPlugins: {},
    dev:true,
    customizeMaster: appDefinition => appDefinition,
    useAppRootPath: true
})

