import { buildAccountPortalUrl, buildBuilderUrl } from "../url"

const BASE = "https://budibase.com"

describe("url helpers", () => {
  describe("buildAccountPortalUrl", () => {
    it("joins base url with literal path", () => {
      const url = buildAccountPortalUrl(BASE, "/portal/billing")
      expect(url).toEqual(`${BASE}/portal/billing`)
    })

    it("supports account portal path keys", () => {
      const url = buildAccountPortalUrl(BASE, "ACCOUNT")
      expect(url).toEqual(`${BASE}/portal/account`)
    })

    it("falls back to path when base missing", () => {
      const url = buildAccountPortalUrl(undefined, "/portal/upgrade")
      expect(url).toEqual("/portal/upgrade")
    })
  })

  describe("buildBuilderUrl", () => {
    it("normalizes base when joining", () => {
      const url = buildBuilderUrl(`${BASE}/`, "/builder/workspaces")
      expect(url).toEqual(`${BASE}/builder/workspaces`)
    })
  })
})
