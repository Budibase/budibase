const {initialiseData, setupDatastore} = require("@budibase/core");
const constructHierarchy  = require("../utilities/constructHierarchy");
const getDatabaseManager = require("../utilities/databaseManager"); 
const {getApisForUser, getApisWithFullAccess} = require("../utilities/budibaseApi");  
const masterDbAppDefinition = require("../appPackages/_master/appDefinition.json");
const masterDbAccessLevels = require("../appPackages/_master/access_levels.json");
const { masterAppPackage } = require("../utilities/createAppPackage");

module.exports = async (context, datastoreModule, username, password) => {
    try {
        const { config } = context;
        const databaseManager = getDatabaseManager(
            datastoreModule, config.datastoreConfig);
        
        await databaseManager.createEmptyMasterDb();
        const masterDbConfig = databaseManager.masterDatastoreConfig;
        const datastore = setupDatastore(
            datastoreModule.getDatastore(masterDbConfig)
        );

        await initialiseData(datastore, 
            constructHierarchy(masterDbAppDefinition));

        const masterPackage = masterAppPackage(context); 
        const bbMaster = await getApisWithFullAccess(
            datastore, masterPackage);
        await bbMaster.authApi.saveAccessLevels(masterDbAccessLevels);
        const user = bbMaster.authApi.getNewUser();
        user.name = username;
        user.accessLevels= ["owner"];
        await bbMaster.authApi.createUser(user, password);
        
        return await getApisForUser(
            datastore, 
            masterPackage, 
            username, 
            password);
    } catch(e) {
        throw e;
    }
};




