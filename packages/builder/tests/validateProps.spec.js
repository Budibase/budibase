import { 
    validatePropsDefinition,
    validateProps,
    recursivelyValidate
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
        
        const errors = validateProps(validPropDef, validProps(), [], true);
        expect(errors).toEqual([]);
        
    });

    it("should return error with invalid value", () => {
        
        const props = validProps();
        props.rowCount = "1";
        const errors = validateProps(validPropDef, props, [], true);
        expect(errors.length).toEqual(1);
        expect(errors[0].propName).toBe("rowCount");
        
    });

    it("should return error with invalid option", () => {
        
        const props = validProps();
        props.size = "really_small";
        const errors = validateProps(validPropDef, props, [], true);
        expect(errors.length).toEqual(1);
        expect(errors[0].propName).toBe("size");
        
    });

    it("should return error with invalid array item", () => {
        
        const props = validProps();
        props.columns[0].width = "seven";
        const errors = validateProps(validPropDef, props, [], true);
        expect(errors.length).toEqual(1);
        expect(errors[0].propName).toBe("width");
        
    });
});

describe("recursivelyValidateProps", () => {

    const rootComponent = {
        width: "number",
        child: "component",
        navitems: {
            type: "array",
            elementDefinition: {
                name: "string",
                icon: "component"
            }
        }
    };

    const todoListComponent = {
        showTitle: "bool",
        header: "component"
    };

    const headerComponent = {
        text: "string"
    }

    const iconComponent = {
        iconName:  "string"
    }

    const getComponent = name => ({
        rootComponent,
        todoListComponent,
        headerComponent,
        iconComponent
    })[name];

    const rootProps = () => ({
        _component: "rootComponent",
        width: 100,
        child: {
            _component: "todoListComponent",
            showTitle: true,
            header: {
                _component: "headerComponent",
                text: "Your todo list"
            }
        },
        navitems: [
            {
                name: "Main",
                icon: {
                    _component: "iconComponent",
                    iconName:"fa fa-list"
                }
            },
            {
                name: "Settings",
                icon: {
                    _component: "iconComponent",
                    iconName:"fa fa-cog"
                }
            }
        ]
    });

    it("should return no errors for valid structure", () => {
        const result = recursivelyValidate(
            rootProps(),
            getComponent);

        expect(result).toEqual([]);
    });

    it("should return error on root component", () => {
        const root = rootProps();
        root.width = "yeeeoooo";
        const result = recursivelyValidate(root, getComponent);
        expect(result.length).toBe(1);
        expect(result[0].propName).toBe("width");
    });

    it("should return error on first nested child component", () => {
        const root = rootProps();
        root.child.showTitle = "yeeeoooo";
        const result = recursivelyValidate(root, getComponent);
        expect(result.length).toBe(1);
        expect(result[0].stack).toEqual(["child"]);
        expect(result[0].propName).toBe("showTitle");
    });

    it("should return error on second nested child component", () => {
        const root = rootProps();
        root.child.header.text = false;
        const result = recursivelyValidate(root, getComponent);
        expect(result.length).toBe(1);
        expect(result[0].stack).toEqual(["child", "header"]);
        expect(result[0].propName).toBe("text");
    });

    it("should return error on invalid array prop", () => {
        const root = rootProps();
        root.navitems[1].name = false;
        const result = recursivelyValidate(root, getComponent);
        expect(result.length).toBe(1);
        expect(result[0].propName).toBe("name");
        expect(result[0].stack).toEqual(["navitems[1]"]);
    });

    it("should return error on invalid array child", () => {
        const root = rootProps();
        root.navitems[1].icon.iconName = false;
        const result = recursivelyValidate(root, getComponent);
        expect(result.length).toBe(1);
        expect(result[0].propName).toBe("iconName");
        expect(result[0].stack).toEqual(["navitems[1]", "icon"]);
    });

});