const createMasterDb = require("./createMasterDb");
//datastore.createDb("productSet", "product", "instance");

module.exports = async (datastoreFactory, rootDataOpts, username, password) => {
    await createMasterDb(
        datastoreFactory, rootDataOpts, 
        username, password);

    

}

