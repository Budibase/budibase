import { App } from "@budibase/types"

jest.setTimeout(30000)

import { AppStatus } from "../../../db/utils"

import * as setup from "./utilities"

import { wipeDb } from "./utilities/TestFunctions"
import { tenancy } from "@budibase/backend-core"

describe("/cloud", () => {
  let request = setup.getRequest()!
  let config = setup.getConfig()

  afterAll(setup.afterAll)

  beforeAll(async () => {
    // Importing is only allowed in self hosted environments
    await config.init()
    config.modeSelf()
  })

  describe("import", () => {
    it("should be able to import apps", async () => {
      // first we need to delete any existing apps on the system so it looks clean otherwise the
      // import will not run
      await wipeDb()

      // Perform the import
      const res = await request
        .post(`/api/cloud/import`)
        .set(config.publicHeaders())
        .attach("importFile", "src/api/routes/tests/data/export-test.tar.gz")
        .expect(200)
      expect(res.body.message).toEqual("Apps successfully imported.")

      // get a count of apps after the import
      const postImportApps = await request
        .get(`/api/applications?status=${AppStatus.ALL}`)
        .set(config.publicHeaders())
        .expect("Content-Type", /json/)
        .expect(200)

      const apps = postImportApps.body as App[]
      // There are two apps in the file that was imported so check for this
      expect(apps.length).toEqual(2)
      // The new tenant id was assigned to the imported apps
      expect(tenancy.getTenantIDFromAppID(apps[0].appId)).toBe(
        config.getTenantId()
      )
    })
  })
})
