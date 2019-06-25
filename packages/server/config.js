

module.exports = () => ({
    datastore: "local",
    datastoreConfig: {
        rootPath: "./.data"
    },
    keys: ["secret1", "secret2"],
    port: 4001,
    latestAppsPath: "./appPackages",
    masterPlugins: {},
    customizeMaster: appDefinition => appDefinition
})