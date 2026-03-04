import {
  agentChatUrl,
  appAgentUrl,
  appChatUrl,
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

    it("builds tenant-specific upgrade url", () => {
      const url = accountPortalUpgradeUrl(BASE, "tenant123")
      expect(url).toEqual(
        `${BASE}/portal/tenants?managePlansTenantId=tenant123`
      )
    })

    it("falls back to generic upgrade when tenant missing", () => {
      const url = accountPortalUpgradeUrl(BASE, null)
      expect(url).toEqual(`${BASE}/portal/upgrade`)
    })
  })

  describe("builder", () => {
    it("normalizes base when joining", () => {
      const url = builderWorkspacesUrl(`${BASE}/`)
      expect(url).toEqual(`${BASE}/builder/workspaces`)
    })
  })

  describe("chat", () => {
    it("builds app chat url", () => {
      const url = appChatUrl("/my-app")
      expect(url).toEqual("/app-chat/my-app")
    })

    it("builds app agent url with encoded agent id", () => {
      const url = appAgentUrl("my-app", "agent 123")
      expect(url).toEqual("/my-app/agent/agent%20123")
    })

    it("builds agent chat url with encoded agent id", () => {
      const url = agentChatUrl("my-app", "agent 123")
      expect(url).toEqual("/app-chat/my-app/agent/agent%20123")
    })
  })
})
