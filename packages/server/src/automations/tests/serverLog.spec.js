const setup = require("./utilities")

describe("test the server log action", () => {
    let config = setup.getConfig()

    beforeAll(async () => {
        await config.init()
        inputs = {
            text: "log message",
        }
    })
    afterAll(setup.afterAll)

    it("should be able to log the text", async () => {

        let res = await setup.runStep(setup.actions.SERVER_LOG.stepId,
            inputs
        )
        expect(res.message).toEqual(`App ${config.getAppId()} - ${inputs.text}`)
        expect(res.success).toEqual(true)
    })
})
