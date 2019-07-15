import {setupApphierarchy, stubEventHandler,
    basicAppHierarchyCreator_WithFields, basicAppHierarchyCreator_WithFields_AndIndexes,
    hierarchyFactory, withFields} from "./specHelpers";
import {find} from "lodash";
import {addHours} from "date-fns";
import {events} from "../src/common"

describe("recordApi > validate", () => {

    it("should return errors when any fields do not parse", async () => {

        const {recordApi} = await setupApphierarchy(basicAppHierarchyCreator_WithFields);
        const record = recordApi.getNew("/customers", "customer");

        record.surname = "Ledog";
        record.isalive = "hello";
        record.age = "nine";
        record.createddate = "blah";

        const validationResult = await recordApi.validate(record);
        
        expect(validationResult.isValid).toBe(false); 
        expect(validationResult.errors.length).toBe(3);
    });

    it("should return errors when mandatory field is empty", async () => {
        const withValidationRule = (hierarchy, templateApi) => {
            templateApi.addRecordValidationRule(hierarchy.customerRecord)
            (templateApi.commonRecordValidationRules.fieldNotEmpty("surname"));
        };

        const hierarchyCreator = hierarchyFactory(withFields, withValidationRule);
        const {recordApi} = 
            await setupApphierarchy(hierarchyCreator);

        
        const record = recordApi.getNew("/customers", "customer");
    
        record.surname = "";

        const validationResult = await recordApi.validate(record);

        expect(validationResult.isValid).toBe(false);
        expect(validationResult.errors.length).toBe(1);
    });

    it("should return error when string field is beyond maxLength", async () => {
        const withFieldWithMaxLength = (hierarchy, templateApi) => {
            const surname = find(hierarchy.customerRecord.fields, f => f.name === "surname");
            surname.typeOptions.maxLength = 5;
        };

        const hierarchyCreator = hierarchyFactory(withFields, withFieldWithMaxLength);
        const {recordApi, appHierarchy} = 
            await setupApphierarchy(hierarchyCreator);

        
        const record = recordApi.getNew("/customers", "customer");
        record.surname = "more than 5 chars";
        
        const validationResult = await recordApi.validate(record);
        expect(validationResult.isValid).toBe(false);
        expect(validationResult.errors.length).toBe(1);
    });

    it("should return error when number field is > maxValue", async () => {
        const withFieldWithMaxLength = (hierarchy, templateApi) => {
            const age = find(hierarchy.customerRecord.fields, f => f.name === "age");
            age.typeOptions.maxValue = 10;
            age.typeOptions.minValue = 5
        };

        const hierarchyCreator = hierarchyFactory(withFields, withFieldWithMaxLength);
        const {recordApi, appHierarchy} = 
            await setupApphierarchy(hierarchyCreator);

        
        const tooOldRecord = recordApi.getNew("/customers", "customer");
        tooOldRecord.age = 11
        
        const tooOldResult = await recordApi.validate(tooOldRecord);
        expect(tooOldResult.isValid).toBe(false);
        expect(tooOldResult.errors.length).toBe(1);

    });

    it("should return error when number field is < minValue", async () => {
        const withFieldWithMaxLength = (hierarchy, templateApi) => {
            const age = find(hierarchy.customerRecord.fields, f => f.name === "age");
            age.typeOptions.minValue = 5
        };

        const hierarchyCreator = hierarchyFactory(withFields, withFieldWithMaxLength);
        const {recordApi, appHierarchy} = 
            await setupApphierarchy(hierarchyCreator);

        const tooYoungRecord = recordApi.getNew("/customers", "customer");
        tooYoungRecord.age = 3
        
        const tooYoungResult = await recordApi.validate(tooYoungRecord);
        expect(tooYoungResult.isValid).toBe(false);
        expect(tooYoungResult.errors.length).toBe(1);
    });

    it("should return error when number has too many decimal places", async () => {
        const withFieldWithMaxLength = (hierarchy, templateApi) => {
            const age = find(hierarchy.customerRecord.fields, f => f.name === "age");
            age.typeOptions.decimalPlaces = 2;
        };

        const hierarchyCreator = hierarchyFactory(withFields, withFieldWithMaxLength);
        const {recordApi, appHierarchy} = 
            await setupApphierarchy(hierarchyCreator);

        const record = recordApi.getNew("/customers", "customer");
        record.age = 3.123
        
        const validationResult = await recordApi.validate(record);
        expect(validationResult.isValid).toBe(false);
        expect(validationResult.errors.length).toBe(1);
    });

    it("should return error when datetime field is > maxValue", async () => {
        const withFieldWithMaxLength = (hierarchy, templateApi) => {
            const createddate = find(hierarchy.customerRecord.fields, f => f.name === "createddate");
            createddate.typeOptions.maxValue = new Date();
        };

        const hierarchyCreator = hierarchyFactory(withFields, withFieldWithMaxLength);
        const {recordApi, appHierarchy} = 
            await setupApphierarchy(hierarchyCreator);

        
        const record = recordApi.getNew("/customers", "customer");
        record.createddate = addHours(new Date(), 1);
        
        const result = await recordApi.validate(record);
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBe(1);

    });

    it("should return error when number field is < minValue", async () => {
        const withFieldWithMaxLength = (hierarchy, templateApi) => {
            const createddate = find(hierarchy.customerRecord.fields, f => f.name === "createddate");
            createddate.typeOptions.minValue = addHours(new Date(), 1);
        };

        const hierarchyCreator = hierarchyFactory(withFields, withFieldWithMaxLength);
        const {recordApi, appHierarchy} = 
            await setupApphierarchy(hierarchyCreator);

        
        const record = recordApi.getNew("/customers", "customer");
        record.createddate = new Date();
        
        const result = await recordApi.validate(record);
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBe(1);
    });

    it("should return error when string IS NOT one of declared values, and only declared values are allowed", async () => {
        const withFieldWithMaxLength = (hierarchy, templateApi) => {
            const surname = find(hierarchy.customerRecord.fields, f => f.name === "surname");
            surname.typeOptions.allowDeclaredValuesOnly = true
            surname.typeOptions.values = ["thedog"];
        };

        const hierarchyCreator = hierarchyFactory(withFields, withFieldWithMaxLength);
        const {recordApi, appHierarchy} = 
            await setupApphierarchy(hierarchyCreator);

        
        const record = recordApi.getNew("/customers", "customer");
        record.surname = "zeecat";
        
        const result = await recordApi.validate(record);
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBe(1);
    });

    it("should not return error when string IS one of declared values, and only declared values are allowed", async () => {
        const withFieldWithMaxLength = (hierarchy, templateApi) => {
            const surname = find(hierarchy.customerRecord.fields, f => f.name === "surname");
            surname.typeOptions.allowDeclaredValuesOnly = true
            surname.typeOptions.values = ["thedog"];
        };

        const hierarchyCreator = hierarchyFactory(withFields, withFieldWithMaxLength);
        const {recordApi, appHierarchy} = 
            await setupApphierarchy(hierarchyCreator);

        
        const record = recordApi.getNew("/customers", "customer");
        record.surname = "thedog";
        
        const result = await recordApi.validate(record);
        expect(result.isValid).toBe(true);
        expect(result.errors.length).toBe(0);
    });

    it("should not return error when string IS NOT one of declared values, but any values are allowed", async () => {
        const withFieldWithMaxLength = (hierarchy, templateApi) => {
            const surname = find(hierarchy.customerRecord.fields, f => f.name === "surname");
            surname.typeOptions.allowDeclaredValuesOnly = false
            surname.typeOptions.values = ["thedog"];
        };

        const hierarchyCreator = hierarchyFactory(withFields, withFieldWithMaxLength);
        const {recordApi, appHierarchy} = 
            await setupApphierarchy(hierarchyCreator);

        
        const record = recordApi.getNew("/customers", "customer");
        record.surname = "zeecat";
        
        const result = await recordApi.validate(record);
        expect(result.isValid).toBe(true);
        expect(result.errors.length).toBe(0);
    });

    it("should return error when reference field does not exist in options index", async () => {
        const {recordApi, appHierarchy} = 
            await setupApphierarchy(basicAppHierarchyCreator_WithFields_AndIndexes);

        const partner = recordApi.getNew("/partners", "partner");
        partner.businessName = "ACME Inc";
        await recordApi.save(partner);

        const customer = recordApi.getNew("/customers", "customer");
        customer.partner = {key: "incorrect key", name: partner.businessName};
        const result = await await recordApi.validate(customer);
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBe(1);

    });

    it("should publish invalid events", async () => {
        const withValidationRule = (hierarchy, templateApi) => {
            templateApi.addRecordValidationRule(hierarchy.customerRecord)
            (templateApi.commonRecordValidationRules.fieldNotEmpty("surname"));
        };

        const hierarchyCreator = hierarchyFactory(withFields, withValidationRule);

        const {recordApi, subscribe} = await setupApphierarchy(hierarchyCreator);
        const handler = stubEventHandler();
        subscribe(events.recordApi.save.onInvalid, 
                  handler.handle);

        const record = recordApi.getNew("/customers", "customer");
        record.surname = "";

        try{
            await recordApi.save(record);
        } catch(e)
        {}

        const onInvalid = handler.getEvents(
            events.recordApi.save.onInvalid
        );
        expect(onInvalid.length).toBe(1);
        expect(onInvalid[0].context.record).toBeDefined();
        expect(onInvalid[0].context.record.key).toBe(record.key);
        expect(onInvalid[0].context.validationResult).toBeDefined();
    });

});