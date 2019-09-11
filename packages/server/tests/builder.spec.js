
const testAppDef = require("../appPackages/testApp/appDefinition.json");
const testAccessLevels = require("../appPackages/testApp/access_levels.json");
const testPages = require("../appPackages/testApp/pages.json");
const testComponents = require("../appPackages/testApp/customComponents/components.json");
const testMoreComponents = require("../appPackages/testApp/moreCustomComponents/components.json");
const statusCodes = require("../utilities/statusCodes");
const derivedComponent1 = require("../appPackages/testApp/components/myTextBox.json");
const derivedComponent2 = require("../appPackages/testApp/components/subfolder/otherTextBox.json");
const { readJSON, pathExists, unlink } = require("fs-extra");

const app = require("./testApp")();
testComponents.textbox.name = `./customComponents/textbox`;
testMoreComponents.textbox.name = `./moreCustomComponents/textbox`;

beforeAll(async () => {

    const testComponent = "./appPackages/testApp/components/newTextBox.json";
    const testComponentAfterMove = "./appPackages/testApp/components/anotherSubFolder/newTextBox.json";

    if(await pathExists(testComponent)) await unlink(testComponent);
    if(await pathExists(testComponentAfterMove)) await unlink(testComponentAfterMove);

    await app.start();
});
afterAll(async () => await app.destroy());


it("/apppackage should get appDefinition", async () => {

    const {body} = await app.get("/_builder/api/testApp/appPackage")
                         .expect(statusCodes.OK);

    expect(body.appDefinition).toEqual(testAppDef);
});

it("/apppackage should get access levels", async () => {

    const {body} = await app.get("/_builder/api/testApp/appPackage")
                         .expect(statusCodes.OK);

    expect(body.accessLevels).toEqual(testAccessLevels);
});

it("/apppackage should get pages", async () => {

    const {body} = await app.get("/_builder/api/testApp/appPackage")
                         .expect(statusCodes.OK);
    expect(body.pages).toEqual(testPages);
});

it("/apppackage should get rootComponents", async () => {

    const {body} = await app.get("/_builder/api/testApp/appPackage")
                         .expect(statusCodes.OK);

    expect(body.rootComponents["./customComponents/textbox"]).toBeDefined();
    expect(body.rootComponents["./moreCustomComponents/textbox"]).toBeDefined();

    expect(body.rootComponents["./customComponents/textbox"])
    .toEqual(testComponents.textbox);

    expect(body.rootComponents["./moreCustomComponents/textbox"])
    .toEqual(testMoreComponents.textbox);
});

it("/apppackage should get derivedComponents", async () => {

    const {body} = await app.get("/_builder/api/testApp/appPackage")
                         .expect(statusCodes.OK);

    const expectedComponents = {
        "myTextBox" : {...derivedComponent1, name:"myTextBox"},
        "subfolder/otherTextBox": {...derivedComponent2, name:"subfolder/otherTextBox"}
    };
                
    expect(body.derivedComponents).toEqual(expectedComponents);
});

it("should be able to create new derived component", async () => {
    const newDerivedComponent = {
        name: "newTextBox",
        inherits: "./customComponents/textbox",
        props: {
            label: "something"
        }
    };

    await app.post("/_builder/api/testApp/derivedcomponent", newDerivedComponent)
             .expect(statusCodes.OK);
    
    const componentFile = "./appPackages/testApp/components/newTextBox.json";
    expect(await pathExists(componentFile)).toBe(true);
    expect(await readJSON(componentFile)).toEqual(newDerivedComponent);    

});

it("should be able to update derived component", async () => {
    const updatedDerivedComponent = {
        name: "newTextBox",
        inherits: "./customComponents/textbox",
        props: {
            label: "something else"
        }
    };

    await app.post("/_builder/api/testApp/derivedcomponent", updatedDerivedComponent)
             .expect(statusCodes.OK);
    
    const componentFile = "./appPackages/testApp/components/newTextBox.json";
    expect(await readJSON(componentFile)).toEqual(updatedDerivedComponent);    
});

it("should be able to rename derived component", async () => {
    await app.patch("/_builder/api/testApp/derivedcomponent", {
        oldname: "newTextBox", newname: "anotherSubFolder/newTextBox"
    }).expect(statusCodes.OK);
    
    const oldcomponentFile = "./appPackages/testApp/components/newTextBox.json";
    const newcomponentFile = "./appPackages/testApp/components/anotherSubFolder/newTextBox.json";
    expect(await pathExists(oldcomponentFile)).toBe(false);
    expect(await pathExists(newcomponentFile)).toBe(true);

});

it("should be able to delete derived component", async () => {
    await app.delete("/_builder/api/testApp/derivedcomponent/anotherSubFolder/newTextBox")
             .expect(statusCodes.OK);

    const componentFile = "./appPackages/testApp/components/anotherSubFolder/newTextBox.json";
    const componentDir = "./appPackages/testApp/components/anotherSubFolder";
    expect(await pathExists(componentFile)).toBe(false);
    expect(await pathExists(componentDir)).toBe(false);
});

it("/savePackage should prepare all necessary client files", async () => {

    await app.post("/_builder/api/testApp/appPackage", {
        appDefinition: testAppDef,
        accessLevels: testAccessLevels,
        pages: testPages
    })
    .expect(statusCodes.OK);

    const publicFolderMain = relative => "./appPackages/testApp/public/main" + relative;
    const publicFolderUnauth = relative => "./appPackages/testApp/public/unauthenticated" + relative;

    expect(await pathExists(publicFolderMain("/index.html"))).toBe(true);
    expect(await pathExists(publicFolderUnauth("/index.html"))).toBe(true);

    expect(await pathExists(publicFolderMain("/lib/customComponents/index.js"))).toBe(true);
    expect(await pathExists(publicFolderUnauth("/lib/customComponents/index.js"))).toBe(true);
    
    expect(await pathExists(publicFolderMain("/lib/moreCustomComponents/index.js"))).toBe(true);
    expect(await pathExists(publicFolderUnauth("/lib/moreCustomComponents/index.js"))).toBe(true);
    
    expect(await pathExists(publicFolderMain("/lib/node_modules/@budibase/standard-components/dist/index.js"))).toBe(true);
    expect(await pathExists(publicFolderUnauth("/lib/node_modules/@budibase/standard-components/dist/index.js"))).toBe(true);
    
    expect(await pathExists(publicFolderUnauth("/budibase-client.js"))).toBe(true);
    expect(await pathExists(publicFolderUnauth("/clientAppDefinition.js"))).toBe(true);
    
    
    

})
