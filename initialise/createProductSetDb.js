const {initialiseData, getTemplateApi, 
    getAppApis} = require("budibase-core");
const {newField, getDatabaseManager} = require("./helpers"); 

module.exports = async (datastoreModule, productSetName, 
                        username, password) => {

    const databaseManager = getDatabaseManager(datastoreModule);
    const masterDatastore = datastoreModule.getDatastore(
        databaseManager.masterDatastoreConfig
    );

    const masterApi = await getAppApis(masterDatastore);
    const ps = masterApi.recordApi.getNew("/ProductSets", "ProductSet");

    const psDatastoreConfig = await databaseManager.createEmptyProductSetDb(ps.id);
    ps.datastoreConfig = psDatastoreConfig;
    ps.name = productSetName;
    await bb.recordApi.save(ps);
    
    const datastore = datastoreFactory(psDatastoreConfig);
    const templateApi = getTemplateApi();

    const root = templateApi.getNewRootLevel();
    const products = templateApi.getNewCollectionTemplate(root, "Products");
    
    const product = templateApi.getNewRecordTemplate(products);
    product.name = "Product";

    const newProductField = newField(templateApi, product);
    newProductField("name", "string", true);
    newProductField("domain", "string", true);
    newProductField("certificate", "string", true);

    var productVersionsRefIndex = templateApi.getNewIndexTemplate(products);

    const versions = templateApi.getNewCollectionTemplate(product, "versions", false);
    const version = templateApi.getNewRecordTemplate(versions);
    const newVersionField = newField(templateApi, version);
    newVersionField("date", "datetime", true);
    newVersionField("description", "string", false);
    newVersionField("appDefinition", "file", false);
    newVersionField("publicFiles", "array<file>", false);
    const deployable = newVersionField("deployable", "bool", false)
    deployable.getInitialValue = "false";
    deployable.typeOptions.allowNulls = false;

    const versionLookup = templateApi.getNewIndexTemplate(product);
    versionLookup.name = "versionLookup";
    versionLookup.map = "return ({description:record.description, deployable:record.deployable});";
    versionLookup.allowedRecordNodeIds = [version.recordNodeId];

    

    const productInstances = templateApi.getNewCollectionTemplate(product);
    productInstances.name = "ProductInstances";
    const productInstance = templateApi.getNewRecordTemplate(productInstances);
    productInstance.name = "ProductInstance";
    const newProductInstanceField = newField(templateApi, productInstance);
    newProductInstanceField("description", "string", true);
    const versionReference = newProductInstanceField("version", "reference");
    versionReference.typeOptions.indexNodeKey = versions.indexes[0].nodeKey();

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

};