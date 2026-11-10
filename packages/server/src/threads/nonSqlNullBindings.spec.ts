jest.mock("../integrations", () => ({
  getIntegration: jest.fn(),
}))

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    context: {
      ...actual.context,
      doInWorkspaceContext: jest.fn((_appId: string, fn: () => Promise<void>) =>
        fn()
      ),
      getEnvironmentVariables: jest.fn(() => ({})),
    },
  }
})

jest.mock("../sdk", () => ({
  __esModule: true,
  default: {
    queries: jest.requireActual("../sdk/workspace/queries/queries"),
  },
}))

jest.mock("./utils", () => {
  const actual = jest.requireActual("./utils")
  return {
    __esModule: true,
    ...actual,
    default: { ...actual.default, threadSetup: jest.fn() },
  }
})

import { SourceName, type JSONValue } from "@budibase/types"
import { getIntegration } from "../integrations"
import type { QueryEvent, QueryResponse } from "./definitions"
import { execute } from "./query"

interface ConnectorCase {
  source: SourceName
  fields: Record<string, JSONValue>
  expected: Record<string, JSONValue>
}

const template =
  '{"value":{{ value }},"text":"{{ text }}","zero":{{ zero }},"disabled":{{ disabled }}}'
const payload = { value: null, text: "null", zero: 0, disabled: false }

const jsonConnectors = [
  SourceName.MONGODB,
  SourceName.DYNAMODB,
  SourceName.ELASTICSEARCH,
  SourceName.COUCHDB,
  SourceName.FIRESTORE,
  SourceName.AIRTABLE,
]

const connectors: ConnectorCase[] = [
  ...jsonConnectors.map(source => ({
    source,
    fields: { json: template },
    expected: { json: payload },
  })),
  {
    source: SourceName.REST,
    fields: { path: "https://example.com", requestBody: template },
    expected: {
      path: "https://example.com",
      rawPath: "https://example.com",
      requestBody: payload,
      json: payload,
    },
  },
  {
    source: SourceName.GOOGLE_SHEETS,
    fields: { sheet: "Sheet1", row: template },
    expected: { sheet: "Sheet1", row: payload },
  },
  {
    source: SourceName.S3,
    fields: {
      bucket: "example",
      prefix: "{{ value }}",
      marker: "{{ text }}",
      maxKeys: "{{ zero }}",
    },
    expected: { bucket: "example", prefix: "", marker: "null", maxKeys: "0" },
  },
  {
    source: SourceName.REDIS,
    fields: { key: "key-{{ text }}", value: "{{ value }}", ttl: "{{ zero }}" },
    expected: { key: "key-null", value: "", ttl: "0" },
  },
]

describe("non-SQL connector parameter bindings", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(getIntegration).mockResolvedValue(async () => ({
      read: async (query: Record<string, JSONValue>) => [query],
    }))
  })

  it.each(connectors)(
    "passes native JSON values and existing text coercion to $source",
    async ({ source, fields, expected }) => {
      const event: QueryEvent = {
        appId: "app_test",
        datasource: {
          name: "Test datasource",
          type: "datasource",
          source,
          isSQL: false,
          config: { staticVariables: { value: "fallback" } },
        },
        queryVerb: "read",
        fields,
        parameters: { value: null, text: "null", zero: 0, disabled: "false" },
        transformer: null,
        schema: {},
        nullDefaultSupport: false,
      }
      const result = await new Promise<QueryResponse>((resolve, reject) => {
        execute(event, (err, response) => {
          if (err) {
            reject(err)
          } else {
            resolve(response)
          }
        })
      })

      expect(result.rows).toEqual([expected])
    }
  )
})
