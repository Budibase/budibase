import {
    searchAllComponents, 
    getExactComponent,
    getAncestorProps
} from "../src/userInterface/pagesParsing/searchComponents";


describe("searchAllComponents", () => {

    it("should match derived component by name", () => {

        const results = searchAllComponents(
            components(),
            "password"
        );

        expect(results.length).toBe(1);
        expect(results[0].name).toBe("common/PasswordBox");

    });

    it("should match derived component by tag", () => {

        const results = searchAllComponents(
            components(),
            "mask"
        );

        expect(results.length).toBe(1);
        expect(results[0].name).toBe("common/PasswordBox");

    });

    it("should match component if ancestor matches", () => {

        const results = searchAllComponents(
            components(),
            "smalltext"
        );

        expect(results.length).toBe(2);

    });

});

describe("getExactComponent", () => {
    it("should get component by name", () => {
        const result = getExactComponent(
            components(),
            "common/SmallTextbox"
        )

        expect(result).toBeDefined();
        expect(result.name).toBe("common/SmallTextbox");
    });

    it("should return nothing when no result (should not fail)", () => {
        const result = getExactComponent(
            components(),
            "bla/bla/bla"
        )

        expect(result).not.toBeDefined();
    });

});

describe("getAncestorProps", () => {

    it("should return props of root component", () => {

        const result = getAncestorProps(
            components(),
            "budibase-components/TextBox"   
        );

        expect(result).toEqual([
            components()[0].props
        ]);

    });

    it("should return props of all ancestors and current component, in order", () => {

        const allComponents = components();

        const result = getAncestorProps(
            allComponents,
            "common/PasswordBox"   
        );

        expect(result).toEqual([
            allComponents[0].props,
            {_component: "budibase-components/TextBox", ...allComponents[2].props},
            {_component: "common/SmallTextbox", ...allComponents[3].props}
        ]);

    });

})

const components = () => ([
{
    name: "budibase-components/TextBox",
    tags: ["Text", "input"],
    props: {
        size: {type:"options", options:["small", "medium", "large"]},
        isPassword: "boolean",
        placeholder: "string",
        label:"string"
    } 
},
{
    name: "budibase-components/Button",
    tags: ["input"],
    props: {
        size: {type:"options", options:["small", "medium", "large"]},
        css: "string",
        content: "component"
    } 
},
{
    inherits:"budibase-components/TextBox",
    name: "common/SmallTextbox",
    props: {
        size: "small"
    }
},
{
    inherits:"common/SmallTextbox",
    name: "common/PasswordBox",
    tags: ["mask"],
    props: {
        isPassword: true
    }
},
{
    inherits:"budibase-components/Button",
    name:"PrimaryButton",
    props: {
        css:"btn-primary"
    }
}
])
