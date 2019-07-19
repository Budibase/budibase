import { createDefaultProps } from "../src/userInterface/propsDefinitionParsing/createDefaultProps";
import {
    keys, some
} from "lodash/fp";

describe("createDefaultProps", () => {

    it("should create a object with single string value, when default string field set", () => {
        const propDef = {
            fieldName: {type:"string", default:"something"}
        };

        const { props, errors } = createDefaultProps(propDef);

        expect(errors).toEqual([]);
        expect(props.fieldName).toBeDefined();
        expect(props.fieldName).toBe("something");
        expect(keys(props).length).toBe(1);
    });

    it("should create a object with single blank string value, when no default", () => {
        const propDef = {
            fieldName: {type:"string"}
        };

        const { props, errors } = createDefaultProps(propDef);

        expect(errors).toEqual([]);
        expect(props.fieldName).toBeDefined();
        expect(props.fieldName).toBe("");
    });

    it("should create a object with single blank string value, when prop definition is 'string' ", () => {
        const propDef = {
            fieldName: "string"
        };

        const { props, errors } = createDefaultProps(propDef);

        expect(errors).toEqual([]);
        expect(props.fieldName).toBeDefined();
        expect(props.fieldName).toBe("");
    });

    it("should create a object with single fals value, when prop definition is 'bool' ", () => {
        const propDef = {
            fieldName: "bool"
        };

        const { props, errors } = createDefaultProps(propDef);

        expect(errors).toEqual([]);
        expect(props.fieldName).toBeDefined();
        expect(props.fieldName).toBe(false);
    });

    it("should create a object with single 0 value, when prop definition is 'number' ", () => {
        const propDef = {
            fieldName: "number"
        };

        const { props, errors } = createDefaultProps(propDef);

        expect(errors).toEqual([]);
        expect(props.fieldName).toBeDefined();
        expect(props.fieldName).toBe(0);
    });

    it("should create a object with single 0 value, when prop definition is 'array' ", () => {
        const propDef = {
            fieldName: "array"
        };

        const { props, errors } = createDefaultProps(propDef);

        expect(errors).toEqual([]);
        expect(props.fieldName).toBeDefined();
        expect(props.fieldName).toEqual([]);
    });

    it("should create an object with multiple prop names", () => {
        const propDef = {
            fieldName: "string",
            fieldLength: { type: "number", default: 500 }
        };

        const { props, errors } = createDefaultProps(propDef);

        expect(errors).toEqual([]);
        expect(props.fieldName).toBeDefined();
        expect(props.fieldName).toBe("");
        expect(props.fieldLength).toBeDefined();
        expect(props.fieldLength).toBe(500);
        expect(keys(props).length).toBe(2);
    })

    it("should return error when invalid type", () => {
        const propDef = {
            fieldName: "invalid type name",
            fieldLength: { type: "invalid type name "}
        };

        const { errors } = createDefaultProps(propDef);

        expect(errors.length).toBe(2);
        expect(some(e => e.propName === "fieldName")(errors)).toBeTruthy();
        expect(some(e => e.propName === "fieldLength")(errors)).toBeTruthy();
    });

    it("should return error default value is not of declared type", () => {
        const propDef = {
            fieldName: {type:"string", default: 1}
        };

        const { errors } = createDefaultProps(propDef);

        expect(errors.length).toBe(1);
        expect(some(e => e.propName === "fieldName")(errors)).toBeTruthy();
    });

    it("should merge in derived props", () => {
        const propDef = {
            fieldName: "string",
            fieldLength: { type: "number", default: 500}
        };

        const derivedFrom = {
            fieldName: "surname"
        };

        const { props, errors } = createDefaultProps(propDef, [derivedFrom]);

        expect(errors.length).toBe(0);
        expect(props.fieldName).toBe("surname");
        expect(props.fieldLength).toBe(500);

    });

    it("should merge in derived props, last in list taking priority", () => {
        const propDef = {
            fieldName: "string",
            fieldLength: { type: "number", default: 500}
        };

        const derivedFrom1 = {
            fieldName: "surname",
            fieldLength: 200
        };

        const derivedFrom2 = {
            fieldName: "forename"
        };

        const { props, errors } = createDefaultProps(propDef, [derivedFrom1, derivedFrom2]);

        expect(errors.length).toBe(0);
        expect(props.fieldName).toBe("forename");
        expect(props.fieldLength).toBe(200);

    });

})