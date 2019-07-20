import { 
    validatePropsDefinition,
    validateProps 
} from "../src/userInterface/propsDefinitionParsing/validateProps";
import { createProps }  from "../src/userInterface/propsDefinitionParsing/createProps";

// not that allot of this functionality is covered
// in createDefaultProps - as validate props uses that.

describe("validatePropsDefinition", () => {

    it("should recursively validate array props and return no errors when valid", () => {

        const propsDef = {
            columns : {
                type: "array",
                elementDefinition: {
                    width: "number",
                    units: {
                        type: "string",
                        default: "px"
                    }
                }
            }
        }

        const errors = validatePropsDefinition(propsDef);

        expect(errors).toEqual([]);

    });

    it("should recursively validate array props and return errors when invalid", () => {

        const propsDef = {
            columns : {
                type: "array",
                elementDefinition: {
                    width: "invlid type",
                    units: {
                        type: "string",
                        default: "px"
                    }
                }
            }
        }

        const errors = validatePropsDefinition(propsDef);

        expect(errors.length).toEqual(1);
        expect(errors[0].propName).toBe("width");

    });

    it("should return error when no options for options field", () => {

        const propsDef = {
            size: {
                type: "options",
                options: []
            }
        }

        const errors = validatePropsDefinition(propsDef);

        expect(errors.length).toEqual(1);
        expect(errors[0].propName).toBe("size");

    });

    it("should not return error when options field has options", () => {

        const propsDef = {
            size: {
                type: "options",
                options: ["small", "medium", "large"]
            }
        }

        const errors = validatePropsDefinition(propsDef);

        expect(errors).toEqual([]);

    });

});

const validPropDef = {
    size: {
        type: "options",
        options: ["small", "medium", "large"],
        default:"medium"
    },
    rowCount : "number",
    columns : {
        type: "array",
        elementDefinition: {
            width: "number",
            units: {
                type: "string",
                default: "px"
            }
        }
    }

};

const validProps = () => {
    const { props } = createProps("some_component", validPropDef);
    props.columns.push(
        createProps("childcomponent", validPropDef.columns.elementDefinition).props);
    return props;
}

describe("validateProps", () => {

    it("should have no errors with a big list of valid props", () => {
        
        const errors = validateProps(validPropDef, validProps(), true);
        expect(errors).toEqual([]);
        
    });

    it("should return error with invalid value", () => {
        
        const props = validProps();
        props.rowCount = "1";
        const errors = validateProps(validPropDef, props, true);
        expect(errors.length).toEqual(1);
        expect(errors[0].propName).toBe("rowCount");
        
    });

    it("should return error with invalid option", () => {
        
        const props = validProps();
        props.size = "really_small";
        const errors = validateProps(validPropDef, props, true);
        expect(errors.length).toEqual(1);
        expect(errors[0].propName).toBe("size");
        
    });

    it("should return error with invalid array item", () => {
        
        const props = validProps();
        props.columns[0].width = "seven";
        const errors = validateProps(validPropDef, props, true);
        expect(errors.length).toEqual(1);
        expect(errors[0].propName).toBe("width");
        
    });
})