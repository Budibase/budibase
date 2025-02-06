import * as setup from "../utilities"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import { Datasource, SourceName } from "@budibase/types"
import { getCachedVariable } from "../../../../threads/utils"
import nock from "nock"
import { generator } from "@budibase/backend-core/tests"

describe("rest", () => {
  let config: TestConfiguration
  let datasource: Datasource

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
    config = setup.getConfig()
    await config.init()
    datasource = await config.api.datasource.create({
      name: generator.guid(),
      type: "test",
      source: SourceName.REST,
      config: {},
    })
  })

  afterEach(() => {
    nock.cleanAll()
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
    nock("http://one.example.com").get("/").reply(200, body1)
    nock("http://two.example.com").get("/?test=one").reply(500)
    nock("http://two.example.com").get("/?test=one").reply(200, body2)

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

    nock("http://www.example.com")
      .get("/")
      .reply(200, [{ obj: {}, id: "1" }])

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

    nock.cleanAll()

    nock("http://www.example.com")
      .get("/")
      .reply(200, [{ obj: [], id: "1" }])

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
    const mock = nock("http://www.example.com", {
      reqheaders: {
        test: "headerVal",
        emailhdr: user.email,
        queryhdr: user.firstName!,
        secondhdr: "1234",
      },
    })
      .get("/?email=" + user.email.replace("@", "%40"))
      .reply(200, {})

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

    expect(mock.isDone()).toEqual(true)
  })

  it("should bind the current user to query params", async () => {
    const user = config.getUserDetails()
    const mock = nock("http://www.example.com")
      .get(
        "/?test=" +
          user.email.replace("@", "%40") +
          "&testName=" +
          user.firstName +
          "&testParam=1234"
      )
      .reply(200, {})

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

    expect(mock.isDone()).toEqual(true)
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
    const mock = nock("http://www.example.com")
      .post(
        "/?testParam=1234",
        "This is plain text and this is my email: " +
          user.email +
          ". This is a test param: 1234"
      )
      .reply(200, {})

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
        bodyType: "text",
        queryString: "&testParam={{testParam}}",
        requestBody:
          "This is plain text and this is my email: {{[user].[email]}}. This is a test param: {{testParam}}",
      },
    })

    expect(mock.isDone()).toEqual(true)
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
    const mock = nock("http://www.example.com")
      .post("/?testParam=1234", {
        email: user.email,
        queryCode: 1234,
        userRef: user.firstName,
      })
      .reply(200, {})

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
        bodyType: "json",
        queryString: "&testParam={{testParam}}",
        requestBody:
          '{"email":"{{[user].[email]}}","queryCode":{{testParam}},"userRef":"{{userRef}}"}',
      },
    })

    expect(mock.isDone()).toEqual(true)
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
    const mock = nock("http://www.example.com")
      .post(
        "/?testParam=1234",
        `<note> <email>${user.email}</email> <code>1234</code> <ref>${user.firstName}</ref> <somestring>testing</somestring> </note>`
      )
      .reply(200, {})

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
        bodyType: "xml",
        queryString: "&testParam={{testParam}}",
        requestBody:
          "<note> <email>{{[user].[email]}}</email> <code>{{testParam}}</code> " +
          "<ref>{{userId}}</ref> <somestring>testing</somestring> </note>",
      },
    })

    expect(mock.isDone()).toEqual(true)
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
    const mock = nock("http://www.example.com")
      .post("/?testParam=1234", body => {
        return (
          body.includes('name="email"\r\n\r\n' + user.email + "\r\n") &&
          body.includes('name="queryCode"\r\n\r\n1234\r\n') &&
          body.includes('name="userRef"\r\n\r\n' + user.firstName + "\r\n")
        )
      })
      .reply(200, {})

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
        bodyType: "form",
        queryString: "&testParam={{testParam}}",
        requestBody:
          '{"email":"{{[user].[email]}}","queryCode":{{testParam}},"userRef":"{{userRef}}"}',
      },
    })

    expect(mock.isDone()).toEqual(true)
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
    const mock = nock("http://www.example.com")
      .post("/?testParam=1234", {
        email: user.email,
        queryCode: 1234,
        userRef: user.firstName,
      })
      .reply(200, {})

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
        bodyType: "encoded",
        queryString: "&testParam={{testParam}}",
        requestBody:
          '{"email":"{{[user].[email]}}","queryCode":{{testParam}},"userRef":"{{userRef}}"}',
      },
    })

    expect(mock.isDone()).toEqual(true)
  })
})
