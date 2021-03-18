const { checkBuilderEndpoint } = require("./utilities/TestFunctions")
const setup = require("./utilities")
const { basicScreen } = setup.structures

describe("/screens", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()
  let screen

  afterAll(setup.afterAll)

  beforeEach(async () => {
    await config.init()
    screen = await config.createScreen()
  })

  describe("fetch", () => {
    it("should be able to create a layout", async () => {
      const res = await request
        .get(`/api/screens`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body.length).toEqual(3)
      expect(res.body.some(s => s._id === screen._id)).toEqual(true)
    })

    it("should apply authorization to endpoint", async () => {
      await checkBuilderEndpoint({
        config,
        method: "GET",
        url: `/api/screens`,
      })
    })
  })

  describe("save", () => {
    it("should be able to save a screen", async () => {
      const screenCfg = basicScreen()
      const res = await request
        .post(`/api/screens`)
        .send(screenCfg)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body._rev).toBeDefined()
      expect(res.body.name).toEqual(screenCfg.name)
    })

    it("should apply authorization to endpoint", async () => {
      await checkBuilderEndpoint({
        config,
        method: "POST",
        url: `/api/screens`,
      })
    })
  })

  describe("destroy", () => {
    it("should be able to delete the screen", async () => {
      const res = await request
        .delete(`/api/screens/${screen._id}/${screen._rev}`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body.message).toBeDefined()
    })

    it("should apply authorization to endpoint", async () => {
      await checkBuilderEndpoint({
        config,
        method: "DELETE",
        url: `/api/screens/${screen._id}/${screen._rev}`,
      })
    })
  })
})