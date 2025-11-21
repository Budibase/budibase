import * as setup from "../utilities"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import { BodyType, Datasource, SourceName } from "@budibase/types"
import { getCachedVariable } from "../../../../threads/utils"
import { generator } from "@budibase/backend-core/tests"
import type { MockAgent } from "undici"
import { setEnv } from "../../../../environment"
import { installHttpMocking, resetHttpMocking } from "../../../../tests/jestEnv"

describe("rest", () => {
  let config: TestConfiguration
  let datasource: Datasource
  let mockAgent: MockAgent | undefined
  let restoreEnv: (() => void) | undefined

  const jsonHeaders = { "content-type": "application/json" }

  const toBodyString = (body: any): string => {
    if (body == null) {
      return ""
    }
    if (typeof body === "string") {
      return body
    }
    if (Buffer.isBuffer(body)) {
      return body.toString()
    }
    if (ArrayBuffer.isView(body)) {
      return Buffer.from(
        body.buffer,
        body.byteOffset,
        body.byteLength
      ).toString()
    }
    if (body instanceof ArrayBuffer) {
      return Buffer.from(body).toString()
    }
    if (typeof (body as any).getBuffer === "function") {
      return (body as any).getBuffer().toString()
    }
    if (typeof (body as any).toString === "function") {
      const text = (body as any).toString()
      if (text !== "[object Object]" && text !== "[object FormData]") {
        return text
      }
    }
    if (typeof (body as any).toJSON === "function") {
      return JSON.stringify((body as any).toJSON())
    }
    return JSON.stringify(body)
  }

  const valueToString = (value: unknown): string => {
    if (typeof value === "string") {
      return value
    }
    if (Buffer.isBuffer(value)) {
      return value.toString()
    }
    if (
      value &&
      typeof value === "object" &&
      "value" in value &&
      Buffer.isBuffer((value as { value: unknown }).value)
    ) {
      return (value as { value: Buffer }).value.toString()
    }
    if (value == null) {
      return ""
    }
    return String(value)
  }

  const extractFormEntries = (
    body: unknown
  ): Record<string, string> | undefined => {
    if (!body) {
      return undefined
    }
    const entriesFn = (
      body as {
        entries?: () => IterableIterator<[unknown, unknown]>
      }
    ).entries
    if (typeof entriesFn === "function") {
      const result: Record<string, string> = {}
      for (const [key, value] of entriesFn.call(body) as Iterable<
        [unknown, unknown]
      >) {
        result[String(key)] = valueToString(value)
      }
      return result
    }
    const forEachFn = (
      body as {
        forEach?: (callback: (value: unknown, key: string) => void) => void
      }
    ).forEach
    if (typeof forEachFn === "function") {
      const result: Record<string, string> = {}
      forEachFn.call(body, (value, key) => {
        result[key] = valueToString(value)
      })
      return result
    }
    return undefined
  }

  async function createQuery(fields: any) {
    return await config.api.query.save({
      name: "test query",
      datasourceId: datasource._id!,
      parameters: [],
      fields,
      transformer: "",
      schema: {},
      readable: true,
      queryVerb: "read",
    })
  }

  beforeAll(async () => {
    restoreEnv = setEnv({ REST_REJECT_UNAUTHORIZED: false })
    config = setup.getConfig()
    await config.init()
    datasource = await config.api.datasource.create({
      name: generator.guid(),
      type: "test",
      source: SourceName.REST,
      config: {},
    })
  })

  beforeEach(() => {
    mockAgent = installHttpMocking()
    mockAgent.disableNetConnect()
  })

  afterEach(async () => {
    if (mockAgent) {
      mockAgent.assertNoPendingInterceptors()
      await resetHttpMocking()
      mockAgent = undefined
    }
  })

  afterAll(() => {
    restoreEnv?.()
  })

  it("should automatically retry on fail with cached dynamics", async () => {
    const basedOnQuery = await createQuery({
      path: "one.example.com",
    })

    let cached = await getCachedVariable(basedOnQuery._id!, "foo")
    expect(cached).toBeNull()

    await config.api.datasource.update({
      ...datasource,
      config: {
        ...datasource.config,
        dynamicVariables: [
          {
            queryId: basedOnQuery._id!,
            name: "foo",
            value: "{{ data[0].name }}",
          },
        ],
      },
    })

    cached = await getCachedVariable(basedOnQuery._id!, "foo")
    expect(cached).toBeNull()

    const body1 = [{ name: "one" }]
    const body2 = [{ name: "two" }]
    mockAgent!
      .get("http://one.example.com")
      .intercept({ path: "/", method: "GET" })
      .reply(200, body1, { headers: jsonHeaders })
    const twoExample = mockAgent!.get("http://two.example.com")
    twoExample
      .intercept({ path: "/", method: "GET", query: { test: "one" } })
      .reply(500, { message: "fail" }, { headers: jsonHeaders })
    twoExample
      .intercept({ path: "/", method: "GET", query: { test: "one" } })
      .reply(200, body2, { headers: jsonHeaders })

    const res = await config.api.query.preview({
      datasourceId: datasource._id!,
      name: "test query",
      parameters: [],
      queryVerb: "read",
      transformer: "",
      schema: {},
      readable: true,
      fields: {
        path: "two.example.com",
        queryString: "test={{ foo }}",
      },
    })
    expect(res.schema).toEqual({
      name: { type: "string", name: "name" },
    })

    cached = await getCachedVariable(basedOnQuery._id!, "foo")
    expect(cached.rows.length).toEqual(1)
    expect(cached.rows[0].name).toEqual("one")
  })

  it("should update schema when structure changes from JSON to array", async () => {
    const datasource = await config.api.datasource.create({
      name: generator.guid(),
      type: "test",
      source: SourceName.REST,
      config: {},
    })

    const example = mockAgent!.get("http://www.example.com")
    example
      .intercept({ path: "/", method: "GET" })
      .reply(200, [{ obj: {}, id: "1" }], { headers: jsonHeaders })

    const firstResponse = await config.api.query.preview({
      datasourceId: datasource._id!,
      name: "test query",
      parameters: [],
      queryVerb: "read",
      transformer: "",
      schema: {},
      readable: true,
      fields: {
        path: "www.example.com",
      },
    })

    expect(firstResponse.schema).toEqual({
      obj: { type: "json", name: "obj" },
      id: { type: "string", name: "id" },
    })

    example
      .intercept({ path: "/", method: "GET" })
      .reply(200, [{ obj: [], id: "1" }], { headers: jsonHeaders })

    const secondResponse = await config.api.query.preview({
      datasourceId: datasource._id!,
      name: "test query",
      parameters: [],
      queryVerb: "read",
      transformer: "",
      schema: firstResponse.schema,
      readable: true,
      fields: {
        path: "www.example.com",
      },
    })

    expect(secondResponse.schema).toEqual({
      obj: { type: "array", name: "obj" },
      id: { type: "string", name: "id" },
    })
  })

  it("should parse global and query level header mappings", async () => {
    const datasource = await config.api.datasource.create({
      name: generator.guid(),
      type: "test",
      source: SourceName.REST,
      config: {
        defaultHeaders: {
          test: "headerVal",
          emailHdr: "{{[user].[email]}}",
        },
      },
    })

    const user = config.getUserDetails()
    mockAgent!
      .get("http://www.example.com")
      .intercept({
        path: "/",
        method: "GET",
        query: { email: user.email },
        headers: {
          test: "headerVal",
          emailhdr: user.email,
          queryhdr: user.firstName!,
          secondhdr: "1234",
        },
      })
      .reply(200, {}, { headers: jsonHeaders })

    await config.api.query.preview({
      datasourceId: datasource._id!,
      name: generator.guid(),
      parameters: [],
      queryVerb: "read",
      transformer: "",
      schema: {},
      readable: true,
      fields: {
        path: "www.example.com",
        queryString: "email={{[user].[email]}}",
        headers: {
          queryHdr: "{{[user].[firstName]}}",
          secondHdr: "1234",
        },
      },
    })
  })

  it("should bind the current user to query params", async () => {
    const user = config.getUserDetails()
    mockAgent!
      .get("http://www.example.com")
      .intercept({
        path: "/",
        method: "GET",
        query: {
          test: user.email,
          testName: user.firstName,
          testParam: "1234",
        },
      })
      .reply(200, {}, { headers: jsonHeaders })

    await config.api.query.preview({
      datasourceId: datasource._id!,
      name: generator.guid(),
      parameters: [
        { name: "myEmail", default: "{{[user].[email]}}" },
        { name: "myName", default: "{{[user].[firstName]}}" },
        { name: "testParam", default: "1234" },
      ],
      queryVerb: "read",
      transformer: "",
      schema: {},
      readable: true,
      fields: {
        path: "www.example.com",
        queryString:
          "test={{myEmail}}&testName={{myName}}&testParam={{testParam}}",
      },
    })
  })

  it("should bind the current user to the request body - plain text", async () => {
    const datasource = await config.api.datasource.create({
      name: generator.guid(),
      type: "test",
      source: SourceName.REST,
      config: {
        method: "POST",
        defaultHeaders: {
          test: "headerVal",
          emailHdr: "{{[user].[email]}}",
        },
      },
    })

    const user = config.getUserDetails()
    const expectedBody =
      "This is plain text and this is my email: " +
      user.email +
      ". This is a test param: 1234"
    mockAgent!
      .get("http://www.example.com")
      .intercept({ path: "/", method: "POST", query: { testParam: "1234" } })
      .reply(({ body }) => {
        expect(toBodyString(body)).toEqual(expectedBody)
        return {
          statusCode: 200,
          data: {},
          responseOptions: { headers: jsonHeaders },
        }
      })

    await config.api.query.preview({
      datasourceId: datasource._id!,
      name: generator.guid(),
      parameters: [{ name: "testParam", default: "1234" }],
      queryVerb: "create",
      transformer: "",
      schema: {},
      readable: true,
      fields: {
        path: "www.example.com",
        bodyType: BodyType.TEXT,
        queryString: "&testParam={{testParam}}",
        requestBody:
          "This is plain text and this is my email: {{[user].[email]}}. This is a test param: {{testParam}}",
      },
    })
  })

  it("should bind the current user to the request body - json", async () => {
    const datasource = await config.api.datasource.create({
      name: generator.guid(),
      type: "test",
      source: SourceName.REST,
      config: {
        method: "POST",
        defaultHeaders: {
          test: "headerVal",
          emailHdr: "{{[user].[email]}}",
        },
      },
    })

    const user = config.getUserDetails()
    mockAgent!
      .get("http://www.example.com")
      .intercept({ path: "/", method: "POST", query: { testParam: "1234" } })
      .reply(({ body }) => {
        const payload = JSON.parse(toBodyString(body))
        expect(payload).toEqual({
          email: user.email,
          queryCode: 1234,
          userRef: user.firstName,
        })
        return {
          statusCode: 200,
          data: {},
          responseOptions: { headers: jsonHeaders },
        }
      })

    await config.api.query.preview({
      datasourceId: datasource._id!,
      name: generator.guid(),
      parameters: [
        { name: "testParam", default: "1234" },
        { name: "userRef", default: "{{[user].[firstName]}}" },
      ],
      queryVerb: "create",
      transformer: "",
      schema: {},
      readable: true,
      fields: {
        path: "www.example.com",
        bodyType: BodyType.JSON,
        queryString: "&testParam={{testParam}}",
        requestBody:
          '{"email":"{{[user].[email]}}","queryCode":{{testParam}},"userRef":"{{userRef}}"}',
      },
    })
  })

  it("should bind the current user to the request body - xml", async () => {
    const datasource = await config.api.datasource.create({
      name: generator.guid(),
      type: "test",
      source: SourceName.REST,
      config: {
        method: "POST",
        defaultHeaders: {
          test: "headerVal",
          emailHdr: "{{[user].[email]}}",
        },
      },
    })

    const user = config.getUserDetails()
    mockAgent!
      .get("http://www.example.com")
      .intercept({ path: "/", method: "POST", query: { testParam: "1234" } })
      .reply(({ body }) => {
        expect(toBodyString(body)).toEqual(
          `<note> <email>${user.email}</email> <code>1234</code> <ref>${user.firstName}</ref> <somestring>testing</somestring> </note>`
        )
        return {
          statusCode: 200,
          data: {},
          responseOptions: { headers: jsonHeaders },
        }
      })

    await config.api.query.preview({
      datasourceId: datasource._id!,
      name: generator.guid(),
      parameters: [
        { name: "testParam", default: "1234" },
        { name: "userId", default: "{{[user].[firstName]}}" },
      ],
      queryVerb: "create",
      transformer: "",
      schema: {},
      readable: true,
      fields: {
        path: "www.example.com",
        bodyType: BodyType.XML,
        queryString: "&testParam={{testParam}}",
        requestBody:
          "<note> <email>{{[user].[email]}}</email> <code>{{testParam}}</code> " +
          "<ref>{{userId}}</ref> <somestring>testing</somestring> </note>",
      },
    })
  })

  it("should bind the current user to the request body - form-data", async () => {
    const datasource = await config.api.datasource.create({
      name: generator.guid(),
      type: "test",
      source: SourceName.REST,
      config: {
        method: "POST",
        defaultHeaders: {
          test: "headerVal",
          emailHdr: "{{[user].[email]}}",
        },
      },
    })

    const user = config.getUserDetails()
    mockAgent!
      .get("http://www.example.com")
      .intercept({ path: "/", method: "POST", query: { testParam: "1234" } })
      .reply(({ body }) => {
        const form = extractFormEntries(body)
        if (form) {
          expect(form.email).toEqual(user.email)
          expect(form.queryCode).toEqual("1234")
          expect(form.userRef).toEqual(user.firstName)
        } else {
          const bodyString = toBodyString(body)
          expect(bodyString).toContain('name="email"')
          expect(bodyString).toContain(user.email)
          expect(bodyString).toContain('name="queryCode"')
          expect(bodyString).toContain("1234")
          expect(bodyString).toContain('name="userRef"')
          expect(bodyString).toContain(user.firstName)
        }
        return {
          statusCode: 200,
          data: {},
          responseOptions: { headers: jsonHeaders },
        }
      })

    await config.api.query.preview({
      datasourceId: datasource._id!,
      name: generator.guid(),
      parameters: [
        { name: "testParam", default: "1234" },
        { name: "userRef", default: "{{[user].[firstName]}}" },
      ],
      queryVerb: "create",
      transformer: "",
      schema: {},
      readable: true,
      fields: {
        path: "www.example.com",
        bodyType: BodyType.FORM_DATA,
        queryString: "&testParam={{testParam}}",
        requestBody:
          '{"email":"{{[user].[email]}}","queryCode":{{testParam}},"userRef":"{{userRef}}"}',
      },
    })
  })

  it("should bind the current user to the request body - encoded", async () => {
    const datasource = await config.api.datasource.create({
      name: generator.guid(),
      type: "test",
      source: SourceName.REST,
      config: {
        method: "POST",
        defaultHeaders: {
          test: "headerVal",
          emailHdr: "{{[user].[email]}}",
        },
      },
    })

    const user = config.getUserDetails()
    mockAgent!
      .get("http://www.example.com")
      .intercept({ path: "/", method: "POST", query: { testParam: "1234" } })
      .reply(({ body }) => {
        const params = new URLSearchParams(toBodyString(body))
        expect(params.get("email")).toEqual(user.email)
        expect(params.get("queryCode")).toEqual("1234")
        expect(params.get("userRef")).toEqual(user.firstName)
        return {
          statusCode: 200,
          data: {},
          responseOptions: { headers: jsonHeaders },
        }
      })

    await config.api.query.preview({
      datasourceId: datasource._id!,
      name: generator.guid(),
      parameters: [
        { name: "testParam", default: "1234" },
        { name: "userRef", default: "{{[user].[firstName]}}" },
      ],
      queryVerb: "create",
      transformer: "",
      schema: {},
      readable: true,
      fields: {
        path: "www.example.com",
        bodyType: BodyType.ENCODED,
        queryString: "&testParam={{testParam}}",
        requestBody:
          '{"email":"{{[user].[email]}}","queryCode":{{testParam}},"userRef":"{{userRef}}"}',
      },
    })
  })

  it("binds static variables when the parameter name matches", async () => {
    const staticDatasource = await config.api.datasource.create({
      name: generator.guid(),
      type: "test",
      source: SourceName.REST,
      config: {
        staticVariables: {
          companyDomain: "acme",
        },
      },
    })

    mockAgent!
      .get("http://www.example.com")
      .intercept({
        path: "/",
        method: "GET",
        query: { companyDomain: "acme" },
      })
      .reply(200, { success: true }, { headers: jsonHeaders })

    await config.api.query.preview({
      datasourceId: staticDatasource._id!,
      name: generator.guid(),
      parameters: [{ name: "companyDomain", default: "{{ companyDomain }}" }],
      queryVerb: "read",
      transformer: "",
      schema: {},
      readable: true,
      fields: {
        path: "www.example.com",
        queryString: "companyDomain={{companyDomain}}",
      },
    })
  })

  it("binds static variables when the local binding name differs", async () => {
    const staticDatasource = await config.api.datasource.create({
      name: generator.guid(),
      type: "test",
      source: SourceName.REST,
      config: {
        staticVariables: {
          companyDomain: "acme",
        },
      },
    })

    mockAgent!
      .get("http://www.example.com")
      .intercept({
        path: "/",
        method: "GET",
        query: { domain: "acme" },
      })
      .reply(200, { success: true }, { headers: jsonHeaders })

    await config.api.query.preview({
      datasourceId: staticDatasource._id!,
      name: generator.guid(),
      parameters: [
        {
          name: "localDomain",
          default: "{{ companyDomain }}",
        },
      ],
      queryVerb: "read",
      transformer: "",
      schema: {},
      readable: true,
      fields: {
        path: "www.example.com",
        queryString: "domain={{localDomain}}",
      },
    })
  })

  it("binds static variables used inside the request path", async () => {
    const staticDatasource = await config.api.datasource.create({
      name: generator.guid(),
      type: "test",
      source: SourceName.REST,
      config: {
        staticVariables: {
          companyDomain: "acme",
        },
      },
    })

    mockAgent!
      .get("http://www.example.com")
      .intercept({
        path: "/org/acme/users",
        method: "GET",
      })
      .reply(200, { success: true }, { headers: jsonHeaders })

    await config.api.query.preview({
      datasourceId: staticDatasource._id!,
      name: generator.guid(),
      parameters: [
        {
          name: "companyDomain",
          default: "{{ companyDomain }}",
        },
      ],
      queryVerb: "read",
      transformer: "",
      schema: {},
      readable: true,
      fields: {
        path: "www.example.com/org/{{companyDomain}}/users",
        queryString: "",
      },
    })
  })

  it("should remove empty query parameters from bindings", async () => {
    mockAgent!
      .get("http://www.example.com")
      .intercept({
        path: "/",
        method: "GET",
        query: { validParam: "test" },
      })
      .reply(200, { success: true }, { headers: jsonHeaders })

    await config.api.query.preview({
      datasourceId: datasource._id!,
      name: generator.guid(),
      parameters: [
        { name: "emptyParam", default: "" },
        { name: "validParam", default: "test" },
        { name: "anotherEmptyParam", default: "" },
      ],
      queryVerb: "read",
      transformer: "",
      schema: {},
      readable: true,
      fields: {
        path: "www.example.com",
        queryString:
          "emptyParam={{emptyParam}}&validParam={{validParam}}&anotherEmptyParam={{anotherEmptyParam}}",
      },
    })
  })

  it("should handle query string with all empty bindings", async () => {
    mockAgent!
      .get("http://www.example.com")
      .intercept({ path: "/", method: "GET" })
      .reply(200, { success: true }, { headers: jsonHeaders })

    await config.api.query.preview({
      datasourceId: datasource._id!,
      name: generator.guid(),
      parameters: [
        { name: "emptyParam1", default: "" },
        { name: "emptyParam2", default: "" },
      ],
      queryVerb: "read",
      transformer: "",
      schema: {},
      readable: true,
      fields: {
        path: "www.example.com",
        queryString: "emptyParam1={{emptyParam1}}&emptyParam2={{emptyParam2}}",
      },
    })
  })
})
