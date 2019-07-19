const app = require("./testApp")();
const  authenticateMaster = require("./authenticate");
const  createNewApp = require("./createNewApp");
const  multipleInstances = require("./multipleInstances");
const serveui = require("./serveui");

beforeAll(async () => await app.start())

afterAll(async () => await app.destroy())

describe("authenticateMaster", () => authenticateMaster(app, "_master", "masterOwner"));
describe("createNewApp", () => createNewApp(app));
describe("authenticateTestApp", () => authenticateMaster(app, "testApp", "testAppUser1"));
describe("multipleInstances", () => multipleInstances(app));
describe("serveUi", () => serveui(app));


