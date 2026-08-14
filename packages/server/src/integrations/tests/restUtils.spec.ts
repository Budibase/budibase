import {
  getAttachmentHeaders,
  sanitiseBody,
  sanitiseHeaders,
} from "../utils/restUtils"
import { RestAuthType, SecretTag } from "@budibase/types"
import type { Headers } from "undici"
import { FormData, Headers as UndiciHeaders } from "undici"

function headers(dispositionValue: string, contentType?: string) {
  return {
    get: (name: string) => {
      if (name.toLowerCase() === "content-disposition") {
        return dispositionValue
      } else {
        return contentType || "application/pdf"
      }
    },
    set: () => {},
  } as unknown as Headers
}

describe("getAttachmentHeaders", () => {
  it("should be able to correctly handle a broken content-disposition", () => {
    const { contentDisposition } = getAttachmentHeaders(
      headers(`filename="report.pdf"`)
    )
    expect(contentDisposition).toBe(`attachment; filename="report.pdf"`)
  })

  it("should be able to correctly with a filename that could cause problems", () => {
    const { contentDisposition } = getAttachmentHeaders(
      headers(`filename="report;.pdf"`)
    )
    expect(contentDisposition).toBe(`attachment; filename="report;.pdf"`)
  })

  it("should not touch a valid content-disposition", () => {
    const { contentDisposition } = getAttachmentHeaders(
      headers(`inline; filename="report.pdf"`)
    )
    expect(contentDisposition).toBe(`inline; filename="report.pdf"`)
  })

  it("should leave inline content disposition without parameters alone", () => {
    const { contentDisposition } = getAttachmentHeaders(headers("inline"))
    expect(contentDisposition).toBe("inline")
  })

  it("should handle an image", () => {
    const { contentDisposition } = getAttachmentHeaders(
      headers("", "image/png"),
      {
        downloadImages: true,
      }
    )
    expect(contentDisposition).toBe(`attachment; filename="image.png"`)
  })
})

describe("sanitiseHeaders", () => {
  it("should replace a basic auth credential, retaining the scheme", () => {
    const sanitised = sanitiseHeaders({
      headers: { Authorization: "Basic dXNlcjpwYXNzd29yZA==" },
      authHeaderKeys: ["Authorization"],
      authType: RestAuthType.BASIC,
    })
    expect(sanitised.Authorization).toEqual(`Basic ${SecretTag.BASIC}`)
  })

  it("should replace a bearer token, retaining the scheme", () => {
    const sanitised = sanitiseHeaders({
      headers: { Authorization: "Bearer mytoken" },
      authHeaderKeys: ["Authorization"],
      authType: RestAuthType.BEARER,
    })
    expect(sanitised.Authorization).toEqual(`Bearer ${SecretTag.BEARER}`)
  })

  it("should replace an OAuth2 token", () => {
    const sanitised = sanitiseHeaders({
      headers: { Authorization: "Bearer oauthtoken" },
      authHeaderKeys: ["Authorization"],
      authType: RestAuthType.OAUTH2,
    })
    expect(sanitised.Authorization).toEqual(`Bearer ${SecretTag.OAUTH2}`)
  })

  it("should replace sensitive headers which did not come from an auth config", () => {
    const sanitised = sanitiseHeaders({
      headers: {
        Authorization: "Bearer handrolled",
        Cookie: "session=abc123",
        "x-api-key": "keyvalue",
      },
    })
    expect(sanitised).toEqual({
      Authorization: `Bearer ${SecretTag.GENERIC}`,
      Cookie: SecretTag.GENERIC,
      "x-api-key": SecretTag.GENERIC,
    })
  })

  it("should match sensitive header names regardless of casing", () => {
    const sanitised = sanitiseHeaders({
      headers: { AUTHORIZATION: "Bearer handrolled" },
    })
    expect(sanitised.AUTHORIZATION).toEqual(`Bearer ${SecretTag.GENERIC}`)
  })

  it("should fully redact a spaced credential which is not a known scheme", () => {
    const sanitised = sanitiseHeaders({
      headers: { "x-api-key": "part1 part2" },
    })
    expect(sanitised["x-api-key"]).toEqual(SecretTag.GENERIC)
  })

  it("should coerce non-string header values", () => {
    const sanitised = sanitiseHeaders({
      headers: { "x-request-id": 123, "x-api-key": 456 },
    })
    expect(sanitised).toEqual({
      "x-request-id": "123",
      "x-api-key": SecretTag.GENERIC,
    })
  })

  it("should leave ordinary headers untouched", () => {
    const sanitised = sanitiseHeaders({
      headers: { Accept: "application/json", "x-request-id": "abc" },
    })
    expect(sanitised).toEqual({
      Accept: "application/json",
      "x-request-id": "abc",
    })
  })

  it("should handle a Headers instance", () => {
    const sanitised = sanitiseHeaders({
      headers: new UndiciHeaders({
        accept: "application/json",
        authorization: "Bearer mytoken",
      }),
      authHeaderKeys: ["Authorization"],
      authType: RestAuthType.BEARER,
    })
    expect(sanitised).toEqual({
      accept: "application/json",
      authorization: `Bearer ${SecretTag.BEARER}`,
    })
  })
})

describe("sanitiseBody", () => {
  it("should parse a JSON body rather than showing an escaped string", () => {
    expect(sanitiseBody(`{"foo":"bar"}`)).toEqual({ foo: "bar" })
  })

  it("should leave a non JSON string body as it was sent", () => {
    expect(sanitiseBody("plain text body")).toEqual("plain text body")
  })

  it("should not treat a bare JSON primitive as parsed content", () => {
    expect(sanitiseBody("1234")).toEqual("1234")
  })

  it("should convert url encoded params to an object", () => {
    expect(sanitiseBody(new URLSearchParams({ foo: "bar" }))).toEqual({
      foo: "bar",
    })
  })

  it("should convert form data to an object", () => {
    const form = new FormData()
    form.append("foo", "bar")
    expect(sanitiseBody(form)).toEqual({ foo: "bar" })
  })

  it("should return undefined when there is no body", () => {
    expect(sanitiseBody(undefined)).toBeUndefined()
  })
})
