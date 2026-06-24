import { it, expect, describe } from "vitest"
import { applyBaseUrl } from "@budibase/shared-core"
import {
  isValidEndpointUrl,
  isValidEndpointUrlMissingProtocol,
  constructFullPath,
  convertPathVariables,
  validateQuery,
} from "./query"

// Just a smoke test in the builder as the base functionality
// is already covered
describe("applyBaseUrl", () => {
  it("replaces the origin keeping the path", () => {
    expect(
      applyBaseUrl(
        "https://old.example.com/api/users",
        "https://new.example.com"
      )
    ).toBe("https://new.example.com/api/users")
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

  it("rejects https:example.com (missing //)", () => {
    expect(isValidEndpointUrl("https:example.com")).toBe(false)
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

describe("isValidEndpointUrlMissingProtocol", () => {
  it("accepts a valid domain without a protocol", () => {
    expect(isValidEndpointUrlMissingProtocol("example.com")).toBe(true)
  })

  it("accepts localhost without a protocol", () => {
    expect(isValidEndpointUrlMissingProtocol("localhost")).toBe(true)
  })

  it("accepts localhost with a port without a protocol", () => {
    expect(isValidEndpointUrlMissingProtocol("localhost:4001")).toBe(true)
  })

  it("accepts a valid domain and path without a protocol", () => {
    expect(isValidEndpointUrlMissingProtocol("example.com/api/users")).toBe(
      true
    )
  })

  it("rejects a URL that already includes a protocol", () => {
    expect(isValidEndpointUrlMissingProtocol("https://example.com")).toBe(false)
  })

  it("rejects a relative path", () => {
    expect(isValidEndpointUrlMissingProtocol("api/v1/users")).toBe(false)
  })

  it("rejects a path with a leading slash", () => {
    expect(isValidEndpointUrlMissingProtocol("/api/v1/users")).toBe(false)
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

  it("accepts a binding containing internal whitespace", () => {
    expect(
      isValidEndpointUrl("https://api.example.com/{{ contact_id }}/users")
    ).toBe(true)
  })

  it("accepts a URL that is entirely a binding with internal whitespace", () => {
    expect(isValidEndpointUrl("{{ env.API_URL }}")).toBe(true)
  })

  it("rejects whitespace outside of a binding", () => {
    expect(
      isValidEndpointUrl("https://api.example.com/{{ contact_id }} /users")
    ).toBe(false)
  })

  it("accepts multiple bindings that each contain internal whitespace", () => {
    expect(
      isValidEndpointUrl(
        "https://api.example.com/{{ org_id }}/{{ contact_id }}"
      )
    ).toBe(true)
  })

  it("rejects whitespace between two bindings", () => {
    expect(isValidEndpointUrl("https://api.example.com/{{ a }} {{ b }}")).toBe(
      false
    )
  })
})

describe("convertPathVariables", () => {
  it("converts OpenAPI {var} to HBS {{var}}", () => {
    expect(convertPathVariables("/api/{version}/users/{id}")).toBe(
      "/api/{{version}}/users/{{id}}"
    )
  })

  it("returns value unchanged when no path variables", () => {
    expect(convertPathVariables("/api/v1/users")).toBe("/api/v1/users")
  })
})

describe("constructFullPath", () => {
  it("joins base URL and endpoint path", () => {
    expect(constructFullPath("https://example.com", "/api/v1/users")).toBe(
      "https://example.com/api/v1/users"
    )
  })

  it("strips trailing slash from base", () => {
    expect(constructFullPath("https://example.com/", "/api/v1/users")).toBe(
      "https://example.com/api/v1/users"
    )
  })

  it("returns base when path is empty", () => {
    expect(constructFullPath("https://example.com", "")).toBe(
      "https://example.com"
    )
  })

  it("returns just the path when base is undefined", () => {
    expect(constructFullPath(undefined, "api/v1/users")).toBe("api/v1/users")
  })
})

describe("validateQuery", () => {
  it("throws when url contains {{user}} binding", () => {
    expect(() =>
      validateQuery("https://example.com/{{user}}", undefined, {}, {})
    ).toThrow("'user' is a protected binding")
  })

  it("throws when request body contains {{user.id}}", () => {
    expect(() =>
      validateQuery("https://example.com/api", "{{user.id}}", {}, {})
    ).toThrow("'user' is a protected binding")
  })

  it("does not throw for safe bindings", () => {
    expect(() =>
      validateQuery("https://example.com/{{version}}/users", undefined, {}, {})
    ).not.toThrow()
  })
})
