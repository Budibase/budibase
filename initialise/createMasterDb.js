const {initialiseData, 
    getTemplateApi} = require("budibase-core");
const {newField, getDatabaseManager,
    getApisWithFullAccess} = require("./helpers"); 

module.exports = async (datastoreModule, username, password) => {
    
    const databaseManager = getDatabaseManager(datastoreModule);
    
    const masterDbConfig = await databaseManager.createEmptyMasterDb();
    const datastore = datastoreModule.getDatastore(masterDbConfig);

    const templateApi = getTemplateApi();
    const root = templateApi.getNewRootLevel();
    const productSets = templateApi.getNewCollectionTemplate(root);
    productSets.name = "ProductSets";

    const productSet = templateApi.getNewRecordTemplate(productSets);
    productSet.name = "ProductSet";

    const newProductSetField = newField(templateApi, productSet);
    newProductSetField("name", "string", true);
    newProductSetField("dbRootConfig", "string");
    
    const products = templateApi.getNewCollectionTemplate(productSet);
    products.name = "Products";

    const product = templateApi.getNewRecordTemplate(products);
    product.name = "product";

    const newProductField = newField(templateApi, product);
    newProductField("name", "string", true);
    newProductField("domain", "string", true);
    newProductField("datastoreConfig", "string", true);

    
    await initialiseData(datastore, {
        heirarchy:root, actions:[], triggers:[]
    });

    const bb = await getApisWithFullAccess(datastore);
    
    const fullAccess = bb.authApi.getNewAccessLevel();
    fullAccess.permissions = bb.authApi.generateFullPermissions();
    fullAccess.name = "Full Access";
    await bb.authApi.saveAccessLevels([fullAccess]);
    const seedUser = bb.authApi.getNewUser();
    seedUser.name = username;
    seedUser.accessLevels = ["Full Access"];
    await bb.authApi.createUser(seedUser, password);

    return masterDbConfig; 
};

