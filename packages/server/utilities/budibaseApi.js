const crypto = require("../nodeCrypto");
const {getAppApis} = require("budibase-core");

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

module.exports.getApisForSession = async (datastore, session) => {

    const user = JSON.parse(session.user_json);

    const bb = await getAppApis(
        datastore, 
        null, null, null,
        crypto
    );

    bb.asUser(user);

    return bb;
}