import { Integration, QueryTypes } from "../definitions/datasource"

module S3Module {
  const AWS = require("aws-sdk")

  interface S3Config {
    region: string
    accessKeyId: string
    secretAccessKey: string
  }

  const SCHEMA: Integration = {
    docs: "https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html",
    description:
      "Amazon Simple Storage Service (Amazon S3) is an object storage service that offers industry-leading scalability, data availability, security, and performance.",
    friendlyName: "Amazon S3",
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
        type: QueryTypes.FIELDS,
        fields: {
          bucket: {
            type: "string",
            required: true,
          },
        },
      },
    },
  }

  class S3Integration {
    private readonly config: S3Config
    private client: any
    private connectionPromise: Promise<any>

    constructor(config: S3Config) {
      this.config = config
      this.connectionPromise = this.connect()
      this.client = new AWS.S3()
    }

    async connect() {
      AWS.config.update(this.config)
    }

    async read(query: { bucket: string }) {
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
}
