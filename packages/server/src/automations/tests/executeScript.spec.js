const setup = require("./utilities")

describe("test the execute script action", () => {
    let config = setup.getConfig()

    beforeAll(async () => {
        await config.init()
    })
    afterAll(setup.afterAll)

    it("should be able to execute a script", async () => {

        let res = await setup.runStep(setup.actions.EXECUTE_SCRIPT.stepId,
            inputs = {
                code: "return 1 + 1"
            }

        )
        expect(res.value).toEqual(2)
        expect(res.success).toEqual(true)
    })

    it("should handle a null value", async () => {

        let res = await setup.runStep(setup.actions.EXECUTE_SCRIPT.stepId,
            inputs = {
                code: null
            }


        )
        expect(res.response.message).toEqual("Invalid inputs")
        expect(res.success).toEqual(false)
    })

    it("should be able to handle an error gracefully", async () => {

        let res = await setup.runStep(setup.actions.EXECUTE_SCRIPT.stepId,
            inputs = {
                code: "return something.map(x => x.name)"
            }

        )
        expect(res.response).toEqual("ReferenceError: something is not defined")
        expect(res.success).toEqual(false)
    })

})
