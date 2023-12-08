import {
  Integration,
  QueryType,
  IntegrationBase,
  DatasourceFieldType,
  DatasourceFeature,
  ConnectionInfo,
} from "@budibase/types"

import { BlobServiceClient } from "@azure/storage-blob"

interface AzureBlobStorageConfig {
  accountName: string
  accountKey: string
}

const SCHEMA: Integration = {
  docs: "https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blobs-introduction",
  description:
    "Azure Blob Storage is Microsoft's object storage solution for the cloud.",
  friendlyName: "Azure Blob Storage",
  type: "Object store",
  features: {
    [DatasourceFeature.CONNECTION_CHECKING]: true,
  },
  datasource: {
    accountName: {
      type: DatasourceFieldType.STRING,
      required: true,
      display: "Account name",
    },
    accountKey: {
      type: DatasourceFieldType.PASSWORD,
      required: true,
      display: "Account key",
    },
  },
  query: {
    create: {
      type: QueryType.FIELDS,
      fields: {
        containerName: {
          display: "Container name",
          type: DatasourceFieldType.STRING,
          required: true,
        },
      },
    },
    read: {
      type: QueryType.FIELDS,
      fields: {
        containerName: {
          display: "Container name",
          type: DatasourceFieldType.STRING,
          required: true,
        },
      },
    },
    delete: {
      type: QueryType.FIELDS,
      fields: {
        containerName: {
          display: "Container name",
          type: DatasourceFieldType.STRING,
          required: true,
        },
        blobName: {
          display: "Blob name",
          type: DatasourceFieldType.STRING,
          required: true,
        },
      },
    },
  },
}

class AzureBlobIntegration implements IntegrationBase {
  private readonly blobServiceClient: BlobServiceClient

  constructor(config: AzureBlobStorageConfig) {
    this.blobServiceClient = BlobServiceClient.fromConnectionString(
      `DefaultEndpointsProtocol=https;AccountName=${config.accountName};AccountKey=${config.accountKey};EndpointSuffix=core.windows.net`
    )
  }

  async testConnection() {
    const response: ConnectionInfo = {
      connected: false,
    }
    try {
      await this.blobServiceClient.getProperties()
      response.connected = true
    } catch (e: any) {
      response.error = e.message as string
    }
    return response
  }

  async create(query: { containerName: string }) {
    const containerClient = this.blobServiceClient.getContainerClient(
      query.containerName
    )
    return await containerClient.create()
  }

  async read(query: { containerName: string }) {
    const containerClient = this.blobServiceClient.getContainerClient(
      query.containerName
    )
    let blobs = []
    for await (const blob of containerClient.listBlobsFlat()) {
      // Get Blob Client from name, to get the URL
      const blobClient = containerClient.getBlockBlobClient(blob.name)
      blobs.push({
        name: blob.name,
        ...blob.properties,
        url: blobClient.url,
      })
    }
    return blobs
  }

  async delete(query: { containerName: string; blobName: string }) {
    const containerClient = this.blobServiceClient.getContainerClient(
      query.containerName
    )
    const blockBlobClient = containerClient.getBlockBlobClient(query.blobName)
    return await blockBlobClient.delete()
  }
}

export default {
  schema: SCHEMA,
  integration: AzureBlobIntegration,
}
