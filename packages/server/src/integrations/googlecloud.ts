import {
  Integration,
  QueryType,
  IntegrationBase,
  DatasourceFieldType,
  DatasourceFeature,
  ConnectionInfo,
} from "@budibase/types"
import { Storage } from "@google-cloud/storage"

interface GoogleCloudConfig {
  projectId: string
  privateKey: string
  clientEmail: string

  auth: OAuthClientConfig
  continueSetupId?: string
}

// Move google oauth to util, if they are applicable.
// Interfaces taken from Sheets i
interface OAuthClientConfig {
  appId: string
  accessToken: string
  refreshToken: string
}

const SCHEMA: Integration = {
  docs: "https://googleapis.dev/nodejs/storage/latest",
  auth: {
    type: "google",
  },
  description:
    "Google Cloud Storage is an object storage service that offers industry-leading scalability, data availability, security, and performance.",
  friendlyName: "GoogleCloud Storage",
  type: "Object store",
  features: {
    [DatasourceFeature.CONNECTION_CHECKING]: true,
  },
  datasource: {
    projectId: {
      type: DatasourceFieldType.STRING,
      required: true,
    },
    privateKey: {
      type: DatasourceFieldType.LONGFORM,
      required: true,
    },
    clientEmail: {
      type: DatasourceFieldType.STRING,
      required: true,
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
          type: DatasourceFieldType.SELECT,
          display: "Location",
          default: "US",
          config: {
            options: [
              "ASIA",
              "EU",
              "US"
            ],
          },
        },
        storageClass: {
          required: true,
          type: DatasourceFieldType.SELECT,
          display: "Storage Class",
          default: "STANDARD",
          config: {
            options: [
              "STANDARD",
              "NEARLINE", 
              "COLDLINE",
              "ARCHIVE"	
            ]
          }
        },
        allowPublicAccess: {
          type: DatasourceFieldType.BOOLEAN,
          display: "Allow Public Access",
          default: false
        }
      },
    },
    read: {
      type: QueryType.FIELDS,
      fields: {
        bucket: {
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
          type: DatasourceFieldType.STRING,
          required: true,
        },
      },
    },
  },
}

class GoogleCloudIntegration implements IntegrationBase {
  private readonly config: GoogleCloudConfig
  private storage: any

  constructor(config: GoogleCloudConfig) {
    ;(this.config = config),
      (this.storage = new Storage({
        projectId: this.config.projectId,
        scopes: "https://www.googleapis.com/auth/cloud-platform",
        credentials: {
          client_email: this.config.clientEmail,
          private_key: this.config.privateKey.split(String.raw`\n`).join("\n"),
        },
      }))
  }

  async testConnection() {
    const response: ConnectionInfo = {
      connected: false,
    }
    try {
      await this.connect()
      return { connected: true }
    } catch (e: any) {
      return {
        connected: false,
        error: e.message as string,
      }
    }
  }

  async connect() {
    await this.storage.getBuckets()
  }

  async read(query: { bucket: string }) {
    const bucket = this.storage.bucket(query.bucket)
    // Does support paging. Could possibly use this feature
    const [files, queryForPage2] = await bucket.getFiles({
      autoPaginate: false,
    })
    return files.map((file: any) => file.metadata)
  }

  async delete(query: { bucket: string; delete: string }) {
    return await this.storage.bucket(query.bucket).file(query.delete).delete();
  }

  
  async create(query: { bucket: string, location: string, storageClass: string, allowPublicAccess: boolean}) {
    let [newBucket] = await this.storage.createBucket(query.bucket, {
      // http://g.co/cloud/storage/docs/locations#location-mr
      // ASIA, EU, US
      location: query.location,
      // https://cloud.google.com/storage/docs/storage-classes
      [query.storageClass]: true,
    });
    if(query.allowPublicAccess === true && newBucket){
      await this.storage.bucket(query.bucket).makePublic()
    }
    return newBucket
  }
}

export default {
  schema: SCHEMA,
  integration: GoogleCloudIntegration,
}
