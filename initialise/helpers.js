const crypto = require("../server/nodeCrypto");
const {getDatabaseManager, getAppApis} = require("budibase-core");

module.exports.getApisWithFullAccess = async (datastore) => {
    const bb = await getAppApis(
        datastore, 
        null, null, null,
        crypto
    );

    bb.withFullAccess();

    return bb;
};

module.exports.getApisForUser = async (datastore, username, password) => {
    const bb = await getAppApis(
        datastore, 
        null, null, null,
        crypto
    );

    await bb.authenticateAs(username, password);

    return bb;
}

module.exports.getDatabaseManager = (datastoreModule, datastoreConfig) => 
    getDatabaseManager(datastoreModule.databaseManager(datastoreConfig));
