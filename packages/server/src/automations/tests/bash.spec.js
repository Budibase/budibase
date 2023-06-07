const setup = require("./utilities")

describe("test the bash action", () => {
    let config = setup.getConfig()

    beforeAll(async () => {
        await config.init()
    })
    afterAll(setup.afterAll)

    it("should be able to execute a script", async () => {

        let res = await setup.runStep("EXECUTE_BASH",
            inputs = {
                code: "echo 'test'"
            }

        )
        expect(res.stdout).toEqual("test\n")
        expect(res.success).toEqual(true)
    })

    it("should handle a null value", async () => {

        let res = await setup.runStep("EXECUTE_BASH",
            inputs = {
                code: null
            }


        )
        expect(res.stdout).toEqual("Budibase bash automation failed: Invalid inputs")
    })
})
