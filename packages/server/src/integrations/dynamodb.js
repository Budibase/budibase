const AWS = require("aws-sdk")
const { FIELD_TYPES, QUERY_TYPES } = require("./Integration")

const SCHEMA = {
  docs: "https://github.com/dabit3/dynamodb-documentclient-cheat-sheet",
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
    create: {
      type: QUERY_TYPES.FIELDS,
      fields: {
        table: {
          type: FIELD_TYPES.STRING,
          required: true,
        },
        customisable: true,
      },
    },
    read: {
      type: QUERY_TYPES.FIELDS,
      fields: {
        table: {
          type: FIELD_TYPES.STRING,
          required: true,
        },
        index: {
          type: FIELD_TYPES.STRING,
        },
        customisable: true,
      },
    },
    update: {
      type: QUERY_TYPES.FIELDS,
      fields: {
        table: {
          type: FIELD_TYPES.STRING,
          required: true,
        },
        customisable: true,
      },
    },
    delete: {
      type: QUERY_TYPES.FIELDS,
      fields: {
        table: {
          type: FIELD_TYPES.STRING,
          required: true,
        },
        key: {
          type: FIELD_TYPES.STRING,
          required: true,
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

  async create(query) {
    const response = await this.client.query({
      TableName: query.table,
      Item: query.json,
    })
    return response
  }

  async read(query) {
    const response = await this.client.query({
      TableName: query.Table,
      ...query.json,
    })
    return response
  }

  async update(query) {
    const response = await this.client.query({
      TableName: query.Table,
      ...query.json,
    })
    return response
  }

  async delete(query) {
    const response = await this.client.query({
      TableName: query.Table,
      Key: {
        id: query.key,
      },
    })
    return response
  }
}

module.exports = {
  schema: SCHEMA,
  integration: DynamoDBIntegration,
}
