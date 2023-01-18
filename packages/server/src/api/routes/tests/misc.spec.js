const setup = require("./utilities")
const tableUtils = require("../../controllers/table/utils")

describe("run misc tests", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()

  afterAll(setup.afterAll)

  beforeEach(async () => {
    await config.init()
  })

  describe("/bbtel", () => {
      it("check if analytics enabled", async () => {
        const res = await request
          .get(`/api/bbtel`)
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
      const text = res.text
      if (text.includes("alpha")) {
        expect(text.split(".").length).toEqual(4)
      } else {
        expect(text.split(".").length).toEqual(3)
      }
      
    })
  })

  describe("test table utilities", () => {
    it("should be able to import data", async () => {
      return config.doInContext(null, async () => {
        const table = await config.createTable({
          name: "table",
          type: "table",
          key: "name",
          schema: {
            a: {
              type: "string",
              constraints: {
                type: "string",
              },
            },
            b: {
              type: "string",
              constraints: {
                type: "string",
              },
            },
            c: {
              type: "string",
              constraints: {
                type: "string",
              },
            },
            d: {
              type: "string",
              constraints: {
                type: "string",
              },
            },
          },
        })

        await tableUtils.handleDataImport(
          { userId: "test" },
          table,
          [{ a: '1', b: '2', c: '3', d: '4'}]
        )
        const rows = await config.getRows()
        expect(rows[0].a).toEqual("1")
        expect(rows[0].b).toEqual("2")
        expect(rows[0].c).toEqual("3")
      })
    })
  })
})
