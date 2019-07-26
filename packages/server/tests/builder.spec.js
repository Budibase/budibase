
const testAppDef = require("../appPackages/testApp/appDefinition.json");
const testAccessLevels = require("../appPackages/testApp/access_levels.json");
const testPages = require("../appPackages/testApp/pages.json");
const testComponents = require("../appPackages/testApp/customComponents/components.json");
const testMoreComponents = require("../appPackages/testApp/moreCustomComponents/components.json");
const statusCodes = require("../utilities/statusCodes");
const derivedComponent1 = require("../appPackages/testApp/components/myTextBox.json");
const derivedComponent2 = require("../appPackages/testApp/components/subfolder/otherTextBox.json");

const app = require("./testApp")();

beforeAll(async () => await app.start());
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
        "myTextBox" : {...derivedComponent1, _name:"myTextBox"},
        "subfolder/otherTextBox": {...derivedComponent2, _name:"subfolder/otherTextBox"}
    };
                
    expect(body.derivedComponents).toEqual(expectedComponents);
});
