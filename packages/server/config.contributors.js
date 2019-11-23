

module.exports = () => ({
    datastore: "local",
    datastoreConfig: {
        rootPath: "./myapps/.data"
    },
    keys: ["secret1", "secret2"],
    port: 4001,
    latestPackagesFolder: "./myapps",
    extraMasterPlugins: {},
    dev:true,
    customizeMaster: appDefinition => appDefinition,
    useAppRootPath: true
})

