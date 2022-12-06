import { env, constants, tenancy } from "@budibase/backend-core"
import * as setup from "./utilities"

jest.mock("@budibase/backend-core", () => {
  const core = jest.requireActual("@budibase/backend-core")
  return {
    ...core,
    db: {
      ...core.db,
      getAllApps: () => [],
    },
  }
})

describe("/cloud", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()

  afterAll(setup.afterAll)

  beforeEach(async () => {
    await config.init()
  })

  afterEach(async () => {
    // clear all mocks
    jest.clearAllMocks()
  })

  describe("import", () => {
    it("should be able to import apps", async () => {
      const res = await request
        .post(`/api/cloud/import`)
        .attach("importFile", "src/api/routes/tests/data/export-test.tar.gz")
        .set(config.defaultHeaders())
        .expect(200)
      expect(res.body.message).toEqual("Apps successfully imported.")
    })
  })
})
