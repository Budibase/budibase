import {getMemoryTemplateApi, basicAppHierarchyCreator_WithFields_AndIndexes} from "./specHelpers";
import {initialiseData} from "../src/appInitialise/initialiseData";
import {TRANSACTIONS_FOLDER} from "../src/transactions/transactionsCommon";
import {AUTH_FOLDER, USERS_LIST_FILE, ACCESS_LEVELS_FILE} from "../src/authApi/authCommon";

describe("initialiseData", () => {

    it("should create csv file for each index, when does not exist", async () => {
        const {appDef, datastore} = getApplicationDefinition();
        await initialiseData(datastore, appDef);
    
        expect(await datastore.exists(`/customer_index/index.csv`)).toBeTruthy();
        expect(await datastore.exists(`/customer_index`)).toBeTruthy();
        expect(await datastore.exists(`/deceased/index.csv`)).toBeTruthy();
        expect(await datastore.exists(`/deceased`)).toBeTruthy();
    });

    it("should create folder for collection", async () => {
        const {appDef, datastore} = getApplicationDefinition();
        await initialiseData(datastore, appDef);
        expect(await datastore.exists(`/customers`)).toBeTruthy();
    });


    it("should create allids folders", async () => {
        const {appDef, datastore, h} = getApplicationDefinition();
        await initialiseData(datastore, appDef);

        const allIdsTypeFolder = "/customers/allids/" + h.customerRecord.nodeId;
        const allIdsFolder = "/customers/allids";
        expect(await datastore.exists(allIdsTypeFolder)).toBeTruthy();
        expect(await datastore.exists(allIdsFolder)).toBeTruthy();
    });

    it("should create transactions folder", async () => {
        const {appDef, datastore} = getApplicationDefinition();
        await initialiseData(datastore, appDef);
        expect(await datastore.exists(TRANSACTIONS_FOLDER)).toBeTruthy();
    });

    it("should create auth folder", async () => {
        const {appDef, datastore} = getApplicationDefinition();
        await initialiseData(datastore, appDef);
        expect(await datastore.exists(AUTH_FOLDER)).toBeTruthy();
    });

    it("should create users list", async () => {
        const {appDef, datastore} = getApplicationDefinition();
        await initialiseData(datastore, appDef);
        expect(await datastore.exists(USERS_LIST_FILE)).toBeTruthy();
    });

    it("should create access levels file", async () => {
        const {appDef, datastore} = getApplicationDefinition();
        await initialiseData(datastore, appDef);
        expect(await datastore.exists(ACCESS_LEVELS_FILE)).toBeTruthy();
    });

    it("should create access levels file, with supplied object", async () => {
        const {appDef, datastore} = getApplicationDefinition();
        await initialiseData(datastore, appDef, { version: 0, levels: [{
            name:"owner", permissions:[{type:"create user"}]
        }] });
        const levels = await datastore.loadJson(ACCESS_LEVELS_FILE);
        expect(levels.levels[0].name).toBe("owner");
    });

    it("should initialise 'single record' type nodes", async () => {
        const {appDef, datastore} = getApplicationDefinition();
        await initialiseData(datastore, appDef);        
        expect(await datastore.exists(`/settings`)).toBeTruthy();
        const settings = await datastore.loadJson("/settings/record.json");
        expect(settings.type).toBe("settings");
    });

    const getApplicationDefinition = () => {
        const {templateApi, app} = getMemoryTemplateApi();
        const h = basicAppHierarchyCreator_WithFields_AndIndexes(templateApi);
        return {appDef:{hierarchy:h.root, actions:[], triggers:[]}, datastore:app.datastore, h};
    }

});