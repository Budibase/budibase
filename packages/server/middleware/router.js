const {getAppApis} = require("budibase-core");

module.exports = (datastoreConfig, datastoreModule, method, path) => {

    const datastore = datastoreModule.getDatastore(
        datastoreConfig);
        
    const bb = getAppApis(
        datastore
    )

}






/* api Routes (all /api/..)

POST executeAction/<name> {}
POST authenticate {}
POST authenticateTemporaryAccess {}
POST createUser {}
POST enabledUser {}
POST disableUser {}
GET users 
GET accessLevels
POST accessLevels {}
POST changeMyPassword {}
POST setPasswordFromTemporaryCode {}
POST listItems/index/key {}
POST aggregates/index/key {}
POST record/key/to/rec {}
GET record/key/to/rec
DELETE record/key/to/rec
POST appHeirarchy {}
POST actionsAndTriggers {}
GET appDefinition

*/