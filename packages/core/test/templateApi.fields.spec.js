import {isDefined, join, fieldDefinitions, $} from "../src/common";
import {getMemoryTemplateApi} from "./specHelpers";
import {fieldErrors} from "../src/templateApi/fields";

const getRecordTemplate = templateApi => 
    $(templateApi.getNewRootLevel(), [
        templateApi.getNewRecordTemplate
    ]);

const getValidField = templateApi => {
    const field = templateApi.getNewField("string");
    field.name = "forename";
    field.label = "forename";
    return field;
};

const testMemberIsNotSet = membername => async () => {
    const {templateApi} = await getMemoryTemplateApi();
    const field = getValidField(templateApi);
    field[membername] = "";
    const errorsNotSet = templateApi.validateField([field])(field);
    expect(errorsNotSet.length).toBe(1);
    expect(errorsNotSet[0].error.includes("is not set")).toBeTruthy();
};

const testMemberIsNotDefined = membername => async () => {
    const {templateApi} = await getMemoryTemplateApi();
    const field = getValidField(templateApi);
    delete field[membername];
    const errorsNotSet = templateApi.validateField([field])(field);
    expect(errorsNotSet.length).toBe(1);
    expect(errorsNotSet[0].error.includes("is not set")).toBeTruthy();
};

describe("validateField", () => {

    it("should return error when name is not set",
        testMemberIsNotSet("name"));

    it("should return error when name is not defined",
        testMemberIsNotDefined("name"));

    it("should return error when type is not set",
        testMemberIsNotSet("type"));

    it("should return error when type is not defined",
        testMemberIsNotDefined("type"));
    
    it("should return error when label is not defined",
        testMemberIsNotDefined("label"));
    
    it("should return error when getInitialValue is not defined",
        testMemberIsNotDefined("getInitialValue"));
    
    it("should return error when getInitialValue is not set",
        testMemberIsNotSet("getInitialValue"));

    it("should return error when getUndefinedValue is not defined",
        testMemberIsNotDefined("getUndefinedValue"));

    it("should return error when getUndefinedValue is not set",
        testMemberIsNotSet("getUndefinedValue"));
    
    it("should return no errors when valid field is supplied", async () => {
        const {templateApi} = await getMemoryTemplateApi();
        const field = getValidField(templateApi);
        const errors = templateApi.validateField([field])(field);
        expect(errors.length).toBe(0);
    });

    it("should return error when field with same name exists already", async () => {
        const {templateApi} = await getMemoryTemplateApi();
        const field1 = getValidField(templateApi);
        field1.name = "surname";

        const field2 = getValidField(templateApi);
        field2.name = "surname";
        const errors = templateApi.validateField([field1, field2])(field2);
        expect(errors.length).toBe(1);
        expect(errors[0].error).toBe("field name is duplicated");
        expect(errors[0].field).toBe("name");
    });

    it("should return error when field is not one of allowed types", async () => {
        const {templateApi} = await getMemoryTemplateApi();
        const field = getValidField(templateApi);
        field.type = "sometype";
        const errors = templateApi.validateField([field])(field);
        expect(errors.length).toBe(1);
        expect(errors[0].error).toBe("type is unknown");
        expect(errors[0].field).toBe("type");
    });

});

describe("addField", () => {

    it("should throw exception when field is invalid", async () => {
        const {templateApi} = await getMemoryTemplateApi();
        const record = getRecordTemplate(templateApi);
        const field = getValidField(templateApi);
        field.name = "";
        expect(() => templateApi.addField(record, field))
        .toThrow(new RegExp('^' + fieldErrors.AddFieldValidationFailed, 'i'));
    });

    it("should add field when field is valid", async () => {
        const {templateApi} = await getMemoryTemplateApi();
        const record = getRecordTemplate(templateApi);
        const field = getValidField(templateApi);
        field.name = "some_new_field";
        templateApi.addField(record, field);
        expect(record.fields.length).toBe(1);
        expect(record.fields[0]).toBe(field);
    });

});
