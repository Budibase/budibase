import { createProps } from "../src/userInterface/propsDefinitionParsing/createProps";
import {
    keys, some
} from "lodash/fp";

describe("createDefaultProps", () => {

    it("should create a object with single string value, when default string field set", () => {
        const propDef = {
            fieldName: {type:"string", default:"something"}
        };

        const { props, errors } = createProps("some_component",propDef);

        expect(errors).toEqual([]);
        expect(props.fieldName).toBeDefined();
        expect(props.fieldName).toBe("something");
        expect(keys(props).length).toBe(2);
    });

    it("should set component name", () => {
        const propDef = {
            fieldName: {type:"string", default:"something"}
        };

        const { props, errors } = createProps("some_component",propDef);

        expect(errors).toEqual([]);
        expect(props._component).toBe("some_component");
    });

    it("should return error when component name not supplied", () => {
        const propDef = {
            fieldName: {type:"string", default:"something"}
        };

        const { errors } = createProps("",propDef);

        expect(errors.length).toEqual(1);
    });

    it("should create a object with single blank string value, when no default", () => {
        const propDef = {
            fieldName: {type:"string"}
        };

        const { props, errors } = createProps("some_component",propDef);

        expect(errors).toEqual([]);
        expect(props.fieldName).toBeDefined();
        expect(props.fieldName).toBe("");
    });

    it("should create a object with single blank string value, when prop definition is 'string' ", () => {
        const propDef = {
            fieldName: "string"
        };

        const { props, errors } = createProps("some_component",propDef);

        expect(errors).toEqual([]);
        expect(props.fieldName).toBeDefined();
        expect(props.fieldName).toBe("");
    });

    it("should create a object with single fals value, when prop definition is 'bool' ", () => {
        const propDef = {
            isVisible: "bool"
        };

        const { props, errors } = createProps("some_component",propDef);

        expect(errors).toEqual([]);
        expect(props.isVisible).toBeDefined();
        expect(props.isVisible).toBe(false);
    });

    it("should create a object with single 0 value, when prop definition is 'number' ", () => {
        const propDef = {
            width: "number"
        };

        const { props, errors } = createProps("some_component",propDef);

        expect(errors).toEqual([]);
        expect(props.width).toBeDefined();
        expect(props.width).toBe(0);
    });

    it("should create a object with single empty array, when prop definition is 'array' ", () => {
        const propDef = {
            columns: "array"
        };

        const { props, errors } = createProps("some_component",propDef);

        expect(errors).toEqual([]);
        expect(props.columns).toBeDefined();
        expect(props.columns).toEqual([]);
    });

    it("should create a object with single empty component props, when prop definition is 'component' ", () => {
        const propDef = {
            content: "component"
        };

        const { props, errors } = createProps("some_component",propDef);

        expect(errors).toEqual([]);
        expect(props.content).toBeDefined();
        expect(props.content).toEqual({_component:""});
    });

    it("should create an object with multiple prop names", () => {
        const propDef = {
            fieldName: "string",
            fieldLength: { type: "number", default: 500 }
        };

        const { props, errors } = createProps("some_component",propDef);

        expect(errors).toEqual([]);
        expect(props.fieldName).toBeDefined();
        expect(props.fieldName).toBe("");
        expect(props.fieldLength).toBeDefined();
        expect(props.fieldLength).toBe(500);
        expect(keys(props).length).toBe(3);
    })

    it("should return error when invalid type", () => {
        const propDef = {
            fieldName: "invalid type name",
            fieldLength: { type: "invalid type name "}
        };

        const { errors } = createProps("some_component",propDef);

        expect(errors.length).toBe(2);
        expect(some(e => e.propName === "fieldName")(errors)).toBeTruthy();
        expect(some(e => e.propName === "fieldLength")(errors)).toBeTruthy();
    });

    it("should return error default value is not of declared type", () => {
        const propDef = {
            fieldName: {type:"string", default: 1}
        };

        const { errors } = createProps("some_component",propDef);

        expect(errors.length).toBe(1);
        expect(some(e => e.propName === "fieldName")(errors)).toBeTruthy();
    });

    it("should merge in derived props", () => {
        const propDef = {
            fieldName: "string",
            fieldLength: { type: "number", default: 500}
        };

        const derivedFrom = {
            _component:"root",
            fieldName: "surname"
        };

        const { props, errors } = createProps("some_component",propDef, [derivedFrom]);

        expect(errors.length).toBe(0);
        expect(props.fieldName).toBe("surname");
        expect(props.fieldLength).toBe(500);

    });

    it("should merge in derived props, last in list taking priority", () => {
        const propDef = {
            fieldName: "string",
            fieldLength: { type: "number", default: 500},
            header: "component",
            content: { 
                type: "component", 
                default: { _component: "childcomponent", wdith: 500 }
            }
        };

        const derivedFrom1 = {
            _component:"root",
            fieldName: "surname",
            fieldLength: 200
        };

        const derivedFrom2 = {
            _component:"child",
            fieldName: "forename"
        };

        const { props, errors } = createProps("some_component",propDef, [derivedFrom1, derivedFrom2]);

        expect(errors.length).toBe(0);
        expect(props.fieldName).toBe("forename");
        expect(props.fieldLength).toBe(200);
        expect(props._component).toBe("child");

    });

})