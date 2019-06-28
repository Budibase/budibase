const {
    initialiseData, 
    setupDatastore
} = require("budibase-core");
const constructHierarchy  = require("../utilities/constructHierarchy");
const getDatabaseManager = require("../utilities/databaseManager"); 
const {
    getApisForUser, 
    getApisWithFullAccess
} = require("../utilities/budibaseApi");  
const masterDbAppDefinition = require("../appPackages/master/appDefinition.json");
const masterDbAccessLevels = require("../appPackages/master/access_levels.json");
const { masterAppPackage } = require("../utilities/createAppPackage");

module.exports = async (datastoreModule, rootDatastoreConfig, appId, instanceId) => {
    try {

        const databaseManager = getDatabaseManager(
            datastoreModule, rootDatastoreConfig);
        
        await databaseManager.createEmptyInstanceDb(
            appId, instanceId);

        const dbConfig = databaseManager.getInstanceDatastoreConfig(
            appId, instanceId);

        const datastore = setupDatastore(
            datastoreModule.getDatastore(dbConfig));       

        await initialiseData(datastore, 
            constructHierarchy(masterDbAppDefinition));

        return dbConfig;

    } catch(e) {
        throw e;
    }
};




