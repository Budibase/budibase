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
    endpoint: {
      type: FIELD_TYPES.STRING,
      required: false,
      default: "https://dynamodb.us-east-1.amazonaws.com",
    },
  },
  query: {
    create: {
      type: QUERY_TYPES.FIELDS,
      customisable: true,
      fields: {
        table: {
          type: FIELD_TYPES.STRING,
          required: true,
        },
      },
    },
    read: {
      type: QUERY_TYPES.FIELDS,
      customisable: true,
      readable: true,
      fields: {
        table: {
          type: FIELD_TYPES.STRING,
          required: true,
        },
        index: {
          type: FIELD_TYPES.STRING,
        },
      },
    },
    scan: {
      type: QUERY_TYPES.FIELDS,
      customisable: true,
      readable: true,
      fields: {
        table: {
          type: FIELD_TYPES.STRING,
          required: true,
        },
        index: {
          type: FIELD_TYPES.STRING,
        },
      },
    },
    get: {
      type: QUERY_TYPES.FIELDS,
      customisable: true,
      readable: true,
      fields: {
        table: {
          type: FIELD_TYPES.STRING,
          required: true,
        },
      },
    },
    update: {
      type: QUERY_TYPES.FIELDS,
      customisable: true,
      fields: {
        table: {
          type: FIELD_TYPES.STRING,
          required: true,
        },
      },
    },
    delete: {
      type: QUERY_TYPES.FIELDS,
      customisable: true,
      fields: {
        table: {
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
    let options = {
      correctClockSkew: true,
    }
    if (config.endpoint) {
      options.endpoint = config.endpoint
    }
    this.client = new AWS.DynamoDB.DocumentClient({
      correctClockSkew: true,
    })
  }

  async connect() {
    AWS.config.update(this.config)
  }

  async create(query) {
    const params = {
      TableName: query.table,
      ...query.json,
    }
    return this.client.put(params).promise()
  }

  async read(query) {
    const params = {
      TableName: query.table,
      ...query.json,
    }
    if (query.index) {
      params.IndexName = query.index
    }
    const response = await this.client.query(params).promise()
    if (response.Items) {
      return response.Items
    }
    return response
  }

  async scan(query) {
    const params = {
      TableName: query.table,
      ...query.json,
    }
    if (query.index) {
      params.IndexName = query.index
    }
    const response = await this.client.scan(params).promise()
    if (response.Items) {
      return response.Items
    }
    return response
  }

  async get(query) {
    const params = {
      TableName: query.table,
      ...query.json,
    }
    return this.client.get(params).promise()
  }

  async update(query) {
    const params = {
      TableName: query.Table,
      ...query.json,
    }
    return this.client.update(params).promise()
  }

  async delete(query) {
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
