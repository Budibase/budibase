jest.mock("node-fetch", () => {
  const obj = {
    my_next_cursor: 123,
  }
  const str = JSON.stringify(obj)
  return jest.fn(() => ({
    headers: {
      raw: () => {
        return {
          "content-type": ["application/json"],
          "content-length": str.length,
        }
      },
      get: (name: string) => {
        const lcName = name.toLowerCase()
        if (lcName === "content-type") {
          return ["application/json"]
        } else if (lcName === "content-length") {
          return str.length
        }
      },
    },
    json: jest.fn(() => obj),
    text: jest.fn(() => str),
  }))
})

jest.mock("@budibase/backend-core", () => {
  const core = jest.requireActual("@budibase/backend-core")
  return {
    ...core,
    context: {
      ...core.context,
      getProdAppId: jest.fn(() => "app-id"),
    },
  }
})
jest.mock("uuid", () => ({ v4: () => "00000000-0000-0000-0000-000000000000" }))

import { default as RestIntegration } from "../rest"
import { RestAuthType } from "@budibase/types"
import fetch from "node-fetch"
import { Readable } from "stream"

const FormData = require("form-data")
const { URLSearchParams } = require("url")

const HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
}

class TestConfiguration {
  integration: any

  constructor(config: any = {}) {
    this.integration = new RestIntegration.integration(config)
  }
}

describe("REST Integration", () => {
  const BASE_URL = "https://myapi.com"
  let config: any

  beforeEach(() => {
    config = new TestConfiguration({
      url: BASE_URL,
    })
    jest.clearAllMocks()
  })

  it("calls the create method with the correct params", async () => {
    const query = {
      path: "api",
      queryString: "test=1",
      headers: HEADERS,
      bodyType: "json",
      requestBody: JSON.stringify({
        name: "test",
      }),
    }
    await config.integration.create(query)
    expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api?test=1`, {
      method: "POST",
      body: '{"name":"test"}',
      headers: HEADERS,
    })
  })

  it("calls the read method with the correct params", async () => {
    const query = {
      path: "api",
      queryString: "test=1",
      headers: {
        Accept: "text/html",
      },
    }
    await config.integration.read(query)
    expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api?test=1`, {
      headers: {
        Accept: "text/html",
      },
      method: "GET",
    })
  })

  it("calls the update method with the correct params", async () => {
    const query = {
      path: "api",
      queryString: "test=1",
      headers: {
        Accept: "application/json",
      },
      bodyType: "json",
      requestBody: JSON.stringify({
        name: "test",
      }),
    }
    await config.integration.update(query)
    expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api?test=1`, {
      method: "PUT",
      body: '{"name":"test"}',
      headers: HEADERS,
    })
  })

  it("calls the delete method with the correct params", async () => {
    const query = {
      path: "api",
      queryString: "test=1",
      headers: {
        Accept: "application/json",
      },
      bodyType: "json",
      requestBody: JSON.stringify({
        name: "test",
      }),
    }
    await config.integration.delete(query)
    expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api?test=1`, {
      method: "DELETE",
      headers: HEADERS,
      body: '{"name":"test"}',
    })
  })

  describe("request body", () => {
    const input = { a: 1, b: 2 }

    it("should allow no body", () => {
      const output = config.integration.addBody("none", null, {})
      expect(output.body).toBeUndefined()
      expect(Object.keys(output.headers).length).toEqual(0)
    })

    it("should allow text body", () => {
      const output = config.integration.addBody("text", "hello world", {})
      expect(output.body).toEqual("hello world")
      // gets added by fetch
      expect(Object.keys(output.headers).length).toEqual(0)
    })

    it("should allow form data", () => {
      const FormData = require("form-data")
      const output = config.integration.addBody("form", input, {})
      expect(output.body instanceof FormData).toEqual(true)
      expect(output.body._valueLength).toEqual(2)
      // gets added by fetch
      expect(Object.keys(output.headers).length).toEqual(0)
    })

    it("should allow encoded form data", () => {
      const { URLSearchParams } = require("url")
      const output = config.integration.addBody("encoded", input, {})
      expect(output.body instanceof URLSearchParams).toEqual(true)
      expect(output.body.toString()).toEqual("a=1&b=2")
      // gets added by fetch
      expect(Object.keys(output.headers).length).toEqual(0)
    })

    it("should allow JSON", () => {
      const output = config.integration.addBody("json", input, {})
      expect(output.body).toEqual(JSON.stringify(input))
      expect(output.headers["Content-Type"]).toEqual("application/json")
    })

    it("should allow raw XML", () => {
      const output = config.integration.addBody("xml", "<a>1</a><b>2</b>", {})
      expect(output.body.includes("<a>1</a>")).toEqual(true)
      expect(output.body.includes("<b>2</b>")).toEqual(true)
      expect(output.headers["Content-Type"]).toEqual("application/xml")
    })

    it("should allow a valid js object and parse the contents to xml", () => {
      const output = config.integration.addBody("xml", input, {})
      expect(output.body.includes("<a>1</a>")).toEqual(true)
      expect(output.body.includes("<b>2</b>")).toEqual(true)
      expect(output.headers["Content-Type"]).toEqual("application/xml")
    })

    it("should allow a valid json string and parse the contents to xml", () => {
      const output = config.integration.addBody(
        "xml",
        JSON.stringify(input),
        {}
      )
      expect(output.body.includes("<a>1</a>")).toEqual(true)
      expect(output.body.includes("<b>2</b>")).toEqual(true)
      expect(output.headers["Content-Type"]).toEqual("application/xml")
    })
  })

  describe("response", () => {
    const contentTypes = ["application/json", "text/plain", "application/xml"]
    function buildInput(
      json: any,
      text: any,
      header: any,
      status: number = 200
    ) {
      return {
        status,
        json: json ? async () => json : undefined,
        text: text ? async () => text : undefined,
        headers: {
          get: (key: string) => {
            switch (key.toLowerCase()) {
              case "content-length":
                return 100
              case "content-type":
                return header
              default:
                return ""
            }
          },
          raw: () => ({ "content-type": header }),
        },
      }
    }

    it("should be able to parse JSON response", async () => {
      const obj = { a: 1 }
      const input = buildInput(obj, JSON.stringify(obj), "application/json")
      const output = await config.integration.parseResponse(input)
      expect(output.data).toEqual({ a: 1 })
      expect(output.info.code).toEqual(200)
      expect(output.info.size).toEqual("100B")
      expect(output.extra.raw).toEqual(JSON.stringify({ a: 1 }))
      expect(output.extra.headers["content-type"]).toEqual("application/json")
    })

    it("should be able to parse text response", async () => {
      const text = "hello world"
      const input = buildInput(null, text, "text/plain")
      const output = await config.integration.parseResponse(input)
      expect(output.data).toEqual(text)
      expect(output.extra.raw).toEqual(text)
      expect(output.extra.headers["content-type"]).toEqual("text/plain")
    })

    it("should be able to parse XML response", async () => {
      const text = "<root><a>1</a><b>2</b></root>"
      const input = buildInput(null, text, "application/xml")
      const output = await config.integration.parseResponse(input)
      expect(output.data).toEqual({ a: "1", b: "2" })
      expect(output.extra.raw).toEqual(text)
      expect(output.extra.headers["content-type"]).toEqual("application/xml")
    })

    test.each([...contentTypes, undefined])(
      "should not throw an error on 204 no content",
      async contentType => {
        const input = buildInput(undefined, "", contentType, 204)
        const output = await config.integration.parseResponse(input)
        expect(output.data).toEqual([])
        expect(output.extra.raw).toEqual("")
        expect(output.info.code).toEqual(204)
        expect(output.extra.headers["content-type"]).toEqual(contentType)
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
      config = new TestConfiguration({
        url: BASE_URL,
        authConfigs: [basicAuth, bearerAuth],
      })
    })

    it("adds basic auth", async () => {
      const query = {
        authConfigId: "c59c14bd1898a43baa08da68959b24686",
      }
      await config.integration.read(query)
      expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/`, {
        method: "GET",
        headers: {
          Authorization: "Basic dXNlcjpwYXNzd29yZA==",
        },
      })
    })

    it("adds bearer auth", async () => {
      const query = {
        authConfigId: "0d91d732f34e4befabeff50b392a8ff3",
      }
      await config.integration.read(query)
      expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/`, {
        method: "GET",
        headers: {
          Authorization: "Bearer mytoken",
        },
      })
    })
  })

  describe("page based pagination", () => {
    it("can paginate using query params", async () => {
      const pageParam = "my_page_param"
      const sizeParam = "my_size_param"
      const pageValue = 3
      const sizeValue = 10
      const query = {
        path: "api",
        pagination: {
          type: "page",
          location: "query",
          pageParam,
          sizeParam,
        },
        paginationValues: {
          page: pageValue,
          limit: sizeValue,
        },
      }
      await config.integration.read(query)
      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api?${pageParam}=${pageValue}&${sizeParam}=${sizeValue}`,
        {
          headers: {},
          method: "GET",
        }
      )
    })

    it("can paginate using JSON request body", async () => {
      const pageParam = "my_page_param"
      const sizeParam = "my_size_param"
      const pageValue = 3
      const sizeValue = 10
      const query = {
        bodyType: "json",
        path: "api",
        pagination: {
          type: "page",
          location: "body",
          pageParam,
          sizeParam,
        },
        paginationValues: {
          page: pageValue,
          limit: sizeValue,
        },
      }
      await config.integration.create(query)
      expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api`, {
        body: JSON.stringify({
          [pageParam]: pageValue,
          [sizeParam]: sizeValue,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      })
    })

    it("can paginate using form-data request body", async () => {
      const pageParam = "my_page_param"
      const sizeParam = "my_size_param"
      const pageValue = 3
      const sizeValue = 10
      const query = {
        bodyType: "form",
        path: "api",
        pagination: {
          type: "page",
          location: "body",
          pageParam,
          sizeParam,
        },
        paginationValues: {
          page: pageValue,
          limit: sizeValue,
        },
      }
      await config.integration.create(query)
      expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api`, {
        body: expect.any(FormData),
        headers: {},
        method: "POST",
      })
      // @ts-ignore
      const sentData = JSON.stringify(fetch.mock.calls[0][1].body)
      expect(sentData).toContain(pageParam)
      expect(sentData).toContain(sizeParam)
    })

    it("can paginate using form-encoded request body", async () => {
      const pageParam = "my_page_param"
      const sizeParam = "my_size_param"
      const pageValue = 3
      const sizeValue = 10
      const query = {
        bodyType: "encoded",
        path: "api",
        pagination: {
          type: "page",
          location: "body",
          pageParam,
          sizeParam,
        },
        paginationValues: {
          page: pageValue,
          limit: sizeValue,
        },
      }
      await config.integration.create(query)
      expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api`, {
        body: expect.any(URLSearchParams),
        headers: {},
        method: "POST",
      })
      // @ts-ignore
      const sentData = fetch.mock.calls[0][1].body
      expect(sentData.has(pageParam)).toEqual(true)
      expect(sentData.get(pageParam)).toEqual(pageValue.toString())
      expect(sentData.has(pageParam)).toEqual(true)
      expect(sentData.get(sizeParam)).toEqual(sizeValue.toString())
    })
  })

  describe("cursor based pagination", () => {
    it("can paginate using query params", async () => {
      const pageParam = "my_page_param"
      const sizeParam = "my_size_param"
      const pageValue = 3
      const sizeValue = 10
      const query = {
        path: "api",
        pagination: {
          type: "cursor",
          location: "query",
          pageParam,
          sizeParam,
          responseParam: "my_next_cursor",
        },
        paginationValues: {
          page: pageValue,
          limit: sizeValue,
        },
      }
      const res = await config.integration.read(query)
      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api?${pageParam}=${pageValue}&${sizeParam}=${sizeValue}`,
        {
          headers: {},
          method: "GET",
        }
      )
      expect(res.pagination.cursor).toEqual(123)
    })

    it("can paginate using JSON request body", async () => {
      const pageParam = "my_page_param"
      const sizeParam = "my_size_param"
      const pageValue = 3
      const sizeValue = 10
      const query = {
        bodyType: "json",
        path: "api",
        pagination: {
          type: "page",
          location: "body",
          pageParam,
          sizeParam,
          responseParam: "my_next_cursor",
        },
        paginationValues: {
          page: pageValue,
          limit: sizeValue,
        },
      }
      const res = await config.integration.create(query)
      expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api`, {
        body: JSON.stringify({
          [pageParam]: pageValue,
          [sizeParam]: sizeValue,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      })
      expect(res.pagination.cursor).toEqual(123)
    })

    it("can paginate using form-data request body", async () => {
      const pageParam = "my_page_param"
      const sizeParam = "my_size_param"
      const pageValue = 3
      const sizeValue = 10
      const query = {
        bodyType: "form",
        path: "api",
        pagination: {
          type: "page",
          location: "body",
          pageParam,
          sizeParam,
          responseParam: "my_next_cursor",
        },
        paginationValues: {
          page: pageValue,
          limit: sizeValue,
        },
      }
      const res = await config.integration.create(query)
      expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api`, {
        body: expect.any(FormData),
        headers: {},
        method: "POST",
      })
      // @ts-ignore
      const sentData = JSON.stringify(fetch.mock.calls[0][1].body)
      expect(sentData).toContain(pageParam)
      expect(sentData).toContain(sizeParam)
      expect(res.pagination.cursor).toEqual(123)
    })

    it("can paginate using form-encoded request body", async () => {
      const pageParam = "my_page_param"
      const sizeParam = "my_size_param"
      const pageValue = 3
      const sizeValue = 10
      const query = {
        bodyType: "encoded",
        path: "api",
        pagination: {
          type: "page",
          location: "body",
          pageParam,
          sizeParam,
          responseParam: "my_next_cursor",
        },
        paginationValues: {
          page: pageValue,
          limit: sizeValue,
        },
      }
      const res = await config.integration.create(query)
      expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api`, {
        body: expect.any(URLSearchParams),
        headers: {},
        method: "POST",
      })
      // @ts-ignore
      const sentData = fetch.mock.calls[0][1].body
      expect(sentData.has(pageParam)).toEqual(true)
      expect(sentData.get(pageParam)).toEqual(pageValue.toString())
      expect(sentData.has(pageParam)).toEqual(true)
      expect(sentData.get(sizeParam)).toEqual(sizeValue.toString())
      expect(res.pagination.cursor).toEqual(123)
    })

    it("should encode query string correctly", async () => {
      const query = {
        path: "api",
        queryString: "test=1 2",
        headers: HEADERS,
        bodyType: "json",
        requestBody: JSON.stringify({
          name: "test",
        }),
      }
      await config.integration.create(query)
      expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api?test=1%202`, {
        method: "POST",
        body: '{"name":"test"}',
        headers: HEADERS,
      })
    })
  })

  describe("Configuration options", () => {
    it("Attaches insecureHttpParams when legacy HTTP Parser option is set", async () => {
      config = new TestConfiguration({
        url: BASE_URL,
        legacyHttpParser: true,
      })
      await config.integration.read({})
      expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/`, {
        method: "GET",
        headers: {},
        extraHttpOptions: {
          insecureHTTPParser: true,
        },
      })
    })
  })

  it("Attaches custom agent when Reject Unauthorized option is false", async () => {
    config = new TestConfiguration({
      url: BASE_URL,
      rejectUnauthorized: false,
    })
    await config.integration.read({})

    // @ts-ignore
    const calls: any = fetch.mock.calls[0]
    const url = calls[0]
    expect(url).toBe(`${BASE_URL}/`)

    const calledConfig = calls[1]
    expect(calledConfig.method).toBe("GET")
    expect(calledConfig.headers).toEqual({})
    expect(calledConfig.agent.options.rejectUnauthorized).toBe(false)
  })

  describe("File Handling", () => {
    it("uploads file to object store and returns signed URL", async () => {
      const responseData = Buffer.from("teest file contnt")
      const filename = "test.tar.gz"
      const contentType = "application/gzip"
      const mockReadable = new Readable()
      mockReadable.push(responseData)
      mockReadable.push(null)
      ;(fetch as unknown as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          headers: {
            raw: () => ({
              "content-type": [contentType],
              "content-disposition": [`attachment; filename="${filename}"`],
            }),
            get: (header: any) => {
              if (header === "content-type") return contentType
              if (header === "content-disposition")
                return `attachment; filename="${filename}"`
            },
          },
          body: mockReadable,
        })
      )

      const query = {
        path: "api",
      }

      const response = await config.integration.read(query)

      expect(response.data).toEqual({
        size: responseData.byteLength,
        name: "00000000-0000-0000-0000-000000000000.tar.gz",
        url: expect.stringContaining(
          "/files/signed/tmp-file-attachments/app-id/00000000-0000-0000-0000-000000000000.tar.gz"
        ),
        extension: "tar.gz",
        key: expect.stringContaining(
          "app-id/00000000-0000-0000-0000-000000000000.tar.gz"
        ),
      })
    })

    it("uploads file with non ascii filename to object store and returns signed URL", async () => {
      const responseData = Buffer.from("teest file contnt")
      const contentType = "text/plain"
      const mockReadable = new Readable()
      mockReadable.push(responseData)
      mockReadable.push(null)
      ;(fetch as unknown as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          headers: {
            raw: () => ({
              "content-type": [contentType],
              "content-disposition": [
                // eslint-disable-next-line no-useless-escape
                `attachment; filename="£ and ? rates.pdf"; filename*=UTF-8'\'%C2%A3%20and%20%E2%82%AC%20rates.pdf`,
              ],
            }),
            get: (header: any) => {
              if (header === "content-type") return contentType
              if (header === "content-disposition")
                // eslint-disable-next-line no-useless-escape
                return `attachment; filename="£ and ? rates.pdf"; filename*=UTF-8'\'%C2%A3%20and%20%E2%82%AC%20rates.pdf`
            },
          },
          body: mockReadable,
        })
      )

      const query = {
        path: "api",
      }

      const response = await config.integration.read(query)

      expect(response.data).toEqual({
        size: responseData.byteLength,
        name: "00000000-0000-0000-0000-000000000000.pdf",
        url: expect.stringContaining(
          "/files/signed/tmp-file-attachments/app-id/00000000-0000-0000-0000-000000000000.pdf"
        ),
        extension: "pdf",
        key: expect.stringContaining(
          "app-id/00000000-0000-0000-0000-000000000000.pdf"
        ),
      })
    })
  })
})
