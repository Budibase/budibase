const {
    initialiseData, 
    setupDatastore,
    common
} = require("budibase-core");
const constructHierarchy  = require("../utilities/constructHierarchy");
const getDatabaseManager = require("../utilities/databaseManager");  
const masterDbAppDefinition = require("../appPackages/master/appDefinition.json");
const { applictionVersionPackage }  = require("../utilities/createAppPackage");
const { last } = require("lodash/fp");
const {$,splitKey} = common;


module.exports = async (config, datastoreModule, rootDatastoreConfig, app, instance) => {
    try {

        const databaseManager = getDatabaseManager(
            datastoreModule, rootDatastoreConfig);
        
        await databaseManager.createEmptyInstanceDb(
            app.id, instance.id);

        const dbConfig = databaseManager.getInstanceDatastoreConfig(
            app.id, instance.id);

        const datastore = setupDatastore(
            datastoreModule.getDatastore(dbConfig));  
            
        const versionId = $(instance.version.key, [
            splitKey,
            last
        ]);

        const appPackage = applictionVersionPackage(
            config, app.name, versionId
        );

        await initialiseData(
            datastore, 
            appPackage.appDefinition,
            appPackage.accessLevels);

        return dbConfig;

    } catch(e) {
        throw e;
    }
};




