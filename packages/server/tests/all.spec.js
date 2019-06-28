const app = require("./testApp")();
const  authenticateMaster = require("./authenticate");
const  createNewApp = require("./createNewApp");

beforeAll(async () => await app.start())

afterAll(async () => await app.destroy())

describe("authenticateMaster", () => authenticateMaster(app));
describe("createNewApp", () => createNewApp(app));


