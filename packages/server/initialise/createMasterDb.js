const {initialiseData, setupDatastore,
    getTemplateApi} = require("budibase-core");
const getDatabaseManager = require("../utilities/databaseManager"); 
const {getApisForUser, getApisWithFullAccess} = require("../utilities/budibaseApi");  
const masterDbAppDefinition = require("../appPackages/master/appDefinition.json");
const masterDbAccessLevels = require("../appPackages/master/access_levels.json");

module.exports = async (datastoreModule, rootConfig, username, password) => {
    try {
        const databaseManager = getDatabaseManager(datastoreModule, rootConfig);
        
        await databaseManager.createEmptyMasterDb();
        const masterDbConfig = databaseManager.masterDatastoreConfig;
        const datastore = setupDatastore(
            datastoreModule.getDatastore(masterDbConfig)
        );

        const templateApi = getTemplateApi({datastore});

        await initialiseData(datastore, {
            heirarchy:templateApi.constructHeirarchy(masterDbAppDefinition.hierarchy), 
            actions:masterDbAppDefinition.actions, 
            triggers:masterDbAppDefinition.triggers
        });

        const bbMaster = await getApisWithFullAccess(datastore);
        await bbMaster.authApi.saveAccessLevels(masterDbAccessLevels);
        const user = bbMaster.authApi.getNewUser();
        user.name = username;
        user.accessLevels= ["owner"];
        await bbMaster.authApi.createUser(user, password);
        
        return await getApisForUser(datastore, username, password);
    } catch(e) {
        throw e;
    }
};




