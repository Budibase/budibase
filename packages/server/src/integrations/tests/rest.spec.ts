import nock from "nock"
import { RestIntegration } from "../rest"
import { BodyType, RestAuthType } from "@budibase/types"
import { Response } from "node-fetch"
import TestConfiguration from "../../../src/tests/utilities/TestConfiguration"
import { createServer } from "http"
import { AddressInfo } from "net"

const UUID_REGEX =
  "[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}"
const HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
}

describe("REST Integration", () => {
  let integration: RestIntegration
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
  })

  afterAll(async () => {
    config.end()
  })

  beforeEach(() => {
    integration = new RestIntegration({ url: "https://example.com" })
    nock.cleanAll()
  })

  it("calls the create method with the correct params", async () => {
    const body = { name: "test" }
    nock("https://example.com", { reqheaders: HEADERS })
      .post("/api?test=1", JSON.stringify(body))
      .reply(200, { foo: "bar" })

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
    nock("https://example.com")
      .get("/api?test=1")
      .matchHeader("Accept", "text/html")
      .reply(200, { foo: "bar" })

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
    nock("https://example.com")
      .put("/api?test=1", { name: "test" })
      .matchHeader("Accept", "application/json")
      .reply(200, { foo: "bar" })

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
    nock("https://example.com")
      .delete("/api?test=1", { name: "test" })
      .matchHeader("Accept", "application/json")
      .reply(200, { foo: "bar" })

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
      const FormData = require("form-data")
      const output = integration.addBody("form", input, {})
      expect(output.body instanceof FormData).toEqual(true)
      expect((output.body! as any)._valueLength).toEqual(2)
      // gets added by fetch
      expect(Object.keys(output.headers!).length).toEqual(0)
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
    const basicAuth = {
      _id: "c59c14bd1898a43baa08da68959b24686",
      name: "basic-1",
      type: RestAuthType.BASIC,
      config: {
        username: "user",
        password: "password",
      },
    }

    const bearerAuth = {
      _id: "0d91d732f34e4befabeff50b392a8ff3",
      name: "bearer-1",
      type: RestAuthType.BEARER,
      config: {
        token: "mytoken",
      },
    }

    beforeEach(() => {
      integration = new RestIntegration({
        url: "https://example.com",
        authConfigs: [basicAuth, bearerAuth],
      })
    })

    it("adds basic auth", async () => {
      const auth = `Basic ${Buffer.from("user:password").toString("base64")}`
      nock("https://example.com", { reqheaders: { Authorization: auth } })
        .get("/")
        .reply(200, { foo: "bar" })

      const { data } = await integration.read({ authConfigId: basicAuth._id })
      expect(data).toEqual({ foo: "bar" })
    })

    it("adds bearer auth", async () => {
      nock("https://example.com", {
        reqheaders: { Authorization: "Bearer mytoken" },
      })
        .get("/")
        .reply(200, { foo: "bar" })
      const { data } = await integration.read({ authConfigId: bearerAuth._id })
      expect(data).toEqual({ foo: "bar" })
    })
  })

  describe("page based pagination", () => {
    it("can paginate using query params", async () => {
      nock("https://example.com")
        .get("/api?page=3&size=10")
        .reply(200, { foo: "bar" })
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
      nock("https://example.com")
        .post("/api", JSON.stringify({ page: 3, size: 10 }))
        .reply(200, { foo: "bar" })
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
      nock("https://example.com")
        .post("/api", body => {
          return (
            body.includes(`name="page"\r\n\r\n3\r\n`) &&
            body.includes(`name="size"\r\n\r\n10\r\n`)
          )
        })
        .reply(200, { foo: "bar" })

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
      nock("https://example.com")
        .post("/api", { page: "3", size: "10" })
        .reply(200, { foo: "bar" })

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
      nock("https://example.com")
        .get("/api?page=3&size=10")
        .reply(200, { cursor: 123, foo: "bar" })
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
      nock("https://example.com")
        .post("/api", JSON.stringify({ page: 3, size: 10 }))
        .reply(200, { cursor: 123, foo: "bar" })
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
      nock("https://example.com")
        .post("/api", body => {
          return (
            body.includes(`name="page"\r\n\r\n3\r\n`) &&
            body.includes(`name="size"\r\n\r\n10\r\n`)
          )
        })
        .reply(200, { cursor: 123, foo: "bar" })
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
      nock("https://example.com")
        .post("/api", { page: "3", size: "10" })
        .reply(200, { cursor: 123, foo: "bar" })
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
      nock("https://example.com", { reqheaders: HEADERS })
        .post("/api?test=1%202", JSON.stringify({ name: "test" }))
        .reply(200, { foo: "bar" })
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
      nock("https://example.com").get("/").reply(200, { foo: "bar" })
      const integration = new RestIntegration({
        url: "https://example.com",
        legacyHttpParser: true,
      })
      const { data } = await integration.read({})
      expect(data).toEqual({ foo: "bar" })
    })

    it("doesn't fail when rejectUnauthorized is false", async () => {
      nock("https://example.com").get("/").reply(200, { foo: "bar" })
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
      await config.doInContext(config.getAppId(), async () => {
        const content = "test file content"
        nock("https://example.com").get("/api").reply(200, content, {
          "content-disposition": `attachment; filename="testfile.tar.gz"`,
          "content-type": "text/plain",
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
      await config.doInContext(config.getAppId(), async () => {
        const content = "test file content"
        nock("https://example.com").get("/api").reply(200, content, {
          // eslint-disable-next-line no-useless-escape
          "content-disposition": `attachment; filename="£ and ? rates.pdf"; filename*=UTF-8'\'%C2%A3%20and%20%E2%82%AC%20rates.pdf`,
          "content-type": "text/plain",
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
