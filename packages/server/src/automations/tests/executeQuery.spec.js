const setup = require("./utilities")

describe("test the execute query action", () => {
    let config = setup.getConfig()

    beforeAll(async () => {
        await config.init()

        await config.createDatasource()
        query = await config.createQuery()

    })

    afterAll(setup.afterAll)

    it("should be able to execute a query", async () => {
        let res = await setup.runStep(setup.actions.EXECUTE_QUERY.stepId,
            inputs = {
                query: { queryId: query._id }
            }
        )
        expect(res.response).toEqual([{ a: 'string', b: 1 }])
        expect(res.success).toEqual(true)
    })

    it("should handle a null query value", async () => {
        let res = await setup.runStep(setup.actions.EXECUTE_QUERY.stepId,
            inputs = {
                query: null
            }
        )
        expect(res.response.message).toEqual("Invalid inputs")
        expect(res.success).toEqual(false)
    })


    it("should handle an error executing a query", async () => {
        let res = await setup.runStep(setup.actions.EXECUTE_QUERY.stepId,
            inputs = {
                query: { queryId: "wrong_id" }
            }
        )
        expect(res.response).toEqual('Error: missing')
        expect(res.success).toEqual(false)
    })


})
