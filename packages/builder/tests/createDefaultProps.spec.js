import { 
    createProps,
} from "../src/userInterface/pagesParsing/createProps";
import {
    keys, some
} from "lodash/fp";
import {
    BB_STATE_BINDINGPATH
} from "@budibase/client/src/state/isState";

describe("createDefaultProps", () => {

    const getcomponent = () => ({
        name:"some_component",
        props:  {
            fieldName: {type:"string", default:"something"}
        }
    });

    it("should create a object with single string value, when default string field set", () => {
   
        const { props, errors } = createProps(getcomponent());

        expect(errors).toEqual([]);
        expect(props.fieldName).toBeDefined();
        expect(props.fieldName).toBe("something");
        expect(keys(props).length).toBe(3);
    });

    it("should set component name", () => {

        const { props, errors } = createProps(getcomponent());

        expect(errors).toEqual([]);
        expect(props._component).toBe("some_component");
    });

    it("should return error when component name not supplied", () => {
        const comp = getcomponent();
        comp.name = "";

        const { errors } = createProps(comp);

        expect(errors.length).toEqual(1);
    });

    it("should create a object with single blank string value, when no default", () => {
        const comp = getcomponent();
        comp.props.fieldName = {type:"string"};

        const { props, errors } = createProps(comp);

        expect(errors).toEqual([]);
        expect(props.fieldName).toBeDefined();
        expect(props.fieldName).toBe("");
    });

    it("should create a object with single blank string value, when prop definition is 'string' ", () => {
        const comp = getcomponent();
        comp.props.fieldName = "string";

        const { props, errors } = createProps(comp);

        expect(errors).toEqual([]);
        expect(props.fieldName).toBeDefined();
        expect(props.fieldName).toBe("");
    });

    it("should create a object with single fals value, when prop definition is 'bool' ", () => {
        const comp = getcomponent();
        comp.props.isVisible = "bool";

        const { props, errors } = createProps(comp);

        expect(errors).toEqual([]);
        expect(props.isVisible).toBeDefined();
        expect(props.isVisible).toBe(false);
    });

    it("should create a object with single 0 value, when prop definition is 'number' ", () => {
 
        const comp = getcomponent();
        comp.props.width = "number";

        const { props, errors } = createProps(comp);

        expect(errors).toEqual([]);
        expect(props.width).toBeDefined();
        expect(props.width).toBe(0);
    });

    it("should create a object with empty _children array, when children===true ", () => {
        const comp = getcomponent();
        comp.children = true;

        const { props, errors } = createProps(comp);

        expect(errors).toEqual([]);
        expect(props._children).toBeDefined();
        expect(props._children).toEqual([]);
    });

    it("should create a object without _children array, when children===false ", () => {
        const comp = getcomponent();
        comp.children = false;

        const { props, errors } = createProps(comp);

        expect(errors).toEqual([]);
        expect(props._children).not.toBeDefined();
    });

    it("should create a object with single empty array, when prop definition is 'event' ", () => {

        const comp = getcomponent();
        comp.props.onClick = "event";

        const { props, errors } = createProps(comp);

        expect(errors).toEqual([]);
        expect(props.onClick).toBeDefined();
        expect(props.onClick).toEqual([]);
    });

    it("should create a object with empty state when prop def is 'state' ", () => {

        const comp = getcomponent();
        comp.props.data = "state";

        const { props, errors } = createProps(comp);

        expect(errors).toEqual([]);
        expect(props.data[BB_STATE_BINDINGPATH]).toBeDefined();
        expect(props.data[BB_STATE_BINDINGPATH]).toBe("");
    });

    it("should create a object children array when children == true ", () => {

        const comp = getcomponent();
        comp.children = true;

        const { props, errors } = createProps(comp);

        expect(errors).toEqual([]);
        expect(props._children).toBeDefined();
        expect(props._children).toEqual([]);
    });

    it("should create a _children array when children not defined ", () => {

        const comp = getcomponent();

        const { props, errors } = createProps(comp);

        expect(errors).toEqual([]);
        expect(props._children).toBeDefined();
        expect(props._children).toEqual([]);
    });

    it("should not create _children array when children=false ", () => {

        const comp = getcomponent();
        comp.children = false;

        const { props, errors } = createProps(comp);

        expect(errors).toEqual([]);
        expect(props._children).not.toBeDefined();
    });

    it("should create an object with multiple prop names", () => {
  
        const comp = getcomponent();
        comp.props.fieldName = "string";
        comp.props.fieldLength = { type: "number", default: 500 };

        const { props, errors } = createProps(comp);

        expect(errors).toEqual([]);
        expect(props.fieldName).toBeDefined();
        expect(props.fieldName).toBe("");
        expect(props.fieldLength).toBeDefined();
        expect(props.fieldLength).toBe(500);
    })

    it("should return error when invalid type", () => {
        const comp = getcomponent();
        comp.props.fieldName = "invalid type name";
        comp.props.fieldLength = { type: "invalid type name "};

        const { errors } = createProps(comp);

        expect(errors.length).toBe(2);
        expect(some(e => e.propName === "fieldName")(errors)).toBeTruthy();
        expect(some(e => e.propName === "fieldLength")(errors)).toBeTruthy();
    });

    it("should return error default value is not of declared type", () => {

        const comp = getcomponent();
        comp.props.fieldName = {type:"string", default: 1}


        const { errors } = createProps(comp);

        expect(errors.length).toBe(1);
        expect(some(e => e.propName === "fieldName")(errors)).toBeTruthy();
    });

    it("should merge in derived props", () => {
        const propDef = {
            fieldName: "string",
            fieldLength: { type: "number", default: 500}
        };

        const comp = getcomponent();
        comp.props.fieldName = "string";
        comp.props.fieldLength = { type: "number", default: 500};

        const derivedFrom = {
            fieldName: "surname"
        };

        const { props, errors } = createProps(comp, derivedFrom);

        expect(errors.length).toBe(0);
        expect(props.fieldName).toBe("surname");
        expect(props.fieldLength).toBe(500);

    });

})
