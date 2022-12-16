const setup = require("./utilities")
const fetch = require("node-fetch")

jest.mock("node-fetch")

describe("test the outgoing webhook action", () => {
    let inputs
    let config = setup.getConfig()

    beforeEach(async () => {
        await config.init()
        inputs = {
            value1: "test",
            url: "http://www.test.com",
        }
    })

    afterAll(setup.afterAll)

    it("should be able to run the action", async () => {
        const res = await setup.runStep(setup.actions.zapier.stepId, inputs)
        expect(res.response.url).toEqual("http://www.test.com")
        expect(res.response.method).toEqual("post")
        expect(res.success).toEqual(true)
    })

})
