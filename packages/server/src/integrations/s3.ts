import { Integration, QueryType, IntegrationBase, DatasourceFieldType } from "@budibase/types"

module S3Module {
  const AWS = require("aws-sdk")

  interface S3Config {
    region: string
    accessKeyId: string
    secretAccessKey: string
    s3ForcePathStyle: boolean
    endpoint?: string
  }

  const SCHEMA: Integration = {
    docs: "https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html",
    description:
      "Amazon Simple Storage Service (Amazon S3) is an object storage service that offers industry-leading scalability, data availability, security, and performance.",
    friendlyName: "Amazon S3",
    type: "Object store",
    datasource: {
      region: {
        type: "string",
        required: false,
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
      endpoint: {
        type: "string",
        required: false,
      },
      signatureVersion: {
        type: "string",
        required: false,
        default: "v4",
      },
    },
    query: {
      read: {
        type: QueryType.FIELDS,
        fields: {
          bucket: {
            type: DatasourceFieldType.STRING,
            required: true,
          },
          delimiter: {
            type: DatasourceFieldType.STRING,
          },
          marker: {
            type: DatasourceFieldType.STRING,
          },
          maxKeys: {
            type: DatasourceFieldType.NUMBER,
            display: "Max Keys",
          },
          prefix: {
            type: DatasourceFieldType.STRING,
          },
        },
      }
    }
  }

  class S3Integration implements IntegrationBase {
    private readonly config: S3Config
    private client: any

    constructor(config: S3Config) {
      this.config = config
      if (this.config.endpoint) {
        this.config.s3ForcePathStyle = true
      } else {
        delete this.config.endpoint
      }

      this.client = new AWS.S3(this.config)
    }

    async read(query: { 
      bucket: string, 
      delimiter: string, 
      expectedBucketOwner: string, 
      marker: string, 
      maxKeys: number, 
      prefix: string, 
    }) {
      const response = await this.client
        .listObjects({
          Bucket: query.bucket,
          Delimiter: query.delimiter,
          Marker: query.marker,
          MaxKeys: query.maxKeys,
          Prefix: query.prefix,
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
