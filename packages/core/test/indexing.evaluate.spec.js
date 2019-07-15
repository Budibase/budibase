import evaluate from "../src/indexing/evaluate";
import {constant, merge} from "lodash";

const getRecord = obj => {
    const def = {
        key : "abcd1234",
        type : "test",
        isNew : false,
        id : "1234"
    }
    
    const newObj = merge(def, obj);
    return newObj;
};

describe("index evaluation", () => {

    it("should filter out when object does not pass filter", () => {
        
        const index = {
            filter : "record.type === 'customer'",
            fields: {
                type : {type:"string"}
            }
        };

        const record = getRecord({
            type : "not a customer"
        });

        const result = evaluate(record)(index);
        expect(result.isError).toBe(false);
        expect(result.passedFilter).toBe(false);

    });

    it("should always include key with the record", () => {
        
        const index = {
            filter : "record.type === 'customer'",
            fields: {
                type : {type:"string"}
            }
        };

        const record = getRecord({
            type : "customer"
        });

        const key = record.key;

        const result = evaluate(record)(index);
        expect(result.isError).toBe(false);
        expect(result.passedFilter).toBe(true);
        expect(result.result.key).toBe(key);

    });

    it("should map when filter test is passed", () => {
        const index = {
            filter : "record.type === 'customer'",
            map: "return {newName: record.name + 'by', email: record.email }",
            fields: {
                newName : {type:"string"},
                email: {type:"string"}
            }
        };
        const record = getRecord({
            type : "customer",
            name: "bob",
            email: "bob@budibase.com"
        });

        const result = evaluate(record)(index);
        expect(result.isError).toBe(false);
        expect(result.passedFilter).toBe(true);
        expect(result.result.newName).toBeDefined();
        expect(result.result.newName).toBe("bobby");
        expect(result.result.email).toBe("bob@budibase.com");

    });

    it("should not need a filter", () => {
        const index = {
            map : "return {newName : record.name + ' Thedog'}",
            fields: {
                newName : {type:"string"}
            }
        };
        const record = getRecord({
            name : "bob"
        });

        const result = evaluate(record)(index);
        expect(result.isError).toBe(false);
        expect(result.passedFilter).toBe(true);
        expect(result.result.newName).toBeDefined();
        expect(result.result.newName).toBe("bob Thedog");
    });

    it("should return all declared fields when no map supplied", () => {
        const index = {
            filter : "record.type === 'customer'",
            fields : {
                type: {type:"string"},
                name: {type:"string"}
            }
        };
        const record = getRecord({
            type : "customer",
            name: "bob"
        });
        const result = evaluate(record)(index);
        expect(result.isError).toBe(false);
        expect(result.passedFilter).toBe(true);
        expect(result.result.name).toBeDefined();
        expect(result.result.name).toBe("bob");
    });

    it("should set undefined mapped members to null", () => {
        const index = {
            map : "return {firstname : record.firstname, surname : record.surname}",
            fields: {
                newName : {type:"string"}
            }
        };
        const record = getRecord({});

        const result = evaluate(record)(index);
        expect(result.isError).toBe(false);
        expect(result.passedFilter).toBe(true);
        expect(result.result.firstname).toBeDefined();
        expect(result.result.surname).toBeDefined();
        expect(result.result.firstname).toBeNull();
        expect(result.result.surname).toBeNull();
    });

});