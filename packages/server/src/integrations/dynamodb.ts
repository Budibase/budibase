import {
  Integration,
  DatasourceFieldTypes,
  QueryTypes,
} from "../definitions/datasource"

module DynamoModule {
  const AWS = require("aws-sdk")
  const { AWS_REGION } = require("../db/dynamoClient")

  interface DynamoDBConfig {
    region: string
    accessKeyId: string
    secretAccessKey: string
    endpoint: string
  }

  const SCHEMA: Integration = {
    docs: "https://github.com/dabit3/dynamodb-documentclient-cheat-sheet",
    description:
      "Amazon DynamoDB is a key-value and document database that delivers single-digit millisecond performance at any scale.",
    friendlyName: "DynamoDB",
    datasource: {
      region: {
        type: DatasourceFieldTypes.STRING,
        required: true,
        default: "us-east-1",
      },
      accessKeyId: {
        type: DatasourceFieldTypes.PASSWORD,
        required: true,
      },
      secretAccessKey: {
        type: DatasourceFieldTypes.PASSWORD,
        required: true,
      },
      endpoint: {
        type: DatasourceFieldTypes.STRING,
        required: false,
        default: "https://dynamodb.us-east-1.amazonaws.com",
      },
    },
    query: {
      create: {
        type: QueryTypes.FIELDS,
        customisable: true,
        fields: {
          table: {
            type: DatasourceFieldTypes.STRING,
            required: true,
          },
        },
      },
      read: {
        type: QueryTypes.FIELDS,
        customisable: true,
        readable: true,
        fields: {
          table: {
            type: DatasourceFieldTypes.STRING,
            required: true,
          },
          index: {
            type: DatasourceFieldTypes.STRING,
          },
        },
      },
      scan: {
        type: QueryTypes.FIELDS,
        customisable: true,
        readable: true,
        fields: {
          table: {
            type: DatasourceFieldTypes.STRING,
            required: true,
          },
          index: {
            type: DatasourceFieldTypes.STRING,
          },
        },
      },
      get: {
        type: QueryTypes.FIELDS,
        customisable: true,
        readable: true,
        fields: {
          table: {
            type: DatasourceFieldTypes.STRING,
            required: true,
          },
        },
      },
      update: {
        type: QueryTypes.FIELDS,
        customisable: true,
        fields: {
          table: {
            type: DatasourceFieldTypes.STRING,
            required: true,
          },
        },
      },
      delete: {
        type: QueryTypes.FIELDS,
        customisable: true,
        fields: {
          table: {
            type: DatasourceFieldTypes.STRING,
            required: true,
          },
        },
      },
    },
  }

  class DynamoDBIntegration {
    private config: DynamoDBConfig
    private client: any

    constructor(config: DynamoDBConfig) {
      this.config = config
      this.connect()
      let options = {
        correctClockSkew: true,
        endpoint: config.endpoint ? config.endpoint : undefined,
      }
      this.client = new AWS.DynamoDB.DocumentClient(options)
    }

    end() {
      this.disconnect()
    }

    connect() {
      AWS.config.update(this.config)
    }

    disconnect() {
      AWS.config.update({
        secretAccessKey: undefined,
        accessKeyId: undefined,
        region: AWS_REGION,
      })
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
      if (query.index) {
        const response = await this.client.query(params).promise()
        if (response.Items) {
          return response.Items
        }
        return response
      }
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
