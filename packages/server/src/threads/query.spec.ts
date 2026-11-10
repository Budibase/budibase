const mockDbGet = jest.fn()

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
      getEnvironmentVariables: jest.fn(() => null),
      getWorkspaceDB: jest.fn(() => ({ get: mockDbGet })),
    },
  }
})

jest.mock("../sdk", () => ({
  __esModule: true,
  default: {
    queries: {
      enrichContext: jest.fn((fields: any) => Promise.resolve(fields)),
      enrichParameters: jest.fn(({ parameters }) =>
        Promise.resolve(parameters)
      ),
    },
    datasources: {
      get: jest.fn(),
    },
  },
}))

jest.mock("./utils", () => {
  const actual = jest.requireActual("./utils")
  return {
    __esModule: true,
    ...actual,
    default: {
      ...actual.default,
      threadSetup: jest.fn(),
      formatResponse: jest.fn((r: any) => r),
      getCachedVariable: jest.fn(),
      storeDynamicVariable: jest.fn(),
    },
  }
})

jest.mock("../integrations/queries/sql", () => ({
  interpolateSQL: jest.fn(),
}))

jest.mock("../integrations/utils", () => ({
  isSQL: jest.fn(() => false),
}))

import { context } from "@budibase/backend-core"
import { getIntegration } from "../integrations"
import { interpolateSQL } from "../integrations/queries/sql"
import { isSQL } from "../integrations/utils"
import sdk from "../sdk"
import {
  enrichContext,
  enrichParameters,
} from "../sdk/workspace/queries/queries"
import { execute } from "./query"
import { BodyType, SourceName } from "@budibase/types"
import type {
  QueryEvent,
  QueryEventParameters,
  QueryResponse,
} from "./definitions"

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
    ;(getIntegration as jest.Mock).mockResolvedValue(async () => ({
      read: jest.fn(async (opts: any) => {
        capturedPath = opts.path
        return []
      }),
    }))
    execute(event, (err, _result) => {
      if (err) reject(err)
      else resolve(capturedPath)
    })
  })
}

const runEventForPreview = (
  event: QueryEvent
): Promise<Record<string, any> | undefined> => {
  return new Promise((resolve, reject) => {
    let capturedPreviewFields: Record<string, any> | undefined
    ;(getIntegration as jest.Mock).mockResolvedValue(async () => ({
      read: jest.fn(async (_query: any, opts: any) => {
        capturedPreviewFields = opts?.previewFields
        return []
      }),
    }))
    execute(event, (err, _result) => {
      if (err) reject(err)
      else resolve(capturedPreviewFields)
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

  it("applies the swapped base URL to the request preview fields", async () => {
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
      includeRequest: true,
      previewConfig: { url: "https://new.example.com" },
    })
    const previewFields = await runEventForPreview(event)
    expect(previewFields?.path).toBe("https://new.example.com/api/v1/users")
  })

  it("resolves a static variable in the preview config URL before swapping", async () => {
    const event = buildEvent({
      datasource: {
        _id: "ds_1",
        type: "datasource",
        source: SourceName.REST,
        config: {
          url: "https://new.example.com",
          staticVariables: { host: "https://new.example.com" },
        },
        name: "Test DS",
        isSQL: false,
        restTemplateId: "attio",
      },
      includeRequest: true,
      previewConfig: { url: "{{host}}" },
    })
    const previewFields = await runEventForPreview(event)
    expect(previewFields?.path).toBe("https://new.example.com/api/v1/users")
  })

  it("does not rewrite the preview path for a non-template datasource", async () => {
    const event = buildEvent({
      includeRequest: true,
      previewConfig: { url: "https://new.example.com" },
    })
    const previewFields = await runEventForPreview(event)
    expect(previewFields?.path).toBe("https://old.example.com/api/v1/users")
  })

  it("still runs the query without a preview when the preview build fails", async () => {
    ;(context.getEnvironmentVariables as jest.Mock).mockImplementationOnce(
      () => {
        throw new Error("preview build failure")
      }
    )
    const event = buildEvent({ includeRequest: true })
    let capturedQuery: Record<string, any> | undefined
    let capturedPreviewFields: Record<string, any> | undefined
    ;(getIntegration as jest.Mock).mockResolvedValue(async () => ({
      read: jest.fn(async (query: any, opts: any) => {
        capturedQuery = query
        capturedPreviewFields = opts?.previewFields
        return []
      }),
    }))
    await new Promise<void>((resolve, reject) => {
      execute(event, err => (err ? reject(err) : resolve()))
    })
    expect(capturedQuery?.path).toBe("https://old.example.com/api/v1/users")
    expect(capturedPreviewFields).toBeUndefined()
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

describe("QueryRunner - nullable parameters", () => {
  interface ParameterTest {
    name: string
    sql: boolean
    parameters: QueryEventParameters
    expected: string | number | null
  }

  const runQuery = (event: QueryEvent): Promise<QueryResponse> =>
    new Promise((resolve, reject) => {
      execute(event, (err, response) => {
        if (err) {
          reject(err)
        } else {
          resolve(response)
        }
      })
    })

  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(context.getEnvironmentVariables).mockReturnValue({})
    jest.mocked(isSQL).mockImplementation(datasource => !!datasource.isSQL)
    jest.mocked(sdk.queries.enrichContext).mockImplementation(enrichContext)
    jest
      .mocked(sdk.queries.enrichParameters)
      .mockImplementation(enrichParameters)
    jest
      .mocked(interpolateSQL)
      .mockImplementation(async (_source, fields, parameters) => ({
        ...fields,
        bindings: [parameters.amount],
      }))
    jest.mocked(getIntegration).mockResolvedValue(async () => ({
      read: async (query: {
        bindings?: (string | number | null)[]
        json?: { amount: string | null }
      }) => [
        { amount: query.bindings ? query.bindings[0] : query.json?.amount },
      ],
    }))
  })

  it.each<ParameterTest>([
    {
      name: "explicit SQL null",
      sql: true,
      parameters: { amount: null },
      expected: null,
    },
    { name: "missing SQL value", sql: true, parameters: {}, expected: "17" },
    {
      name: "empty SQL value",
      sql: true,
      parameters: { amount: "" },
      expected: "17",
    },
    { name: "SQL zero", sql: true, parameters: { amount: 0 }, expected: 0 },
    {
      name: "REST null",
      sql: false,
      parameters: { amount: null },
      expected: null,
    },
  ])(
    "uses static variables appropriately for $name",
    async ({ sql, parameters, expected }) => {
      const event = buildEvent({
        datasource: {
          ...buildEvent().datasource,
          source: sql ? SourceName.POSTGRES : SourceName.REST,
          isSQL: sql,
          config: { staticVariables: { amount: "17" } },
        },
        fields: {
          sql: "SELECT {{ amount }}",
          requestBody: '{"amount":{{ amount }}}',
        },
        parameters,
      })

      const response = await runQuery(event)

      expect(response.rows).toEqual([{ amount: expected }])
    }
  )

  it.each<ParameterTest>([
    {
      name: "explicit SQL null",
      sql: true,
      parameters: { amount: null },
      expected: null,
    },
    { name: "missing SQL value", sql: true, parameters: {}, expected: "23" },
    {
      name: "empty SQL value",
      sql: true,
      parameters: { amount: "" },
      expected: "23",
    },
    { name: "SQL zero", sql: true, parameters: { amount: 0 }, expected: "23" },
    {
      name: "REST null",
      sql: false,
      parameters: { amount: null },
      expected: null,
    },
  ])(
    "uses nested query defaults appropriately for $name",
    async ({ sql, parameters, expected }) => {
      const event = buildEvent({
        datasource: {
          ...buildEvent().datasource,
          source: SourceName.POSTGRES,
          isSQL: true,
          config: {
            dynamicVariables: [
              {
                name: "lookup",
                queryId: "query_nested",
                value: "{{ data.0.amount }}",
              },
            ],
          },
        },
        fields: { sql: "SELECT {{ amount }}, {{ lookup }}" },
        parameters,
      })
      mockDbGet.mockResolvedValue({
        datasourceId: "ds_nested",
        queryVerb: "read",
        fields: {
          sql: "SELECT {{ amount }}",
          requestBody: '{"amount":{{ amount }}}',
        },
        parameters: [{ name: "amount", default: "23" }],
        transformer: null,
        schema: {},
      })
      jest.mocked(sdk.datasources.get).mockResolvedValue({
        ...buildEvent().datasource,
        _id: "ds_nested",
        source: sql ? SourceName.POSTGRES : SourceName.REST,
        isSQL: sql,
        config: {},
      })

      const response = await runQuery(event)

      expect(response.rows).toEqual([{ amount: expected }])
    }
  )
})
