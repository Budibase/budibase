const AWS = require("aws-sdk")

const SCHEMA = {
  datasource: {
    region: {
      type: "string",
      required: true,
      default: "us-east-1",
    },
    accessKeyId: {
      type: "password",
      required: true,
    },
    secretAccessKey: {
      type: "password",
      required: true,
    },
  },
  query: {
    read: {
      Bucket: {
        type: "fields",
        fields: {
          bucket: {
            type: "string",
            required: true,
          },
        },
      },
    },
  },
}

class S3Integration {
  constructor(config) {
    this.config = config
    this.connect()
    this.client = new AWS.S3()
  }

  async connect() {
    AWS.config.update(this.config)
  }

  async read(query) {
    const response = await this.client
      .listObjects({
        Bucket: query.bucket,
      })
      .promise()
    return response.Contents
  }
}

module.exports = {
  schema: SCHEMA,
  integration: S3Integration,
}
