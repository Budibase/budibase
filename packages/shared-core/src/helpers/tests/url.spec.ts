import {
  agentChatUrl,
  appAgentUrl,
  appChatUrl,
  accountPortalBillingUrl,
  accountPortalUpgradeUrl,
  builderWorkspacesUrl,
  applyBaseUrl,
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
      expect(url).toEqual(`${BASE}/builder/apps`)
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

describe("applyBaseUrl", () => {
  describe("plain URLs", () => {
    it("replaces the origin keeping the path", () => {
      expect(
        applyBaseUrl(
          "https://old.example.com/api/users",
          "https://new.example.com"
        )
      ).toBe("https://new.example.com/api/users")
    })

    it("replaces the origin keeping the query string", () => {
      expect(
        applyBaseUrl(
          "https://old.example.com/api/users?page=1",
          "https://new.example.com"
        )
      ).toBe("https://new.example.com/api/users?page=1")
    })

    it("replaces the origin keeping path + query string + hash", () => {
      expect(
        applyBaseUrl(
          "https://old.example.com/api/users?page=1#top",
          "https://new.example.com"
        )
      ).toBe("https://new.example.com/api/users?page=1#top")
    })

    it("drops the path when current URL is just an origin", () => {
      expect(
        applyBaseUrl("https://old.example.com", "https://new.example.com")
      ).toBe("https://new.example.com")
    })

    it("falls back to newBase when currentUrl is empty", () => {
      expect(applyBaseUrl("", "https://new.example.com")).toBe(
        "https://new.example.com"
      )
    })

    it("returns currentUrl unchanged when newBase is empty", () => {
      expect(
        applyBaseUrl("https://api.attio.com/v2/objects/{{object}}", "")
      ).toBe("https://api.attio.com/v2/objects/{{object}}")
    })

    it("preserves a relative path with leading slash", () => {
      expect(applyBaseUrl("/api/v1/users", "https://new.example.com")).toBe(
        "https://new.example.com/api/v1/users"
      )
    })

    it("strips trailing slash from newBase", () => {
      expect(
        applyBaseUrl(
          "https://old.example.com/api/users",
          "https://new.example.com/"
        )
      ).toBe("https://new.example.com/api/users")
    })

    it("is a no-op when hosts already match", () => {
      expect(
        applyBaseUrl("https://example.com/api/users", "https://example.com")
      ).toBe("https://example.com/api/users")
    })
  })

  describe("HBS template URLs", () => {
    it("preserves HBS blocks in the path", () => {
      expect(
        applyBaseUrl(
          "https://old.example.com/api/{{version}}/users",
          "https://new.example.com"
        )
      ).toBe("https://new.example.com/api/{{version}}/users")
    })

    it("preserves HBS blocks in the query string", () => {
      expect(
        applyBaseUrl(
          "https://old.example.com/api/users?token={{auth.token}}",
          "https://new.example.com"
        )
      ).toBe("https://new.example.com/api/users?token={{auth.token}}")
    })

    it("replaces origin including HBS port binding", () => {
      expect(
        applyBaseUrl(
          "https://old.example.com:{{port}}/api/users",
          "https://new.example.com"
        )
      ).toBe("https://new.example.com/api/users")
    })

    it("preserves HBS blocks in both port and path", () => {
      expect(
        applyBaseUrl(
          "http://{{host}}:{{port}}/api/{{version}}/users",
          "https://new.example.com"
        )
      ).toBe("https://new.example.com/api/{{version}}/users")
    })

    it("preserves multiple HBS blocks in the path", () => {
      expect(
        applyBaseUrl(
          "https://old.example.com/{{org}}/{{repo}}/issues",
          "https://new.example.com"
        )
      ).toBe("https://new.example.com/{{org}}/{{repo}}/issues")
    })

    it("falls back to newBase when host is an unresolved HBS binding", () => {
      expect(
        applyBaseUrl("{{myHost}}/api/v1/users", "https://new.example.com")
      ).toBe("https://new.example.com")
    })
  })
})
