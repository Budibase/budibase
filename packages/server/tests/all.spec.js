const app = require("./testApp")();
const  authenticateMaster = require("./authenticate");

beforeAll(() => {
    return app.start();
})

afterAll(() => {
    app.destroy();
})

describe("authenticateMaster", () => authenticateMaster(app));


