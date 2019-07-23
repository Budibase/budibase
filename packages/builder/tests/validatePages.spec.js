import { 
    validatePages, 
    validatePage 
} from "../src/userInterface/propsDefinitionParsing/validatePages";

const validPages = () => ({
    "main" : {
        "index" : {
            "_component": "testIndexHtml",
            "title": "My Cool App",
            "customScripts": [
                {"url": "MyCustomComponents.js"}
            ]
        },
        "appBody" : "./main.app.json"
    },
    "unauthenticated" : {
        "index" : {
            "_component": "testIndexHtml",
            "title": "My Cool App - Login",
            "customScripts": [
                {"url": "MyCustomComponents.js"}
            ]
        },
        "appBody" : "./unauthenticated.app.json"
    },
    "componentLibraries": ["./myComponents"]
});

const getComponent = name => ({
    testIndexHtml : {
        title: "string",
        customScripts: {
            type:"array", 
            elementDefinition: {
                url: "string"
            }
        }
    }
}[name])

describe("validate single page", () => {

    it("should return no errors when page is valid", () => {
        const errors = validatePage(
            validPages().main, 
            getComponent);
        
        expect(errors).toEqual([]);
    });

    it("should return error when index is not set, or set incorrectly", () => {
        let page = validPages().main;
        delete page.index;
        expect(validatePage(page, getComponent).length).toEqual(1);

        page.index = {title:"something"}; // no _component
        const noComponent = validatePage(page, getComponent);
        expect(noComponent.length).toEqual(1);

    });

    it("should return error when appBody is not set, or set incorrectly", () => {
        let page = validPages().main;
        delete page.appBody;
        expect(validatePage(page, getComponent).length).toEqual(1);

        page.appBody = true; // not a string
        expect(validatePage(page, getComponent).length).toEqual(1);

        page.appBody = "something.js"; // not a json
        expect(validatePage(page, getComponent).length).toEqual(1);

    });

});

describe("validate pages", () => {

    it("should return no errors when pages are valid", () => {
        const errors = validatePages(
            validPages(), 
            getComponent);
        
        expect(errors).toEqual([]);
    });

    it("should return error when index is not set, or set incorrectly", () => {

    });

});
