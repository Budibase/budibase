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
            "smalltextbox"
        );

        expect(results.length).toBe(1);
        expect(results[0].name).toBe("common/SmallTextbox");

    })

});

describe("getExactComponent", () => {

});

describe("getAncestorProps", () => {

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