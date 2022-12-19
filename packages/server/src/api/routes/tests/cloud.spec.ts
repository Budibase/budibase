import { db as dbCore } from "@budibase/backend-core"
import { AppStatus } from "../../../db/utils"

import * as setup from "./utilities"

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
      // first we need to delete any existing apps on the system so it looks clean otherwise the
      // import will not run
      await request
        .post(
          `/api/applications/${dbCore.getProdAppID(
            config.getAppId()
          )}/unpublish`
        )
        .set(config.defaultHeaders())
        .expect(204)
      await request
        .delete(`/api/applications/${config.getAppId()}`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)

      // get a count of apps before the import
      const preImportApps = await request
        .get(`/api/applications?status=${AppStatus.ALL}`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)

      // Perform the import
      const res = await request
        .post(`/api/cloud/import`)
        .attach("importFile", "src/api/routes/tests/data/export-test.tar.gz")
        .set(config.defaultHeaders())
        .expect(200)
      expect(res.body.message).toEqual("Apps successfully imported.")

      // get a count of apps after the import
      const postImportApps = await request
        .get(`/api/applications?status=${AppStatus.ALL}`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)

      // There are two apps in the file that was imported so check for this
      expect(postImportApps.body.length).toEqual(2)
    })
  })
})
