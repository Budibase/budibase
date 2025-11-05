jest.mock("undici", () => {
  const actual = jest.requireActual<typeof import("undici")>("undici")
  return {
    ...actual,
    fetch: jest.fn((...args: any[]) => (actual.fetch as any)(...args)),
    __actualFetch: actual.fetch,
  }
})

jest.mock("../../sdk/workspace/oauth2", () => {
  const actual = jest.requireActual("../../sdk/workspace/oauth2")
  return {
    ...actual,
    getToken: jest.fn(),
    cleanStoredToken: jest.fn(),
  }
})

import { generator } from "@budibase/backend-core/tests"
import {
  BasicRestAuthConfig,
  BearerRestAuthConfig,
  BodyType,
  OAuth2CredentialsMethod,
  OAuth2GrantType,
  RestAuthType,
} from "@budibase/types"
import { createServer } from "http"
import { AddressInfo } from "net"
import * as undici from "undici"
import {
  RequestInit as UndiciRequestInit,
  Response as UndiciResponse,
  FormData as UndiciFormData,
} from "undici"
import TestConfiguration from "../../../src/tests/utilities/TestConfiguration"
import sdk from "../../sdk"
import { RestIntegration } from "../rest"

const UUID_REGEX =
  "[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}"
const HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
}
const { Response } = undici
const realFetch = (undici as any).__actualFetch as typeof undici.fetch
const fetchMock = undici.fetch as jest.MockedFunction<typeof realFetch>

const getFormDataBuffer = (body: any): string | undefined => {
  if (!body) {
    return undefined
  }

  const candidate = body.getBuffer
  if (typeof candidate === "function") {
    try {
      const result = candidate.call(body)
      if (typeof result === "string") {
        return result
      }
      if (Buffer.isBuffer(result)) {
        return result.toString("utf8")
      }
      if (ArrayBuffer.isView(result)) {
        return Buffer.from(
          result.buffer,
          result.byteOffset,
          result.byteLength
        ).toString("utf8")
      }
    } catch (_err) {
      // fall through to other strategies
    }
  }

  return undefined
}

const extractFormEntries = (body: any): Record<string, string> | undefined => {
  if (!body) {
    return undefined
  }

  if (typeof body.entries === "function") {
    const result: Record<string, string> = {}
    for (const [key, value] of body.entries()) {
      result[String(key)] = String(value ?? "")
    }
    return result
  }

  if (typeof body.forEach === "function") {
    const result: Record<string, string> = {}
    body.forEach((value: unknown, key: string) => {
      result[key] = String(value ?? "")
    })
    return result
  }

  return undefined
}

const expectFormDataToMatch = (
  body: unknown,
  expected: Record<string, string>
) => {
  const entries = extractFormEntries(body)
  if (entries) {
    expect(entries).toMatchObject(expected)
    return
  }

  const payload = getFormDataBuffer(body)
  expect(payload).toBeDefined()
  for (const [key, value] of Object.entries(expected)) {
    expect(payload).toContain(`name="${key}"`)
    expect(payload).toContain(String(value))
  }
}

describe("REST Integration", () => {
  let integration: RestIntegration
  const pendingFetches: Array<
    (url: string, init?: UndiciRequestInit) => Promise<UndiciResponse>
  > = []

  const queueResponse = (
    handler: (url: string, init?: UndiciRequestInit) => Promise<UndiciResponse>
  ) => {
    pendingFetches.push(handler)
  }

  const queueJsonResponse = (
    assertFn: (url: string, init?: UndiciRequestInit) => void,
    body: any,
    status = 200,
    headers: Record<string, string> = {}
  ) => {
    queueResponse(async (url, options) => {
      assertFn(url, options)
      return new Response(JSON.stringify(body), {
        status,
        headers: { "content-type": "application/json", ...headers },
      })
    })
  }
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
  })

  afterAll(async () => {
    config.end()
  })

  beforeEach(() => {
    pendingFetches.length = 0
    fetchMock.mockImplementation((url, init?: UndiciRequestInit) => {
      const urlString = typeof url === "string" ? url : String(url)
      if (pendingFetches.length) {
        return pendingFetches.shift()!(urlString, init)
      }
      if (urlString.startsWith("https://example.com")) {
        throw new Error(`Unexpected fetch call to ${urlString}`)
      }
      return realFetch(
        url as Parameters<typeof realFetch>[0],
        init as Parameters<typeof realFetch>[1]
      )
    })
    integration = new RestIntegration({ url: "https://example.com" })
  })

  afterEach(() => {
    fetchMock.mockReset()
  })

  it("calls the create method with the correct params", async () => {
    const body = { name: "test" }
    queueResponse(async (url, options) => {
      expect(url).toEqual("https://example.com/api?test=1")
      expect(options?.method).toEqual("POST")
      expect(options?.headers).toMatchObject(HEADERS)
      expect(options?.body).toEqual(JSON.stringify(body))
      return new Response(JSON.stringify({ foo: "bar" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      })
    })

    const { data } = await integration.create({
      path: "api",
      queryString: "test=1",
      headers: HEADERS,
      bodyType: BodyType.JSON,
      requestBody: JSON.stringify(body),
    })
    expect(data).toEqual({ foo: "bar" })
  })

  it("calls the read method with the correct params", async () => {
    queueResponse(async (url, options) => {
      expect(url).toEqual("https://example.com/api?test=1")
      expect(options?.method).toEqual("GET")
      expect(options?.headers).toMatchObject({ Accept: "text/html" })
      return new Response(JSON.stringify({ foo: "bar" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      })
    })

    const { data } = await integration.read({
      path: "api",
      queryString: "test=1",
      headers: {
        Accept: "text/html",
      },
    })
    expect(data).toEqual({ foo: "bar" })
  })

  it("calls the update method with the correct params", async () => {
    queueResponse(async (url, options) => {
      expect(url).toEqual("https://example.com/api?test=1")
      expect(options?.method).toEqual("PUT")
      expect(options?.headers).toMatchObject({
        Accept: "application/json",
      })
      expect(options?.body).toEqual(JSON.stringify({ name: "test" }))
      return new Response(JSON.stringify({ foo: "bar" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      })
    })

    const { data } = await integration.update({
      path: "api",
      queryString: "test=1",
      headers: {
        Accept: "application/json",
      },
      bodyType: BodyType.JSON,
      requestBody: JSON.stringify({
        name: "test",
      }),
    })
    expect(data).toEqual({ foo: "bar" })
  })

  it("calls the delete method with the correct params", async () => {
    queueResponse(async (url, options) => {
      expect(url).toEqual("https://example.com/api?test=1")
      expect(options?.method).toEqual("DELETE")
      expect(options?.headers).toMatchObject({
        Accept: "application/json",
      })
      expect(options?.body).toEqual(JSON.stringify({ name: "test" }))
      return new Response(JSON.stringify({ foo: "bar" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      })
    })

    const { data } = await integration.delete({
      path: "api",
      queryString: "test=1",
      headers: {
        Accept: "application/json",
      },
      bodyType: BodyType.JSON,
      requestBody: JSON.stringify({
        name: "test",
      }),
    })
    expect(data).toEqual({ foo: "bar" })
  })

  describe("request body", () => {
    const input = { a: 1, b: 2 }

    it("should allow no body", () => {
      const output = integration.addBody("none", null, {})
      expect(output.body).toBeUndefined()
      expect(Object.keys(output.headers!).length).toEqual(0)
    })

    it("should allow text body", () => {
      const output = integration.addBody("text", "hello world", {})
      expect(output.body).toEqual("hello world")
      // gets added by fetch
      expect(Object.keys(output.headers!).length).toEqual(0)
    })

    it("should allow form data", () => {
      const output = integration.addBody("form", input, {})
      const body: any = output.body
      expect(body).toBeDefined()
      expectFormDataToMatch(body, { a: "1", b: "2" })
    })

    it("should correctly clean conflicting Content-Type header for form data", async () => {
      const input = { payload: "data", count: 42 }

      queueJsonResponse(
        (url, options) => {
          expect(url).toEqual("https://example.com/api/submit")
          expect(options?.method).toEqual("POST")
          expect(options?.body).toBeInstanceOf(UndiciFormData)

          const headers = options?.headers as Record<string, any>
          const contentTypeHeader =
            headers["Content-Type"] || headers["content-type"]
          // The original Content-Type inserted in the test data below should be stripped so that
          // undici can automatically insert the correct multipart/form-data header with boundary
          expect(contentTypeHeader).toBeUndefined()
        },
        { success: true }
      )

      const { data } = await integration.create({
        path: "api/submit",
        bodyType: BodyType.FORM_DATA,
        requestBody: input,
        // Injects a conflicting header that the production code MUST delete
        headers: {
          "Content-Type": "application/json",
          "X-Custom-Header": "KeepMe",
        },
      })

      // Assert that the non-Content-Type header was kept
      const lastFetchOptions = fetchMock.mock.calls[0][1]
      expect((lastFetchOptions!.headers! as any)["X-Custom-Header"]).toEqual(
        "KeepMe"
      )
      expect(
        (lastFetchOptions!.headers! as any)["Content-Type"]
      ).toBeUndefined()

      expect(data).toEqual({ success: true })
    })

    it("should allow encoded form data", () => {
      const { URLSearchParams } = require("url")
      const output = integration.addBody("encoded", input, {})
      expect(output.body instanceof URLSearchParams).toEqual(true)
      expect(output.body!.toString()).toEqual("a=1&b=2")
      // gets added by fetch
      expect(Object.keys(output.headers!).length).toEqual(0)
    })

    it("should allow JSON", () => {
      const output = integration.addBody("json", input, {})
      expect(output.body).toEqual(JSON.stringify(input))
      expect((output.headers! as any)["Content-Type"]).toEqual(
        "application/json"
      )
    })

    it("should allow raw XML", () => {
      const output = integration.addBody("xml", "<a>1</a><b>2</b>", {})
      const body = output.body?.toString()
      expect(body!.includes("<a>1</a>")).toEqual(true)
      expect(body!.includes("<b>2</b>")).toEqual(true)
      expect((output.headers! as any)["Content-Type"]).toEqual(
        "application/xml"
      )
    })

    it("should allow a valid js object and parse the contents to xml", () => {
      const output = integration.addBody("xml", input, {})
      const body = output.body?.toString()
      expect(body!.includes("<a>1</a>")).toEqual(true)
      expect(body!.includes("<b>2</b>")).toEqual(true)
      expect((output.headers! as any)["Content-Type"]).toEqual(
        "application/xml"
      )
    })

    it("should allow a valid json string and parse the contents to xml", () => {
      const output = integration.addBody("xml", JSON.stringify(input), {})
      const body = output.body?.toString()
      expect(body!.includes("<a>1</a>")).toEqual(true)
      expect(body!.includes("<b>2</b>")).toEqual(true)
      expect((output.headers! as any)["Content-Type"]).toEqual(
        "application/xml"
      )
    })
  })

  describe("response", () => {
    it("should be able to parse JSON response", async () => {
      const obj = { a: 1 }
      const output = await integration.parseResponse(
        new Response(JSON.stringify(obj), {
          headers: { "content-type": "application/json" },
        })
      )
      expect(output.data).toEqual(obj)
      expect(output.info.code).toEqual(200)
      expect(output.info.size).toEqual("7B")
    })

    it("should be able to parse text response", async () => {
      const text = "hello world"
      const output = await integration.parseResponse(
        new Response(text, {
          headers: { "content-type": "text/plain" },
        })
      )
      expect(output.data).toEqual(text)
    })

    it("should be able to parse XML response", async () => {
      const text = "<root><a>1</a><b>2</b></root>"
      const output = await integration.parseResponse(
        new Response(text, {
          headers: { "content-type": "application/xml" },
        })
      )
      expect(output.data).toEqual({ a: "1", b: "2" })
    })

    test.each(["application/json", "text/plain", "application/xml", undefined])(
      "should not throw an error on 204 no content for content type: %s",
      async contentType => {
        const output = await integration.parseResponse(
          new Response(undefined, {
            headers: { "content-type": contentType! },
            status: 204,
          })
        )
        expect(output.data).toEqual([])
        expect(output.info.code).toEqual(204)
      }
    )
  })

  describe("authentication", () => {
    const getTokenMock = sdk.oauth2.getToken as jest.MockedFunction<
      typeof sdk.oauth2.getToken
    >
    const cleanStoredTokenMock = sdk.oauth2
      .cleanStoredToken as jest.MockedFunction<
      typeof sdk.oauth2.cleanStoredToken
    >
    const basicAuth: BasicRestAuthConfig = {
      _id: "c59c14bd1898a43baa08da68959b24686",
      name: "basic-1",
      type: RestAuthType.BASIC,
      config: {
        username: "user",
        password: "password",
      },
    }

    const bearerAuth: BearerRestAuthConfig = {
      _id: "0d91d732f34e4befabeff50b392a8ff3",
      name: "bearer-1",
      type: RestAuthType.BEARER,
      config: {
        token: "mytoken",
      },
    }

    beforeEach(() => {
      getTokenMock.mockReset()
      cleanStoredTokenMock.mockReset()
      getTokenMock.mockRejectedValue(
        new Error("Unexpected oauth2.getToken call")
      )
      cleanStoredTokenMock.mockResolvedValue(undefined)
      integration = new RestIntegration({
        url: "https://example.com",
        authConfigs: [basicAuth, bearerAuth],
      })
    })

    afterEach(() => {
      getTokenMock.mockReset()
      cleanStoredTokenMock.mockReset()
    })

    it("adds basic auth", async () => {
      const auth = `Basic ${Buffer.from("user:password").toString("base64")}`
      queueResponse(async (url, options) => {
        expect(url).toEqual("https://example.com/")
        expect(options?.headers).toMatchObject({ Authorization: auth })
        return new Response(JSON.stringify({ foo: "bar" }), {
          status: 200,
          headers: { "content-type": "application/json" },
        })
      })

      const { data } = await integration.read({ authConfigId: basicAuth._id })
      expect(data).toEqual({ foo: "bar" })
    })

    it("adds bearer auth", async () => {
      queueResponse(async (url, options) => {
        expect(url).toEqual("https://example.com/")
        expect(options?.headers).toMatchObject({
          Authorization: "Bearer mytoken",
        })
        return new Response(JSON.stringify({ foo: "bar" }), {
          status: 200,
          headers: { "content-type": "application/json" },
        })
      })
      const { data } = await integration.read({ authConfigId: bearerAuth._id })
      expect(data).toEqual({ foo: "bar" })
    })

    it("adds OAuth2 auth (via header)", async () => {
      const oauth2Url = generator.url()
      const secret = generator.hash()
      const { config: oauthConfig } = await config.api.oauth2.create({
        name: generator.guid(),
        url: oauth2Url,
        clientId: generator.guid(),
        clientSecret: secret,
        method: OAuth2CredentialsMethod.HEADER,
        grantType: OAuth2GrantType.CLIENT_CREDENTIALS,
      })

      const token = `Bearer ${generator.guid()}`
      getTokenMock.mockResolvedValueOnce(token)
      queueResponse(async (url, options) => {
        expect(url).toEqual("https://example.com/")
        expect(options?.headers).toMatchObject({ Authorization: token })
        return new Response(JSON.stringify({ foo: "bar" }), {
          status: 200,
          headers: { "content-type": "application/json" },
        })
      })

      const { data, info } = await config.doInContext(
        config.devWorkspaceId,
        async () =>
          await integration.read({
            authConfigId: oauthConfig._id,
            authConfigType: RestAuthType.OAUTH2,
          })
      )
      expect(data).toEqual({ foo: "bar" })
      expect(info.code).toEqual(200)
      expect(getTokenMock).toHaveBeenCalledWith(oauthConfig._id)
    })

    it("adds OAuth2 auth (via body)", async () => {
      const oauth2Url = generator.url()
      const secret = generator.hash()
      const { config: oauthConfig } = await config.api.oauth2.create({
        name: generator.guid(),
        url: oauth2Url,
        clientId: generator.guid(),
        clientSecret: secret,
        method: OAuth2CredentialsMethod.BODY,
        grantType: OAuth2GrantType.CLIENT_CREDENTIALS,
      })

      const token = `Bearer ${generator.guid()}`
      getTokenMock.mockResolvedValueOnce(token)
      queueResponse(async (url, options) => {
        expect(url).toEqual("https://example.com/")
        expect(options?.headers).toMatchObject({ Authorization: token })
        return new Response(JSON.stringify({ foo: "bar" }), {
          status: 200,
          headers: { "content-type": "application/json" },
        })
      })

      const { data, info } = await config.doInContext(
        config.devWorkspaceId,
        async () =>
          await integration.read({
            authConfigId: oauthConfig._id,
            authConfigType: RestAuthType.OAUTH2,
          })
      )
      expect(data).toEqual({ foo: "bar" })
      expect(info.code).toEqual(200)
      expect(getTokenMock).toHaveBeenCalledWith(oauthConfig._id)
    })

    it("handles OAuth2 auth cached expired token", async () => {
      const oauth2Url = generator.url()
      const secret = generator.hash()
      const { config: oauthConfig } = await config.api.oauth2.create({
        name: generator.guid(),
        url: oauth2Url,
        clientId: generator.guid(),
        clientSecret: secret,
        method: OAuth2CredentialsMethod.HEADER,
        grantType: OAuth2GrantType.CLIENT_CREDENTIALS,
      })

      const token1 = `Bearer ${generator.guid()}`
      const token2 = `Bearer ${generator.guid()}`
      getTokenMock.mockResolvedValueOnce(token1).mockResolvedValueOnce(token2)
      queueResponse(async (url, options) => {
        expect(url).toEqual("https://example.com/")
        expect(options?.headers).toMatchObject({ Authorization: token1 })
        return new Response(JSON.stringify({}), {
          status: 401,
          headers: { "content-type": "application/json" },
        })
      })
      queueResponse(async (url, options) => {
        expect(url).toEqual("https://example.com/")
        expect(options?.headers).toMatchObject({ Authorization: token2 })
        return new Response(JSON.stringify({ foo: "bar" }), {
          status: 200,
          headers: { "content-type": "application/json" },
        })
      })

      const { data, info } = await config.doInContext(
        config.devWorkspaceId,
        async () =>
          await integration.read({
            authConfigId: oauthConfig._id,
            authConfigType: RestAuthType.OAUTH2,
          })
      )

      expect(data).toEqual({ foo: "bar" })
      expect(info.code).toEqual(200)
      expect(cleanStoredTokenMock).toHaveBeenCalledTimes(1)
      expect(cleanStoredTokenMock).toHaveBeenCalledWith(oauthConfig._id)
      expect(getTokenMock).toHaveBeenCalledTimes(2)
    })

    it("does not loop when handling OAuth2 auth cached expired token", async () => {
      const oauth2Url = generator.url()
      const secret = generator.hash()
      const { config: oauthConfig } = await config.api.oauth2.create({
        name: generator.guid(),
        url: oauth2Url,
        clientId: generator.guid(),
        clientSecret: secret,
        method: OAuth2CredentialsMethod.HEADER,
        grantType: OAuth2GrantType.CLIENT_CREDENTIALS,
      })

      const token1 = `Bearer ${generator.guid()}`
      const token2 = `Bearer ${generator.guid()}`
      getTokenMock.mockResolvedValueOnce(token1).mockResolvedValueOnce(token2)
      queueResponse(async (url, options) => {
        expect(url).toEqual("https://example.com/")
        expect(options?.headers).toMatchObject({ Authorization: token1 })
        return new Response(JSON.stringify({}), {
          status: 401,
          headers: { "content-type": "application/json" },
        })
      })
      queueResponse(async (url, options) => {
        expect(url).toEqual("https://example.com/")
        expect(options?.headers).toMatchObject({ Authorization: token2 })
        return new Response(JSON.stringify({}), {
          status: 401,
          headers: { "content-type": "application/json" },
        })
      })

      const { data, info } = await config.doInContext(
        config.devWorkspaceId,
        async () =>
          await integration.read({
            authConfigId: oauthConfig._id,
            authConfigType: RestAuthType.OAUTH2,
          })
      )

      expect(info.code).toEqual(401)
      expect(data).toEqual({})
      expect(cleanStoredTokenMock).toHaveBeenCalledTimes(1)
      expect(cleanStoredTokenMock).toHaveBeenCalledWith(oauthConfig._id)
      expect(getTokenMock).toHaveBeenCalledTimes(2)
    })
  })

  describe("page based pagination", () => {
    it("can paginate using query params", async () => {
      queueJsonResponse(
        (url, options) => {
          expect(url).toEqual("https://example.com/api?page=3&size=10")
          expect(options?.method).toEqual("GET")
        },
        { foo: "bar" }
      )
      const { data } = await integration.read({
        path: "api",
        pagination: {
          type: "page",
          location: "query",
          pageParam: "page",
          sizeParam: "size",
        },
        paginationValues: { page: 3, limit: 10 },
      })
      expect(data).toEqual({ foo: "bar" })
    })

    it("can paginate using JSON request body", async () => {
      queueJsonResponse(
        (url, options) => {
          expect(url).toEqual("https://example.com/api")
          expect(options?.method).toEqual("POST")
          expect(options?.body).toEqual(JSON.stringify({ page: 3, size: 10 }))
        },
        { foo: "bar" }
      )
      const { data } = await integration.create({
        bodyType: BodyType.JSON,
        path: "api",
        pagination: {
          type: "page",
          location: "body",
          pageParam: "page",
          sizeParam: "size",
        },
        paginationValues: { page: 3, limit: 10 },
      })
      expect(data).toEqual({ foo: "bar" })
    })

    it("can paginate using form-data request body", async () => {
      queueJsonResponse(
        (url, options) => {
          expect(url).toEqual("https://example.com/api")
          expect(options?.method).toEqual("POST")
          expectFormDataToMatch(options?.body, { page: "3", size: "10" })
        },
        { foo: "bar" }
      )

      const { data } = await integration.create({
        bodyType: BodyType.FORM_DATA,
        path: "api",
        pagination: {
          type: "page",
          location: "body",
          pageParam: "page",
          sizeParam: "size",
        },
        paginationValues: { page: 3, limit: 10 },
      })
      expect(data).toEqual({ foo: "bar" })
    })

    it("can paginate using form-encoded request body", async () => {
      queueJsonResponse(
        (url, options) => {
          expect(url).toEqual("https://example.com/api")
          expect(options?.method).toEqual("POST")
          expect(options?.body?.toString()).toEqual("page=3&size=10")
        },
        { foo: "bar" }
      )

      const { data } = await integration.create({
        bodyType: BodyType.ENCODED,
        path: "api",
        pagination: {
          type: "page",
          location: "body",
          pageParam: "page",
          sizeParam: "size",
        },
        paginationValues: { page: 3, limit: 10 },
      })
      expect(data).toEqual({ foo: "bar" })
    })
  })

  describe("cursor based pagination", () => {
    it("can paginate using query params", async () => {
      queueJsonResponse(
        (url, options) => {
          expect(url).toEqual("https://example.com/api?page=3&size=10")
          expect(options?.method).toEqual("GET")
        },
        { cursor: 123, foo: "bar" }
      )
      const { data, pagination } = await integration.read({
        path: "api",
        pagination: {
          type: "cursor",
          location: "query",
          pageParam: "page",
          sizeParam: "size",
          responseParam: "cursor",
        },
        paginationValues: { page: 3, limit: 10 },
      })
      expect(pagination?.cursor).toEqual(123)
      expect(data).toEqual({ cursor: 123, foo: "bar" })
    })

    it("can paginate using JSON request body", async () => {
      queueJsonResponse(
        (url, options) => {
          expect(url).toEqual("https://example.com/api")
          expect(options?.method).toEqual("POST")
          expect(options?.body).toEqual(JSON.stringify({ page: 3, size: 10 }))
        },
        { cursor: 123, foo: "bar" }
      )
      const { data, pagination } = await integration.create({
        bodyType: BodyType.JSON,
        path: "api",
        pagination: {
          type: "page",
          location: "body",
          pageParam: "page",
          sizeParam: "size",
          responseParam: "cursor",
        },
        paginationValues: { page: 3, limit: 10 },
      })
      expect(data).toEqual({ cursor: 123, foo: "bar" })
      expect(pagination?.cursor).toEqual(123)
    })

    it("can paginate using form-data request body", async () => {
      queueJsonResponse(
        (url, options) => {
          expect(url).toEqual("https://example.com/api")
          expect(options?.method).toEqual("POST")
          expectFormDataToMatch(options?.body, { page: "3", size: "10" })
        },
        { cursor: 123, foo: "bar" }
      )
      const { data, pagination } = await integration.create({
        bodyType: BodyType.FORM_DATA,
        path: "api",
        pagination: {
          type: "page",
          location: "body",
          pageParam: "page",
          sizeParam: "size",
          responseParam: "cursor",
        },
        paginationValues: { page: 3, limit: 10 },
      })
      expect(data).toEqual({ cursor: 123, foo: "bar" })
      expect(pagination?.cursor).toEqual(123)
    })

    it("can paginate using form-encoded request body", async () => {
      queueJsonResponse(
        (url, options) => {
          expect(url).toEqual("https://example.com/api")
          expect(options?.method).toEqual("POST")
          expect(options?.body?.toString()).toEqual("page=3&size=10")
        },
        { cursor: 123, foo: "bar" }
      )
      const { data, pagination } = await integration.create({
        bodyType: BodyType.ENCODED,
        path: "api",
        pagination: {
          type: "page",
          location: "body",
          pageParam: "page",
          sizeParam: "size",
          responseParam: "cursor",
        },
        paginationValues: { page: 3, limit: 10 },
      })
      expect(data).toEqual({ cursor: 123, foo: "bar" })
      expect(pagination?.cursor).toEqual(123)
    })

    it("should encode query string correctly", async () => {
      queueJsonResponse(
        (url, options) => {
          expect(url).toEqual("https://example.com/api?test=1%202")
          expect(options?.method).toEqual("POST")
          expect(options?.headers).toMatchObject(HEADERS)
          expect(options?.body).toEqual(JSON.stringify({ name: "test" }))
        },
        { foo: "bar" }
      )
      const { data } = await integration.create({
        path: "api",
        queryString: "test=1 2",
        headers: HEADERS,
        bodyType: BodyType.JSON,
        requestBody: JSON.stringify({
          name: "test",
        }),
      })
      expect(data).toEqual({ foo: "bar" })
    })

    it("should remove empty query parameters", async () => {
      queueJsonResponse(
        (url, options) => {
          expect(url).toEqual(
            "https://example.com/api?param2=value&param3=another"
          )
          expect(options?.method).toEqual("GET")
        },
        { success: true }
      )

      const { data } = await integration.read({
        path: "api",
        queryString: "param1=&param2=value&param3=another",
      })
      expect(data).toEqual({ success: true })
    })

    it("should handle query string with only empty parameters", async () => {
      queueJsonResponse(
        (url, options) => {
          expect(url).toEqual("https://example.com/api")
          expect(options?.method).toEqual("GET")
        },
        { success: true }
      )

      const { data } = await integration.read({
        path: "api",
        queryString: "param1=&param2=",
      })
      expect(data).toEqual({ success: true })
    })

    it("should handle mixed empty and valid parameters", async () => {
      queueJsonResponse(
        (url, options) => {
          expect(url).toEqual("https://example.com/api?valid=test&another=123")
          expect(options?.method).toEqual("GET")
        },
        { success: true }
      )

      const { data } = await integration.read({
        path: "api",
        queryString: "empty1=&valid=test&empty2=&another=123&empty3=",
      })
      expect(data).toEqual({ success: true })
    })
  })

  describe("Configuration options", () => {
    // NOTE(samwho): it seems like this code doesn't actually work because it requires
    // node-fetch >=3, and we're not on that because upgrading to it produces errors to
    // do with ESM that are above my pay grade.
    it.skip("doesn't fail when legacyHttpParser is set", async () => {
      const server = createServer((req, res) => {
        res.writeHead(200, {
          "Transfer-Encoding": "chunked",
          "Content-Length": "10",
        })
        res.end(JSON.stringify({ foo: "bar" }))
      })

      server.listen()
      await new Promise(resolve => server.once("listening", resolve))

      const address = server.address() as AddressInfo

      const integration = new RestIntegration({
        url: `http://localhost:${address.port}`,
        legacyHttpParser: true,
      })
      const { data } = await integration.read({})
      expect(data).toEqual({ foo: "bar" })
    })

    it("doesn't fail when legacyHttpParser is true", async () => {
      queueJsonResponse(
        (url, options) => {
          expect(url).toEqual("https://example.com/")
          expect(options?.method).toEqual("GET")
          expect((options as any)?.extraHttpOptions).toEqual({
            insecureHTTPParser: true,
          })
        },
        { foo: "bar" }
      )
      const integration = new RestIntegration({
        url: "https://example.com",
        legacyHttpParser: true,
      })
      const { data } = await integration.read({})
      expect(data).toEqual({ foo: "bar" })
    })

    it("doesn't fail when rejectUnauthorized is false", async () => {
      queueJsonResponse(
        (url, options) => {
          expect(url).toEqual("https://example.com/")
          expect(options?.method).toEqual("GET")
          const dispatcher = options?.dispatcher
          expect(dispatcher).toBeInstanceOf(undici.Agent)
        },
        { foo: "bar" }
      )
      const integration = new RestIntegration({
        url: "https://example.com",
        rejectUnauthorized: false,
      })
      const { data } = await integration.read({})
      expect(data).toEqual({ foo: "bar" })
    })
  })

  describe("File Handling", () => {
    it("uploads file to object store and returns signed URL", async () => {
      await config.doInContext(config.getDevWorkspaceId(), async () => {
        const content = "test file content"
        queueResponse(async (url, options) => {
          expect(url).toEqual("https://example.com/api")
          expect(options?.method).toEqual("GET")
          return new Response(content, {
            status: 200,
            headers: {
              "content-disposition": `attachment; filename="testfile.tar.gz"`,
              "content-type": "text/plain",
              "content-length": `${content.length}`,
            },
          })
        })

        const { data } = await integration.read({ path: "api" })
        expect(data).toEqual({
          size: content.length,
          name: expect.stringMatching(new RegExp(`^${UUID_REGEX}.tar.gz$`)),
          url: expect.stringMatching(
            new RegExp(
              `^/files/signed/tmp-file-attachments/app.*?/${UUID_REGEX}.tar.gz.*$`
            )
          ),
          extension: "tar.gz",
          key: expect.stringMatching(
            new RegExp(`^app.*?/${UUID_REGEX}.tar.gz$`)
          ),
        })
      })
    })

    it("uploads file with non ascii filename to object store and returns signed URL", async () => {
      await config.doInContext(config.getDevWorkspaceId(), async () => {
        const content = "test file content"
        queueResponse(async (url, options) => {
          expect(url).toEqual("https://example.com/api")
          expect(options?.method).toEqual("GET")
          return new Response(content, {
            status: 200,
            headers: {
              // eslint-disable-next-line no-useless-escape
              "content-disposition": `attachment; filename="£ and ? rates.pdf"; filename*=UTF-8'\'%C2%A3%20and%20%E2%82%AC%20rates.pdf`,
              "content-type": "text/plain",
              "content-length": `${content.length}`,
            },
          })
        })

        const { data } = await integration.read({ path: "api" })
        expect(data).toEqual({
          size: content.length,
          name: expect.stringMatching(new RegExp(`^${UUID_REGEX}.pdf$`)),
          url: expect.stringMatching(
            new RegExp(
              `^/files/signed/tmp-file-attachments/app.*?/${UUID_REGEX}.pdf.*$`
            )
          ),
          extension: "pdf",
          key: expect.stringMatching(new RegExp(`^app.*?/${UUID_REGEX}.pdf$`)),
        })
      })
    })
  })
})
