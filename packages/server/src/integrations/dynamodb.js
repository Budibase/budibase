const AWS = require("aws-sdk")

const DYNAMODB_OPTIONS = {
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
  keyConditionExpression: {
    type: "string",
    required: true,
  },
  attributeNames: {
    type: "object",
    required: true,
  },
  attributeValues: {
    type: "object",
    required: true,
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
      KeyConditionExpression: this.config.keyConditionExpression,
      ExpressionAttributeNames: this.config.attributeNames,
      ExpressionAttributeValues: this.config.attributeValues,
    })
    return response
  }
}

module.exports = {
  schema: DYNAMODB_OPTIONS,
  integration: DynamoDBIntegration,
}
