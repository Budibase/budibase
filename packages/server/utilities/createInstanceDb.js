const {common, getAppApis} = require("budibase-core");
const {getDatabaseManager} = require("./databaseManager"); 

module.exports = async (productSetId, productId, versionId) => {
    const databaseManager = getDatabaseManager(datastoreModule);
    const masterDatastore = datastoreModule.getDatastore(
        databaseManager.masterDatastoreConfig
    );
    
    const master = await getAppApis(masterDatastore);

    const productSet = await master.recordApi.load(
        common.joinKey("ProductSets", productSetId)
    );

    const prodcutSetDatastore = datastoreModule.getDatastore(
        productSet.datastoreConfig
    );

    const productSetApis = await getAppApis(prodcutSetDatastore);
    const product = await productSetApis.recordApi.load(
        common.joinKey("Products", productId)
    );

    const version = await productSetApis.recordApi.load(
        common.joinKey("Products", productId, "Versions", versionId)
    );

    const instance = await productSetApis.recordApi.getNew(
        common.joinKey(product.key, "Versions", )
    );
    
    
        
}