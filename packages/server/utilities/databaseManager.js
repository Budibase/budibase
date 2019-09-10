const {getDatabaseManager} = require("@budibase/core");

module.exports = (datastoreModule, datastoreConfig) => 
    getDatabaseManager(datastoreModule.databaseManager(datastoreConfig));
