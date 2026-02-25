import { DBTestConfiguration } from "../../../tests"
import * as licenseInfo from "../licenseInfo"
import { StaticDatabases } from "@budibase/backend-core"

describe("licenseInfo", () => {
  const config = new DBTestConfiguration()

  describe("save/get", () => {
    beforeEach(async () => {
      await config.doInTenant(async () => {
        await licenseInfo.destroy()
      })
    })

    it("returns new document when not exists", async () => {
      await config.doInTenant(async () => {
        const info = await licenseInfo.get()
        expect(info).toEqual({
          _id: StaticDatabases.GLOBAL.docs.licenseInfo,
        })
      })
    })

    it("creates a new document", async () => {
      await config.doInTenant(async () => {
        const info = await licenseInfo.save({
          licenseKey: "licenseKey",
          offlineLicenseToken: "offlineLicense",
        })
        const _rev = info._rev
        expect(_rev).toBeDefined()
        expect(info).toMatchObject({
          _id: StaticDatabases.GLOBAL.docs.licenseInfo,
          _rev,
          licenseKey: "licenseKey",
          offlineLicenseToken: "offlineLicense",
        })
      })
    })

    it("updates the document", async () => {
      await config.doInTenant(async () => {
        await licenseInfo.save({
          licenseKey: "licenseKey",
          offlineLicenseToken: "offlineLicense",
        })
        const info = await licenseInfo.save({
          licenseKey: undefined,
          offlineLicenseToken: undefined,
        })
        expect(info).toMatchObject({
          licenseKey: undefined,
          offlineLicenseToken: undefined,
        })
      })
    })
  })
})
