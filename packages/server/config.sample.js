

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
    port: 4001

})