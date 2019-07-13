

module.exports = () => ({

    // the datastore type. should link to a module ...
    // ../datastores/datastores/<datastore>.js
    datastore: "local",

    // a config object passed to the datastore.databaseManager
    datastoreConfig: {
        rootPath: "./.data"
    },

    // cookie signing keys,these are secret 
    keys: ["secret1", "secret1"],

    // port for http server to listen on
    port: 4001,

    // path to where your appDefinition etc is stored (dev time)
    latestPackagesFolder: "./",

    // register plugins for master
    extraMasterPlugins: {},

    // make modifications to master's appdefinition - e.g. add plugins
    customizeMaster: appDefinition => appDefinition,

    // false for production - serves builder if true
    dev:false

})