const crypto = require("../server/nodeCrypto");
const {
    getDatabaseFactory} = require("budibase-core");

module.exports.newField = (templateApi, recordNode) => (name, type, mandatory=false) => {
    const field = templateApi.getNewField(type);
    field.name = name;
    templateApi.addField(recordNode, field);
    if(mandatory) {
        templateApi.addRecordValidationRule(recordNode)
            (templateApi.commonValidationRules.fieldNotEmpty)
    }
    return field; 
};

module.exports.getApisWithFullAccess = async (datastore) => {
    const bb = await getAppApis(
        datastore, 
        null, null, null,
        crypto
    );

    bb.asFullAccess();

    return bb;
};

module.exports.getDatabaseManager = (datastoreModule) => 
    getDatabaseFactory(datastoreModule.databaseManager);
