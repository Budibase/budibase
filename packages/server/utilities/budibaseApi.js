const {getAppApis, getTemplateApi, crypto } = require("@budibase/core");
const getDatastore = require("./datastore");
const { masterAppPackage } = require("../utilities/createAppPackage");
const getDatabaseManager = require("../utilities/databaseManager");  


const constructHierarchy = (datastore, appDefinition) => {
    appDefinition.hierarchy = getTemplateApi({datastore})
        .constructHierarchy(appDefinition.hierarchy);
    return appDefinition;
}

module.exports.getApisWithFullAccess = async (datastore, appPackage) => {
    
    const appDefinition = constructHierarchy(
        datastore, 
        appPackage.appDefinition);

    const bb = await getAppApis(
        datastore, 
        appPackage.behaviourSources, 
        null, //cleanupTransations
        null, // getEpochTime
        crypto,
        appDefinition
    );

    bb.withFullAccess();

    return bb;
};

module.exports.getApisForUser = async (datastore, appPackage, username, password) => {
    const bb = await getAppApis(
        datastore, 
        appPackage.behaviourSources, 
        null, //cleanupTransations
        null, // getEpochTime
        crypto,
        constructHierarchy(
            datastore, 
            appPackage.appDefinition)
    );

    await bb.authenticateAs(username, password);

    return bb;
}

module.exports.getApisForSession = async (datastore, appPackage, session) => {

    const user = JSON.parse(session.user_json);

    const bb = await getAppApis(
        datastore, 
        appPackage.behaviourSources, 
        null, //cleanupTransations
        null, // getEpochTime
        crypto,
        constructHierarchy(
            datastore, 
            appPackage.appDefinition)
    );

    bb.asUser(user);

    return bb;
}

module.exports.getMasterApisWithFullAccess = async (context) => {
    const { config } = context;
    const datastoreModule = getDatastore(config);

    const databaseManager = getDatabaseManager(
        datastoreModule,
        config.datastoreConfig);


    const masterDatastore = datastoreModule.getDatastore(
        databaseManager.masterDatastoreConfig);

    return await module.exports.getApisWithFullAccess(
        masterDatastore, masterAppPackage(context));
}