const {initialiseData, getTemplateApi, 
    getAppApis} = require("budibase-core");
const crypto = require("../server/nodeCrypto");

module.exports = async (datastoreFactory, dataRootOpts, 
                        username, password) => {
    const rootDatastore = datastoreFactory(dataRootOpts);
    const masterDatastoreOpts = await rootDatastore.createEmptyMasterDb();
    const datastore = datastoreFactory(masterDatastoreOpts);

    /*const bb = getAppApis(
        datastore, {}, 
        null, null,
        crypto
    );*/

    const templateApi = getTemplateApi();

    const root = templateApi.getNewRootLevel();
    const productSets = templateApi.getNewCollectionTemplate(root);
    productSets.name = "ProductSets";

    const productSet = templateApi.getNewRecordTemplate(productSets);
    productSet.name = "ProductSet";

    const newProductSetField = newField(templateApi, productSet);
    newProductSetField("name", "string", true);
    
    const products = templateApi.getNewCollectionTemplate(productSet);
    products.name = "Products";

    const product = templateApi.getNewRecordTemplate(products);
    product.name = "product";

    const newProductField = newField(templateApi, product);
    newProductField("name", "string", true);
    newProductField("domain", "string", true);

    
    await initialiseData(datastore, {
        heirarchy:root, actions:[], triggers:[]
    });

    const bb = await getAppApis(
        datastore, 
        null, null, null,
        crypto
    );

    bb.asFullAccess();
    
    const fullAccess = bb.authApi.getNewAccessLevel();
    fullAccess.permissions = bb.authApi.generateFullPermissions();
    fullAccess.name = "Full Access";
    await bb.authApi.saveAccessLevels([fullAccess]);
    const seedUser = bb.authApi.getNewUser();
    seedUser.name = username;
    seedUser.accessLevels = ["Full Access"];
    await bb.authApi.createUser(seedUser, password);

    const initialProductSet = bb.recordApi.getNew("/ProductSets", "ProductSet");
    initialProductSet.name = "Dev Products";
    
    return await bb.recordApi.save(initialProductSet); 
};

const newField = (templateApi, recordNode) => (name, type, mandatory=false) => {
    const field = templateApi.getNewField(type);
    field.name = name;
    templateApi.addField(recordNode, field);
    if(mandatory) {
        templateApi.addRecordValidationRule(recordNode)
            (templateApi.commonValidationRules.fieldNotEmpty)
    }
    return field; 
}