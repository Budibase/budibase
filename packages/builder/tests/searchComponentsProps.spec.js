import {
    searchAllComponents, 
    getExactComponent,
    getAncestorProps
} from "../src/userInterface/pagesParsing/searchComponents";


describe("searchAllComponents", () => {

    it("should match derived component by name", () => {

        const results = searchAllComponents(
            derivedComponents(),
            rootComponents(),
            "password"
        );

        expect(results.length).toBe(1);
        expect(results[0].name).toBe("common/PasswordBox");

    });

    it("should match derived component by tag", () => {

        const results = searchAllComponents(
            derivedComponents(),
            rootComponents(),
            "mask"
        );

        expect(results.length).toBe(1);
        expect(results[0].name).toBe("common/PasswordBox");

    });

    it("should match component if ancestor matches", () => {

        const results = searchAllComponents(
            derivedComponents(),
            rootComponents(),
            "smalltext"
        );

        expect(results.length).toBe(2);

    });

});

describe("getExactComponent", () => {
    it("should get component by name", () => {
        const result = getExactComponent(
            derivedComponents(),
            rootComponents(),
            "common/SmallTextbox"
        )

        expect(result).toBeDefined();
        expect(result.name).toBe("common/SmallTextbox");
    });

    it("should return nothing when no result (should not fail)", () => {
        const result = getExactComponent(
            derivedComponents(),
            rootComponents(),
            "bla/bla/bla"
        )

        expect(result).not.toBeDefined();
    });

});

describe("getAncestorProps", () => {

    it("should return props of root component", () => {

        const result = getAncestorProps(
            derivedComponents(),
            rootComponents(),
            "budibase-components/TextBox"   
        );

        expect(result).toEqual([
            rootComponents()[0].props
        ]);

    });

    it("should return props of all ancestors and current component, in order", () => {

        const derived = derivedComponents();
        const root = rootComponents();

        const result = getAncestorProps(
            derived,
            root,
            "common/PasswordBox"   
        );

        expect(result).toEqual([
            root[0].props,
            {_component: "budibase-components/TextBox", ...derived[0].props},
            {_component: "common/SmallTextbox", ...derived[1].props}
        ]);

    });

})

const derivedComponents = () => ([
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

const rootComponents = () => ([
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
    }
])