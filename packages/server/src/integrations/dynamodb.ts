import {
  Integration,
  DatasourceFieldType,
  QueryType,
  IntegrationBase,
} from "@budibase/types"

module DynamoModule {
  const AWS = require("aws-sdk")
  const { AWS_REGION } = require("../db/dynamoClient")

  interface DynamoDBConfig {
    region: string
    accessKeyId: string
    secretAccessKey: string
    endpoint?: string
    currentClockSkew?: boolean
  }

  const SCHEMA: Integration = {
    docs: "https://github.com/dabit3/dynamodb-documentclient-cheat-sheet",
    description:
      "Amazon DynamoDB is a key-value and document database that delivers single-digit millisecond performance at any scale.",
    friendlyName: "DynamoDB",
    type: "Non-relational",
    datasource: {
      region: {
        type: DatasourceFieldType.STRING,
        required: true,
        default: "us-east-1",
      },
      accessKeyId: {
        type: DatasourceFieldType.PASSWORD,
        required: true,
      },
      secretAccessKey: {
        type: DatasourceFieldType.PASSWORD,
        required: true,
      },
      endpoint: {
        type: DatasourceFieldType.STRING,
        required: false,
        default: "https://dynamodb.us-east-1.amazonaws.com",
      },
    },
    query: {
      create: {
        type: QueryType.FIELDS,
        customisable: true,
        fields: {
          table: {
            type: DatasourceFieldType.STRING,
            required: true,
          },
        },
      },
      read: {
        type: QueryType.FIELDS,
        customisable: true,
        readable: true,
        fields: {
          table: {
            type: DatasourceFieldType.STRING,
            required: true,
          },
          index: {
            type: DatasourceFieldType.STRING,
          },
        },
      },
      scan: {
        type: QueryType.FIELDS,
        customisable: true,
        readable: true,
        fields: {
          table: {
            type: DatasourceFieldType.STRING,
            required: true,
          },
          index: {
            type: DatasourceFieldType.STRING,
          },
        },
      },
      describe: {
        type: QueryType.FIELDS,
        customisable: true,
        readable: true,
        fields: {
          table: {
            type: DatasourceFieldType.STRING,
            required: true,
          },
        },
      },
      get: {
        type: QueryType.FIELDS,
        customisable: true,
        readable: true,
        fields: {
          table: {
            type: DatasourceFieldType.STRING,
            required: true,
          },
        },
      },
      update: {
        type: QueryType.FIELDS,
        customisable: true,
        fields: {
          table: {
            type: DatasourceFieldType.STRING,
            required: true,
          },
        },
      },
      delete: {
        type: QueryType.FIELDS,
        customisable: true,
        fields: {
          table: {
            type: DatasourceFieldType.STRING,
            required: true,
          },
        },
      },
    },
  }

  class DynamoDBIntegration implements IntegrationBase {
    private config: DynamoDBConfig
    private client: any

    constructor(config: DynamoDBConfig) {
      this.config = config

      // User is using a local dynamoDB endpoint, don't auth with remote
      if (this.config?.endpoint?.includes("localhost")) {
        // @ts-ignore
        this.config = {}
      }

      this.config = {
        ...this.config,
        currentClockSkew: true,
        region: config.region || AWS_REGION,
        endpoint: config.endpoint || undefined,
      }
      this.client = new AWS.DynamoDB.DocumentClient(this.config)
    }

    async create(query: { table: string; json: object }) {
      const params = {
        TableName: query.table,
        ...query.json,
      }
      return this.client.put(params).promise()
    }

    async read(query: { table: string; json: object; index: null | string }) {
      const params = {
        TableName: query.table,
        IndexName: query.index ? query.index : undefined,
        ...query.json,
      }
      const response = await this.client.query(params).promise()
      if (response.Items) {
        return response.Items
      }
      return response
    }

    async scan(query: { table: string; json: object; index: null | string }) {
      const params = {
        TableName: query.table,
        IndexName: query.index ? query.index : undefined,
        ...query.json,
      }
      const response = await this.client.scan(params).promise()
      if (response.Items) {
        return response.Items
      }
      return response
    }

    async describe(query: { table: string }) {
      const params = {
        TableName: query.table,
      }
      return new AWS.DynamoDB(this.config).describeTable(params).promise()
    }

    async get(query: { table: string; json: object }) {
      const params = {
        TableName: query.table,
        ...query.json,
      }
      return this.client.get(params).promise()
    }

    async update(query: { table: string; json: object }) {
      const params = {
        TableName: query.table,
        ...query.json,
      }
      return this.client.update(params).promise()
    }

    async delete(query: { table: string; json: object }) {
      const params = {
        TableName: query.table,
        ...query.json,
      }
      return this.client.delete(params).promise()
    }
  }

  module.exports = {
    schema: SCHEMA,
    integration: DynamoDBIntegration,
  }
}
