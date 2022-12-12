jest.mock("@budibase/backend-core", () => {
  const core = jest.requireActual("@budibase/backend-core")
  return {
    ...core,
    objectStore: {
      budibaseTempDir: core.objectStore.budibaseTempDir,
    },
  }
})

import * as setup from "./utilities"
import { events } from "@budibase/backend-core"
import sdk from "../../../sdk"
import { checkBuilderEndpoint } from "./utilities/TestFunctions"
describe("/backups", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()

  afterAll(setup.afterAll)

  beforeEach(async () => {
    await config.init()
  })

  describe("exportAppDump", () => {
    it("should be able to export app", async () => {
      const res = await request
        .get(`/api/backups/export?appId=${config.getAppId()}&appname=test`)
        .set(config.defaultHeaders())
        .expect(200)
      expect(res.text).toBeDefined()
      expect(res.headers["content-type"]).toEqual("application/gzip")
      expect(events.app.exported).toBeCalledTimes(1)
    })

    it("should apply authorization to endpoint", async () => {
      await checkBuilderEndpoint({
        config,
        method: "GET",
        url: `/api/backups/export?appId=${config.getAppId()}`,
      })
    })
  })

  describe("calculateBackupStats", () => {
    it("should be able to calculate the backup statistics", async () => {
      config.createAutomation()
      config.createScreen()
      let res = await sdk.backups.calculateBackupStats(config.getAppId())
      expect(res.automations).toEqual(1)
      expect(res.datasources).toEqual(1)
      expect(res.screens).toEqual(1)
    })
  })
})
