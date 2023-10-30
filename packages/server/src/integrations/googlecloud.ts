import {
  Integration,
  QueryType,
  IntegrationBase,
  DatasourceFieldType,
  DatasourceFeature,
  ConnectionInfo,
} from "@budibase/types"
import { Storage } from "@google-cloud/storage"
import { OAuth2Client, auth } from "google-auth-library"
import { configs, cache, context, HTTPError } from "@budibase/backend-core"

/*
  Auth Type 
    Service Account
    OAuth2 using https://www.googleapis.com/auth/cloud-platform
*/

interface GoogleCloudConfig {
  //type: string, //service-account
  projectId: string
  // privateKeyId: string
  privateKey: string
  clientEmail: string
  // clientId: string

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

interface AuthTokenRequest {
  client_id: string
  client_secret: string
  refresh_token: string
}

interface AuthTokenResponse {
  access_token: string
}

const SCHEMA: Integration = {
  // docs: "https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html",
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
  //dependsOn
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
    read: {
      type: QueryType.FIELDS,
      fields: {
        bucket: {
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
    /*
      Other features 
        Self host option keyfilename
        WIF - workload identity federation.
    */

    await this.storage.getBuckets()
  }

  async read(query: { bucket: string }) {
    const bucket = this.storage.bucket(query.bucket)
    // Does support paging. Could possibly
    const [files, queryForPage2] = await bucket.getFiles({
      autoPaginate: false,
    })
    return files.map((file: any) => file.metadata)
  }
}

export default {
  schema: SCHEMA,
  integration: GoogleCloudIntegration,
}
