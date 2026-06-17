jest.mock("../integrations", () => ({
  getIntegration: jest.fn(),
}))

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    context: {
      ...actual.context,
      doInWorkspaceContext: jest.fn((_appId: any, fn: any) => fn()),
      doInEnvironmentContext: jest.fn((_vars: any, fn: any) => fn()),
    },
  }
})

jest.mock("../sdk", () => ({
  __esModule: true,
  default: {
    queries: {
      enrichContext: jest.fn((fields: any) => Promise.resolve(fields)),
      enrichParameters: jest.fn((params: any) => Promise.resolve(params)),
    },
    datasources: {
      get: jest.fn(),
    },
  },
}))

jest.mock("./utils", () => {
  const actual = jest.requireActual("./utils")
  return {
    ...actual,
    default: {
      ...actual.default,
      threadSetup: jest.fn(),
      formatResponse: jest.fn((r: any) => r),
    },
  }
})

jest.mock("../integrations/queries/sql", () => ({
  interpolateSQL: jest.fn(),
}))

jest.mock("../integrations/utils", () => ({
  isSQL: jest.fn(() => false),
}))

import { getIntegration } from "../integrations"
import { execute } from "./query"
import { BodyType, SourceName } from "@budibase/types"
import type { QueryEvent } from "./definitions"

const buildEvent = (overrides: Partial<QueryEvent> = {}): QueryEvent => ({
  appId: "app_test",
  datasource: {
    _id: "ds_1",
    type: "datasource",
    source: SourceName.REST,
    config: { url: "https://new.example.com" },
    name: "Test DS",
    isSQL: false,
  },
  queryVerb: "read",
  fields: {
    path: "https://old.example.com/api/v1/users",
    queryString: "",
    headers: {},
    bodyType: BodyType.NONE,
  },
  parameters: {},
  transformer: null,
  schema: {},
  nullDefaultSupport: false,
  ...overrides,
})

const runEvent = (event: QueryEvent): Promise<string | undefined> => {
  return new Promise((resolve, reject) => {
    let capturedPath: string | undefined
    ;(getIntegration as jest.Mock).mockResolvedValue(
      class {
        read = jest.fn(async (opts: any) => {
          capturedPath = opts.path
          return []
        })
      }
    )
    execute(event, (err, _result) => {
      if (err) reject(err)
      else resolve(capturedPath)
    })
  })
}

describe("QueryRunner - template datasource URL resolution", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("swaps the base URL for a template datasource when hosts differ", async () => {
    const event = buildEvent({
      datasource: {
        _id: "ds_1",
        type: "datasource",
        source: SourceName.REST,
        config: { url: "https://new.example.com" },
        name: "Test DS",
        isSQL: false,
        restTemplateId: "gitlab",
      },
    })
    const path = await runEvent(event)
    expect(path).toBe("https://new.example.com/api/v1/users")
  })

  it("does not swap when datasource has no config URL", async () => {
    const event = buildEvent({
      datasource: {
        _id: "ds_1",
        type: "datasource",
        source: SourceName.REST,
        config: {},
        name: "Test DS",
        isSQL: false,
        restTemplateId: "gitlab",
      },
    })
    const path = await runEvent(event)
    expect(path).toBe("https://old.example.com/api/v1/users")
  })

  it("does not swap for a non-template (custom) datasource", async () => {
    const path = await runEvent(buildEvent())
    expect(path).toBe("https://old.example.com/api/v1/users")
  })

  it("swaps base and preserves HBS bindings in the path segment", async () => {
    const event = buildEvent({
      datasource: {
        _id: "ds_1",
        type: "datasource",
        source: SourceName.REST,
        config: { url: "https://new.example.com" },
        name: "Test DS",
        isSQL: false,
        restTemplateId: "gitlab",
      },
      fields: {
        path: "https://old.example.com/api/{{version}}/users",
        queryString: "",
        headers: {},
        bodyType: BodyType.NONE,
      },
    })
    const path = await runEvent(event)
    expect(path).toBe("https://new.example.com/api/{{version}}/users")
  })

  it("resolves config.url HBS binding via static variables before swapping", async () => {
    const event = buildEvent({
      datasource: {
        _id: "ds_1",
        type: "datasource",
        source: SourceName.REST,
        config: {
          url: "{{host}}",
          staticVariables: { host: "https://new.example.com" },
        },
        name: "Test DS",
        isSQL: false,
        restTemplateId: "attio",
      },
      // This re-enforces the fact that fields.path is stored with
      // the spec's servers[0] URL as the base
      fields: {
        path: "https://api.attio.com/v2/objects/{{object}}",
        queryString: "",
        headers: {},
        bodyType: BodyType.NONE,
      },
    })
    const path = await runEvent(event)
    expect(path).toBe("https://new.example.com/v2/objects/{{object}}")
  })

  it("falls back to datasource base when path host is an unresolved HBS binding", async () => {
    const event = buildEvent({
      datasource: {
        _id: "ds_1",
        type: "datasource",
        source: SourceName.REST,
        config: { url: "https://new.example.com" },
        name: "Test DS",
        isSQL: false,
        restTemplateId: "gitlab",
      },
      fields: {
        path: "{{myHost}}/api/v1/users",
        queryString: "",
        headers: {},
        bodyType: BodyType.NONE,
      },
    })
    const path = await runEvent(event)
    expect(path).toBe("https://new.example.com")
  })
})
