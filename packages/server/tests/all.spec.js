const app = require("./testApp")();
const  authenticateMaster = require("./authenticate");
const  createNewApp = require("./createNewApp");

beforeAll(async () => await app.start())

afterAll(async () => await app.destroy())

describe("authenticateMaster", () => authenticateMaster(app, "_master", () => app.masterAuth));
describe("createNewApp", () => createNewApp(app));
describe("authenticateTestApp", () => authenticateMaster(app, "testApp", () => app.user1_instance1));


