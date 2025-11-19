import {
  accountPortalBillingUrl,
  accountPortalUpgradeUrl,
  builderWorkspacesUrl,
} from "../url"

const BASE = "https://budibase.com"

describe("url helpers", () => {
  describe("account portal", () => {
    it("builds billing url", () => {
      const url = accountPortalBillingUrl(BASE)
      expect(url).toEqual(`${BASE}/portal/billing`)
    })

    it("falls back to path when base missing", () => {
      const url = accountPortalUpgradeUrl(undefined)
      expect(url).toEqual("/portal/upgrade")
    })
  })

  describe("builder", () => {
    it("normalizes base when joining", () => {
      const url = builderWorkspacesUrl(`${BASE}/`)
      expect(url).toEqual(`${BASE}/builder/workspaces`)
    })
  })
})
