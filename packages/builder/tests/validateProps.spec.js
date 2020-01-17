import { 
    validateComponentDefinition,
    validateProps,
    recursivelyValidate
} from "../src/userInterface/pagesParsing/validateProps";
import { createProps }  from "../src/userInterface/pagesParsing/createProps";
import {
    setBinding
} from "../src/common/binding";

// not that allot of this functionality is covered
// in createDefaultProps - as validate props uses that.

describe("validateComponentDefinition", () => {


    it("should return error when no options for options field", () => {

        const compDef = { 
            name:"some_component",
            props: {
                size: {
                    type: "options",
                    options: []
                }
            }
        };

        const errors = validateComponentDefinition(compDef);

        expect(errors.length).toEqual(1);
        expect(errors[0].propName).toBe("size");

    });

    it("should not return error when options field has options", () => {

        const compDef = {
            name: "some_component",
            props: {
                size: {
                    type: "options",
                    options: ["small", "medium", "large"]
                }
            }
        };

        const errors = validateComponentDefinition(compDef);

        expect(errors).toEqual([]);

    });

});

const validComponentDef = {
    name: "some_component",
    props: {
        size: {
            type: "options",
            options: ["small", "medium", "large"],
            default:"medium"
        },
        rowCount : "number"
    }
};

const childComponentDef = {
    name: "child_component",
    props: {
        width: "number",
        units: {
            type: "string",
            default: "px"
        }
    }
};

const validProps = () => {

    const { props } = createProps(validComponentDef);
    props._children.push(
        createProps(childComponentDef));
    return props;
}

describe("validateProps", () => {

    it("should have no errors with a big list of valid props", () => {
        
        const errors = validateProps(validComponentDef, validProps(), [], true);
        expect(errors).toEqual([]);
        
    });

    it("should return error with invalid value", () => {
        
        const props = validProps();
        props.rowCount = "1";
        const errors = validateProps(validComponentDef, props, [], true);
        expect(errors.length).toEqual(1);
        expect(errors[0].propName).toBe("rowCount");
        
    });

    it("should return error with invalid option", () => {
        
        const props = validProps();
        props.size = "really_small";
        const errors = validateProps(validComponentDef, props, [], true);
        expect(errors.length).toEqual(1);
        expect(errors[0].propName).toBe("size");
        
    });

    it("should not return error when has binding", () => {
        const props = validProps();
        props._children[0].width = setBinding({path:"some_path"});
        props.size = setBinding({path:"other path", fallback:"small"});
        const errors = validateProps(validComponentDef, props, [], true);
        expect(errors.length).toEqual(0);
    });
});

describe("recursivelyValidateProps", () => {

    const rootComponent = { 
        name: "rootComponent",
        children: true,
        props: {
            width: "number"
        }
    };

    const todoListComponent = { 
        name: "todoListComponent",
        props:{
            showTitle: "bool"
        }
    };

    const headerComponent = {
        name: "headerComponent",
        props: {
            text: "string"
        }
    };

    const iconComponent = {
        name: "iconComponent",
        props: {
           iconName:  "string"
        }
    };

    const navItemComponent = {
        name: "navItemComponent",
        props: {
            text: "string"
        }
    };

    const getComponent = name => ({
        rootComponent,
        todoListComponent,
        headerComponent,
        iconComponent,
        navItemComponent
    })[name];

    const rootProps = () => ({
        _component: "rootComponent",
        width: 100,
        _children: [{
            _component: "todoListComponent",
            showTitle: true,
            _children : [
                {
                    _component: "navItemComponent",
                    text: "todos"
                },
                {
                    _component: "headerComponent",
                    text: "Your todo list"
                },
                {
                    _component: "iconComponent",
                    iconName: "fa fa-list"
                },
                {
                    _component: "iconComponent",
                    iconName:"fa fa-cog"
                }
            ]
        }]
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
        root._children[0].showTitle = "yeeeoooo";
        const result = recursivelyValidate(root, getComponent);
        expect(result.length).toBe(1);
        expect(result[0].stack).toEqual([0]);
        expect(result[0].propName).toBe("showTitle");
    });

    it("should return error on second nested child component", () => {
        const root = rootProps();
        root._children[0]._children[0].text = false;
        const result = recursivelyValidate(root, getComponent);
        expect(result.length).toBe(1);
        expect(result[0].stack).toEqual([0,0]);
        expect(result[0].propName).toBe("text");
    });

});