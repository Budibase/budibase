import {setupApphierarchy, basicAppHierarchyCreator_WithFields, 
    getNewFieldAndAdd} from "./specHelpers";
import {isNonEmptyString} from "../src/common";
import { isBoolean } from "util";
import {permission} from "../src/authApi/permissions";
import { _getNew } from "../src/recordApi/getNew";

describe("recordApi > getNew", () => {

    it("should get object with generated id and key (full path)", async () => {
        const {recordApi} = await setupApphierarchy(basicAppHierarchyCreator_WithFields);
        const record = recordApi.getNew("/customers", "customer");

        expect(record.id).toBeDefined();
        expect(isNonEmptyString(record.id)).toBeTruthy();

        expect(record.key).toBeDefined();
        expect(isNonEmptyString(record.key)).toBeTruthy();
        expect(record.key).toBe(`/customers/${record.id}`);
    });

    it("should create object with all declared fields, using default values", async () => {
        const {recordApi} = await setupApphierarchy(basicAppHierarchyCreator_WithFields);

        const newRecord = recordApi.getNew("/customers", "customer")

        expect(newRecord.surname).toBe(null);
        expect(newRecord.isalive).toBe(true);
        expect(newRecord.createddate).toBe(null);
        expect(newRecord.age).toBe(null);        
    });

    it("should create object with all declared fields, and use inital values", async () => {
        const {recordApi} = await setupApphierarchy(templateApi => {
            const hierarchy = basicAppHierarchyCreator_WithFields(templateApi);
            const {customerRecord} = hierarchy;

            customerRecord.fields = [];

            const newField = getNewFieldAndAdd(templateApi, customerRecord);
            newField("surname", "string", "hello");
            newField("isalive", "bool", "true");
            newField("age", "number", "999");
        
            return hierarchy;
        });

        const newRecord = recordApi.getNew("/customers", "customer")

        expect(newRecord.surname).toBe("hello");
        expect(newRecord.isalive).toBe(true);
        expect(newRecord.age).toBe(999);        
    });

    it("should add a function 'isNew' which always returns true", async () => {
        const {recordApi} = await setupApphierarchy(basicAppHierarchyCreator_WithFields);
        const record = recordApi.getNew("/customers", "customer");

        expect(record.isNew).toBeDefined();
        expect(isBoolean(record.isNew)).toBeTruthy();
        expect(record.isNew).toBeTruthy();
    });

    it("should add a function 'type' returns type", async () => {
        const {recordApi} = await setupApphierarchy(basicAppHierarchyCreator_WithFields);
        const record = recordApi.getNew("/customers", "customer");

        expect(record.type).toBeDefined();
        expect(isNonEmptyString(record.type)).toBeTruthy();
        expect(record.type).toBe("customer");
    });

    it("should throw error, user user does not have permission", async () => {
        const {recordApi, app, appHierarchy} = await setupApphierarchy(basicAppHierarchyCreator_WithFields);
        app.removePermission(permission.createRecord.get(appHierarchy.customerRecord.nodeKey()));
        expect(() => recordApi.getNew("/customers", "customer")).toThrow(/Unauthorized/);
    });

    it("should not depend on having any other permissions", async () => {
        const {recordApi, app, appHierarchy} = await setupApphierarchy(basicAppHierarchyCreator_WithFields);
        app.withOnlyThisPermission(permission.createRecord.get(appHierarchy.customerRecord.nodeKey()));
        recordApi.getNew("/customers", "customer");
    });

    it("for 'single record' type, should create with key ending in node name", async () => {
        const {appHierarchy} = await setupApphierarchy(basicAppHierarchyCreator_WithFields);
        const {settingsRecord} = appHierarchy;
        const result = _getNew(settingsRecord, "");
        expect(result.key).toBe("/settings")
    })
});


