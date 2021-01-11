const AWS = require("aws-sdk")

const SCHEMA = {
  datasource: {
    bucket: {
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
    secretAccessKey: {
      type: "string",
      required: true,
    },
  },
  query: {},
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

  async query() {
    const response = await this.client
      .listObjects({
        Bucket: this.config.bucket,
      })
      .promise()
    return response.Contents
  }
}

module.exports = {
  schema: SCHEMA,
  integration: S3Integration,
}
