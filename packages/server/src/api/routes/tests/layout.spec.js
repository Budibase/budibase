const { checkBuilderEndpoint } = require("./utilities/TestFunctions")
const setup = require("./utilities")
const { basicLayout } = setup.structures
const { events } = require("@budibase/backend-core")

describe("/layouts", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()
  let layout

  afterAll(setup.afterAll)

  beforeAll(async () => {
    await config.init()
    layout = await config.createLayout()
    jest.clearAllMocks()
  })

  describe("save", () => {
    it("should be able to create a layout", async () => {
      const res = await request
        .post(`/api/layouts`)
        .send(basicLayout())
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body._rev).toBeDefined()
      expect(events.layout.created).toHaveBeenCalledTimes(1)
    })

    it("should apply authorization to endpoint", async () => {
      await checkBuilderEndpoint({
        config,
        method: "POST",
        url: `/api/layouts`,
      })
    })
  })

  describe("destroy", () => {
    it("should be able to delete the layout", async () => {
      const res = await request
        .delete(`/api/layouts/${layout._id}/${layout._rev}`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body.message).toBeDefined()
      expect(events.layout.deleted).toHaveBeenCalledTimes(1)
    })

    it("should apply authorization to endpoint", async () => {
      await checkBuilderEndpoint({
        config,
        method: "DELETE",
        url: `/api/layouts/${layout._id}/${layout._rev}`,
      })
    })
  })
})
