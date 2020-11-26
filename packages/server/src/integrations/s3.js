const AWS = require("aws-sdk")

const S3_OPTIONS = {
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
    type: "secretKey",
    required: true,
    default: 5432,
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
  schema: S3_OPTIONS,
  integration: S3Integration,
}
