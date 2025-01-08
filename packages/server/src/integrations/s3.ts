import {
  Integration,
  QueryType,
  IntegrationBase,
  DatasourceFieldType,
  DatasourceFeature,
  ConnectionInfo,
} from "@budibase/types"

import AWS from "aws-sdk"
import csv from "csvtojson"

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
  features: {
    [DatasourceFeature.CONNECTION_CHECKING]: true,
  },
  datasource: {
    region: {
      type: DatasourceFieldType.STRING,
      required: false,
      default: "us-east-1",
    },
    accessKeyId: {
      type: DatasourceFieldType.PASSWORD,
      required: true,
    },
    secretAccessKey: {
      type: DatasourceFieldType.PASSWORD,
      required: true,
    },
    endpoint: {
      type: DatasourceFieldType.STRING,
      required: false,
    },
    signatureVersion: {
      type: DatasourceFieldType.STRING,
      required: false,
      default: "v4",
    },
  },
  query: {
    create: {
      type: QueryType.FIELDS,
      fields: {
        bucket: {
          display: "New Bucket",
          type: DatasourceFieldType.STRING,
          required: true,
        },
        location: {
          required: true,
          default: "us-east-1",
          type: DatasourceFieldType.STRING,
        },
        grantFullControl: {
          display: "Grant full control",
          type: DatasourceFieldType.STRING,
        },
        grantRead: {
          display: "Grant read",
          type: DatasourceFieldType.STRING,
        },
        grantReadAcp: {
          display: "Grant read ACP",
          type: DatasourceFieldType.STRING,
        },
        grantWrite: {
          display: "Grant write",
          type: DatasourceFieldType.STRING,
        },
        grantWriteAcp: {
          display: "Grant write ACP",
          type: DatasourceFieldType.STRING,
        },
      },
    },
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
    },
    readCsv: {
      displayName: "Read CSV",
      type: QueryType.FIELDS,
      readable: true,
      fields: {
        bucket: {
          type: DatasourceFieldType.STRING,
          required: true,
        },
        key: {
          type: DatasourceFieldType.STRING,
          required: true,
        },
      },
    },
    delete: {
      type: QueryType.FIELDS,
      fields: {
        bucket: {
          type: DatasourceFieldType.STRING,
          required: true,
        },
        delete: {
          type: DatasourceFieldType.JSON,
          required: true,
        },
      },
    },
  },
  extra: {
    acl: {
      required: false,
      displayName: "ACL",
      type: DatasourceFieldType.LIST,
      data: {
        create: [
          "private",
          "public-read",
          "public-read-write",
          "authenticated-read",
        ],
      },
    },
  },
}

class S3Integration implements IntegrationBase {
  private readonly config: S3Config
  private client

  constructor(config: S3Config) {
    this.config = config
    if (this.config.endpoint) {
      this.config.s3ForcePathStyle = true
    } else {
      delete this.config.endpoint
    }

    this.client = new AWS.S3(this.config)
  }

  async testConnection() {
    const response: ConnectionInfo = {
      connected: false,
    }
    try {
      await this.client.listBuckets().promise()
      response.connected = true
    } catch (e: any) {
      response.error = e.message as string
    }
    return response
  }

  async create(query: {
    bucket: string
    location: string
    grantFullControl: string
    grantRead: string
    grantReadAcp: string
    grantWrite: string
    grantWriteAcp: string
    extra: {
      acl: string
    }
  }) {
    let params: any = {
      Bucket: query.bucket,
      ACL: query.extra?.acl,
      GrantFullControl: query.grantFullControl,
      GrantRead: query.grantRead,
      GrantReadACP: query.grantReadAcp,
      GrantWrite: query.grantWrite,
      GrantWriteACP: query.grantWriteAcp,
    }
    if (query.location) {
      params["CreateBucketConfiguration"] = {
        LocationConstraint: query.location,
      }
    }
    return await this.client.createBucket(params).promise()
  }

  async read(query: {
    bucket: string
    delimiter: string
    expectedBucketOwner: string
    marker: string
    maxKeys: number
    prefix: string
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

  async readCsv(query: { bucket: string; key: string }) {
    const stream = this.client
      .getObject({
        Bucket: query.bucket,
        Key: query.key,
      })
      .createReadStream()

    let csvError = false
    return new Promise((resolve, reject) => {
      stream.on("error", (err: Error) => {
        reject(err)
      })
      const response = csv()
        .fromStream(stream)
        .on("error", () => {
          csvError = true
        })
      stream.on("finish", () => {
        resolve(response)
      })
    }).catch(err => {
      if (csvError) {
        throw new Error("Could not read CSV")
      } else {
        throw err
      }
    })
  }

  async delete(query: { bucket: string; delete: string }) {
    return await this.client
      .deleteObjects({
        Bucket: query.bucket,
        Delete: JSON.parse(query.delete),
      })
      .promise()
  }
}

export default {
  schema: SCHEMA,
  integration: S3Integration,
}
