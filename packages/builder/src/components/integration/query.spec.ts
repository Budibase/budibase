import { it, expect, describe } from "vitest"
import { applyBaseUrl, isValidEndpointUrl } from "./query"

describe("applyBaseUrl", () => {
  describe("plain URLs", () => {
    it("replaces the origin, keeping the path", () => {
      expect(
        applyBaseUrl(
          "https://old.example.com/api/users",
          "https://new.example.com"
        )
      ).toBe("https://new.example.com/api/users")
    })

    it("replaces the origin, keeping the query string", () => {
      expect(
        applyBaseUrl(
          "https://old.example.com/api/users?page=1",
          "https://new.example.com"
        )
      ).toBe("https://new.example.com/api/users?page=1")
    })

    it("replaces the origin, keeping path + query string + hash", () => {
      expect(
        applyBaseUrl(
          "https://old.example.com/api/users?page=1#top",
          "https://new.example.com"
        )
      ).toBe("https://new.example.com/api/users?page=1#top")
    })

    it("drops the path when current URL is just an origin with no path", () => {
      expect(
        applyBaseUrl("https://old.example.com", "https://new.example.com")
      ).toBe("https://new.example.com")
    })

    it("falls back to newBase when currentUrl is not a valid URL", () => {
      expect(applyBaseUrl("not a url", "https://new.example.com")).toBe(
        "https://new.example.com"
      )
    })

    it("falls back to newBase when currentUrl is empty", () => {
      expect(applyBaseUrl("", "https://new.example.com")).toBe(
        "https://new.example.com"
      )
    })

    it("preserves a relative path when currentUrl has no origin", () => {
      expect(applyBaseUrl("/api/v1/users", "https://new.example.com")).toBe(
        "https://new.example.com/api/v1/users"
      )
    })

    it("strips a trailing slash from newBase to avoid double slashes", () => {
      expect(
        applyBaseUrl(
          "https://old.example.com/api/users",
          "https://new.example.com/"
        )
      ).toBe("https://new.example.com/api/users")
    })

    it("strips trailing slash from newBase when preserving a relative path", () => {
      expect(applyBaseUrl("/api/v1/users", "https://new.example.com/")).toBe(
        "https://new.example.com/api/v1/users"
      )
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

    it("preserves an HBS block in the port position", () => {
      expect(
        applyBaseUrl(
          "http://{{host}}:{{port}}/api/users",
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
  })
})

describe("isValidEndpointUrl", () => {
  it("accepts a valid http URL", () => {
    expect(isValidEndpointUrl("http://example.com/api")).toBe(true)
  })

  it("accepts a valid https URL", () => {
    expect(isValidEndpointUrl("https://example.com/api")).toBe(true)
  })

  it("accepts a single-label hostname", () => {
    expect(isValidEndpointUrl("https://someurl")).toBe(true)
  })

  it("accepts localhost with a port", () => {
    expect(isValidEndpointUrl("http://localhost:4001")).toBe(true)
  })

  it("rejects a relative path", () => {
    expect(isValidEndpointUrl("/api/v1/users")).toBe(false)
  })

  it("rejects an empty string", () => {
    expect(isValidEndpointUrl("")).toBe(false)
  })

  it("rejects https:google.com (missing //)", () => {
    expect(isValidEndpointUrl("https:google.com")).toBe(false)
  })

  it("rejects a non-http protocol", () => {
    expect(isValidEndpointUrl("ftp://example.com")).toBe(false)
  })

  it("rejects a URL with spaces", () => {
    expect(isValidEndpointUrl("https://some url")).toBe(false)
  })

  it("rejects a URL with percent-encoded spaces in the hostname", () => {
    expect(isValidEndpointUrl("https://some%20url")).toBe(false)
  })
})

describe("isValidEndpointUrl - HBS bindings", () => {
  it("accepts a URL that is entirely an HBS binding", () => {
    expect(isValidEndpointUrl("{{env.API_URL}}")).toBe(true)
  })

  it("accepts a URL that starts with an HBS binding followed by a path", () => {
    expect(
      isValidEndpointUrl("{{Connection.Static.serverUrl}}/api/health")
    ).toBe(true)
  })

  it("accepts a URL with an HBS binding in the path", () => {
    expect(
      isValidEndpointUrl("https://api.example.com/{{version}}/users")
    ).toBe(true)
  })

  it("rejects ftp://{{something}} since ftp is not a valid protocol", () => {
    expect(isValidEndpointUrl("ftp://{{env.HOST}}")).toBe(false)
  })

  it("rejects a relative path with a binding", () => {
    expect(isValidEndpointUrl("/api/{{version}}/users")).toBe(false)
  })

  it("rejects a malformed binding with no closing braces", () => {
    expect(isValidEndpointUrl("{{derp")).toBe(false)
  })
})
