const {
    initialiseData, 
    setupDatastore,
    common
} = require("@budibase/core");
const getDatabaseManager = require("../utilities/databaseManager");  
const { applictionVersionPackage }  = require("../utilities/createAppPackage");
const { last } = require("lodash/fp");
const {$,splitKey} = common;


module.exports = async (context, datastoreModule, app, instance) => {
    try {

        const databaseManager = getDatabaseManager(
            datastoreModule,
            context.config.datastoreConfig);
        
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

        const appPackage = await applictionVersionPackage(
            context, app.name, versionId, instance.key
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




