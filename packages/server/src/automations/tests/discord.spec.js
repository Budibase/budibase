const setup = require("./utilities")
const fetch = require("node-fetch")

jest.mock("node-fetch")

describe("test the outgoing webhook action", () => {
    let inputs
    let config = setup.getConfig()

    beforeAll(async () => {
        await config.init()
        inputs = {
            username: "joe_bloggs",
            url: "http://www.test.com",
        }
    })

    afterAll(setup.afterAll)

    it("should be able to run the action", async () => {
        const res = await setup.runStep(setup.actions.discord.stepId, inputs)
        expect(res.response.url).toEqual("http://www.test.com")
        expect(res.response.method).toEqual("post")
        expect(res.success).toEqual(true)
    })

})
