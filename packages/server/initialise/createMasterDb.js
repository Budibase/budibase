const {initialiseData, setupDatastore} = require("budibase-core");
const constructHierarchy  = require("../utilities/constructHierarchy");
const getDatabaseManager = require("../utilities/databaseManager"); 
const {getApisForUser, getApisWithFullAccess} = require("../utilities/budibaseApi");  
const masterDbAppDefinition = require("../appPackages/master/appDefinition.json");
const masterDbAccessLevels = require("../appPackages/master/access_levels.json");
const { masterAppPackage } = require("../utilities/createAppPackage");

module.exports = async (datastoreModule, rootDatastoreConfig, username, password, budibaseConfig) => {
    try {
        const databaseManager = getDatabaseManager(datastoreModule, rootDatastoreConfig);
        
        await databaseManager.createEmptyMasterDb();
        const masterDbConfig = databaseManager.masterDatastoreConfig;
        const datastore = setupDatastore(
            datastoreModule.getDatastore(masterDbConfig)
        );

        await initialiseData(datastore, 
            constructHierarchy(masterDbAppDefinition));

        const bbMaster = await getApisWithFullAccess(
            datastore, masterAppPackage(budibaseConfig));
        await bbMaster.authApi.saveAccessLevels(masterDbAccessLevels);
        const user = bbMaster.authApi.getNewUser();
        user.name = username;
        user.accessLevels= ["owner"];
        await bbMaster.authApi.createUser(user, password);
        
        return await getApisForUser(datastore, masterAppPackage(budibaseConfig), username, password);
    } catch(e) {
        throw e;
    }
};




