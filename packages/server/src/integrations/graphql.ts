import {
  DatasourceFieldType,
  Integration,
  IntegrationBase,
  QueryType,
} from "@budibase/types"
import { GraphQLClient } from "graphql-request"
import { performance } from "perf_hooks"

interface GraphQLConfig {
  endpoint: string
  headers?: { [key: string]: string }
  enableIntrospection?: boolean
}

interface GraphQLQuery {
  query: string
  variables?: string
  operationName?: string
}

interface ParsedResponse {
  data: any
  info: {
    code: number
    size: string
    time: string
  }
  extra?: {
    raw: string
    headers: Record<string, string>
  }
}

const INTROSPECTION_QUERY = `
  query IntrospectionQuery {
    __schema {
      queryType { name }
      mutationType { name }
      subscriptionType { name }
      types {
        ...FullType
      }
    }
  }

  fragment FullType on __Type {
    kind
    name
    description
    fields(includeDeprecated: true) {
      name
      description
      args {
        ...InputValue
      }
      type {
        ...TypeRef
      }
      isDeprecated
      deprecationReason
    }
    inputFields {
      ...InputValue
    }
    interfaces {
      ...TypeRef
    }
    enumValues(includeDeprecated: true) {
      name
      description
      isDeprecated
      deprecationReason
    }
    possibleTypes {
      ...TypeRef
    }
  }

  fragment InputValue on __InputValue {
    name
    description
    type { ...TypeRef }
    defaultValue
  }

  fragment TypeRef on __Type {
    kind
    name
    ofType {
      kind
      name
      ofType {
        kind
        name
        ofType {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
                ofType {
                  kind
                  name
                }
              }
            }
          }
        }
      }
    }
  }
`

const SCHEMA: Integration = {
  docs: "https://graphql.org/",
  description:
    "GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data. Connect to any GraphQL endpoint to query and mutate data.",
  friendlyName: "GraphQL",
  type: "API",
  datasource: {
    endpoint: {
      type: DatasourceFieldType.STRING,
      required: true,
      display: "GraphQL Endpoint URL",
    },
    headers: {
      type: DatasourceFieldType.OBJECT,
      required: false,
      display: "Headers",
    },
    enableIntrospection: {
      type: DatasourceFieldType.BOOLEAN,
      required: false,
      default: true,
      display: "Enable Schema Introspection",
    },
  },
  query: {
    query: {
      displayName: "Query",
      readable: true,
      type: QueryType.FIELDS,
      fields: {
        query: {
          type: DatasourceFieldType.CODE,
          required: true,
          display: "GraphQL Query",
        },
        variables: {
          type: DatasourceFieldType.JSON,
          required: false,
          display: "Variables (JSON)",
        },
        operationName: {
          type: DatasourceFieldType.STRING,
          required: false,
          display: "Operation Name",
        },
      },
    },
  },
}

export class GraphQLIntegration implements IntegrationBase {
  private config: GraphQLConfig
  private client: GraphQLClient
  private startTimeMs: number = performance.now()

  constructor(config: GraphQLConfig) {
    this.config = config
    this.client = new GraphQLClient(config.endpoint, {
      headers: config.headers || {},
    })
  }

  private parseVariables(variables?: string): Record<string, any> | undefined {
    if (!variables || variables.trim() === "") {
      return undefined
    }

    try {
      return JSON.parse(variables)
    } catch (error: any) {
      throw new Error(`Invalid JSON in variables: ${error.message}`)
    }
  }

  private formatResponse(data: any, error?: any): ParsedResponse {
    const endTime = performance.now()
    const time = `${Math.round(endTime - this.startTimeMs)}ms`
    const responseData = JSON.stringify(data || error || {})
    const size = `${responseData.length} bytes`

    if (error) {
      return {
        data: null,
        info: {
          code: error.response?.status || 400,
          size,
          time,
        },
        extra: {
          raw: JSON.stringify(error, null, 2),
          headers: error.response?.headers || {},
        },
      }
    }

    return {
      data,
      info: {
        code: 200,
        size,
        time,
      },
      extra: {
        raw: JSON.stringify(data, null, 2),
        headers: {},
      },
    }
  }

  async query(opts: GraphQLQuery): Promise<ParsedResponse> {
    this.startTimeMs = performance.now()

    try {
      const variables = this.parseVariables(opts.variables)

      const data = await this.client.request(opts.query, variables)

      return this.formatResponse(data)
    } catch (error: any) {
      if (error.response?.errors) {
        const graphqlErrors = error.response.errors
        const errorMessage = graphqlErrors
          .map((err: any) => err.message)
          .join(", ")

        throw new Error(`GraphQL Error: ${errorMessage}`)
      }

      throw new Error(`GraphQL Request Failed: ${error.message}`)
    }
  }

  async getSchema(): Promise<any> {
    if (!this.config.enableIntrospection) {
      throw new Error("Schema introspection is disabled for this datasource")
    }

    this.startTimeMs = performance.now()

    try {
      const data: any = await this.client.request(INTROSPECTION_QUERY)
      return data.__schema
    } catch (error: any) {
      throw new Error(`Schema introspection failed: ${error.message}`)
    }
  }

  async testConnection(): Promise<{ connected: boolean; error?: string }> {
    try {
      if (this.config.enableIntrospection) {
        await this.getSchema()
      } else {
        await this.client.request("{ __typename }")
      }
      return { connected: true }
    } catch (error: any) {
      return {
        connected: false,
        error: error.message,
      }
    }
  }
}

export default {
  schema: SCHEMA,
  integration: GraphQLIntegration,
}
