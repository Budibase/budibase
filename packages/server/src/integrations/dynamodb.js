const AWS = require("aws-sdk")
const { FIELD_TYPES, QUERY_TYPES } = require("./Integration")

const SCHEMA = {
  datasource: {
    region: {
      type: FIELD_TYPES.STRING,
      required: true,
      default: "us-east-1",
    },
    accessKeyId: {
      type: FIELD_TYPES.PASSWORD,
      required: true,
    },
    secretKey: {
      type: FIELD_TYPES.PASSWORD,
      required: true,
    },
  },
  query: {
    read: {
      DynamoConfig: {
        type: QUERY_TYPES.FIELDS,
        fields: {
          Table: {
            type: FIELD_TYPES.STRING,
            required: true,
          },
          Index: {
            type: FIELD_TYPES.STRING,
          },
          KeyConditionExpression: {
            type: FIELD_TYPES.STRING,
          },
          ExpressionAttributeNames: {
            type: FIELD_TYPES.STRING,
          },
          ExpressionAttributeValues: {
            type: FIELD_TYPES.STRING,
          },
        },
      },
    },
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

  async read(query) {
    const response = await this.client.query({
      TableName: query.Table,
      KeyConditionExpression: query.KeyConditionExpression,
      ExpressionAttributeNames: query.ExpressionAttributeNames,
      ExpressionAttributeValues: query.ExpressionAttributeValues,
    })
    return response
  }
}

module.exports = {
  schema: SCHEMA,
  integration: DynamoDBIntegration,
}
