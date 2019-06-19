const app = require("./testApp")();
const  authenticateMaster = require("./authenticate");

beforeAll(async () => await app.start())

afterAll(async () => await app.destroy())

describe("authenticateMaster", () => authenticateMaster(app));


