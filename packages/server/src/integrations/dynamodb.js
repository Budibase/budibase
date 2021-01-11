const AWS = require("aws-sdk")

const SCHEMA = {
  datasource: {
    table: {
      type: "string",
      required: true,
    },
    region: {
      type: "string",
      required: true,
      default: "us-east-1",
    },
    accessKeyId: {
      type: "string",
      required: true,
    },
    secretKey: {
      type: "secretKey",
      required: true,
      default: 5432,
    },
    indexName: {
      type: "string",
    },
  },
  query: {
    type: "fields",
    fields: [
      {
        name: "Index",
        key: "Index",
        type: "string",
      },
      {
        name: "Key Condition Expression",
        key: "KeyConditionExpression",
        type: "string",
      },
      {
        name: "Attribute Names",
        key: "ExpressionAttributeNames",
        type: "string",
      },
      {
        name: "Attribute Values",
        key: "ExpressionAttributeValues",
        type: "string",
      },
    ],
  },
}

class DynamoDBIntegration {
  constructor(config) {
    this.config = config
    this.connect()
    this.client = new AWS.DynamoDB.DocumentClient()
  }

  async connect() {
    AWS.config.update(this.config)
  }

  async query() {
    const response = await this.client.query({
      TableName: this.config.table,
      KeyConditionExpression: this.config.KeyConditionExpression,
      ExpressionAttributeNames: this.config.ExpressionAttributeNames,
      ExpressionAttributeValues: this.config.ExpressionAttributeValues,
    })
    return response
  }
}

module.exports = {
  schema: SCHEMA,
  integration: DynamoDBIntegration,
}
