const setup = require("./utilities")
const tableUtils = require("../../controllers/table/utils")

describe("run misc tests", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()

  afterAll(setup.afterAll)

  beforeEach(async () => {
    await config.init()
  })

  describe("/analytics", () => {
      it("check if analytics enabled", async () => {
        const res = await request
          .get(`/api/analytics`)
          .set(config.defaultHeaders())
          .expect("Content-Type", /json/)
          .expect(200)
        expect(typeof res.body.enabled).toEqual("boolean")
      })
  })

  describe("/health", () => {
    it("should confirm healthy", async () => {
      await request.get("/health").expect(200)
    })
  })

  describe("/version", () => {
    it("should confirm version", async () => {
      const res = await request.get("/version").expect(200)
      expect(res.text.split(".").length).toEqual(3)
    })
  })

  describe("test table utilities", () => {
    it("should be able to import a CSV", async () => {
      const table = await config.createTable()
      const dataImport = {
        csvString: "a,b,c,d\n1,2,3,4"
      }
      await tableUtils.handleDataImport({
        appId: config.getAppId(),
        userId: "test",
      }, table, dataImport)
      const rows = await config.getRows()
      expect(rows[0].a).toEqual("1")
      expect(rows[0].b).toEqual("2")
      expect(rows[0].c).toEqual("3")
    })
  })
})