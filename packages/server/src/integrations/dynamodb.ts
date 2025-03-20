import {
  Integration,
  DatasourceFieldType,
  QueryType,
  IntegrationBase,
  DatasourceFeature,
  ConnectionInfo,
} from "@budibase/types"

import {
  DynamoDBDocument,
  PutCommandInput,
  GetCommandInput,
  UpdateCommandInput,
  DeleteCommandInput,
} from "@aws-sdk/lib-dynamodb"
import { DynamoDB, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb"
import { AWS_REGION } from "../constants"

export interface DynamoDBConfig {
  region: string
  accessKeyId: string
  secretAccessKey: string
  endpoint?: string
}

const SCHEMA: Integration = {
  docs: "https://github.com/dabit3/dynamodb-documentclient-cheat-sheet",
  description:
    "Amazon DynamoDB is a key-value and document database that delivers single-digit millisecond performance at any scale.",
  friendlyName: "DynamoDB",
  type: "Non-relational",
  features: {
    [DatasourceFeature.CONNECTION_CHECKING]: true,
  },
  datasource: {
    region: {
      type: DatasourceFieldType.STRING,
      required: true,
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
      default: "https://dynamodb.us-east-1.amazonaws.com",
    },
  },
  query: {
    create: {
      type: QueryType.FIELDS,
      customisable: true,
      fields: {
        table: {
          type: DatasourceFieldType.STRING,
          required: true,
        },
      },
    },
    read: {
      type: QueryType.FIELDS,
      customisable: true,
      readable: true,
      fields: {
        table: {
          type: DatasourceFieldType.STRING,
          required: true,
        },
        index: {
          type: DatasourceFieldType.STRING,
        },
      },
    },
    scan: {
      type: QueryType.FIELDS,
      customisable: true,
      readable: true,
      fields: {
        table: {
          type: DatasourceFieldType.STRING,
          required: true,
        },
        index: {
          type: DatasourceFieldType.STRING,
        },
      },
    },
    describe: {
      type: QueryType.FIELDS,
      customisable: true,
      readable: true,
      fields: {
        table: {
          type: DatasourceFieldType.STRING,
          required: true,
        },
      },
    },
    get: {
      type: QueryType.FIELDS,
      customisable: true,
      readable: true,
      fields: {
        table: {
          type: DatasourceFieldType.STRING,
          required: true,
        },
      },
    },
    update: {
      type: QueryType.FIELDS,
      customisable: true,
      fields: {
        table: {
          type: DatasourceFieldType.STRING,
          required: true,
        },
      },
    },
    delete: {
      type: QueryType.FIELDS,
      customisable: true,
      fields: {
        table: {
          type: DatasourceFieldType.STRING,
          required: true,
        },
      },
    },
  },
}

export class DynamoDBIntegration implements IntegrationBase {
  private config: DynamoDBClientConfig
  private client: DynamoDBDocument

  constructor(config: DynamoDBConfig) {
    this.config = {
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      region: config.region || AWS_REGION,
      endpoint: config.endpoint || undefined,
    }
    this.client = DynamoDBDocument.from(new DynamoDB(this.config))
  }

  async testConnection() {
    const response: ConnectionInfo = {
      connected: false,
    }
    try {
      const scanRes = await new DynamoDB(this.config).listTables()
      response.connected = !!scanRes.$metadata
    } catch (e: any) {
      response.error = e.message as string
    }
    return response
  }

  async create(query: {
    table: string
    json: Omit<PutCommandInput, "TableName">
  }) {
    const params = {
      TableName: query.table,
      ...query.json,
    }
    return this.client.put(params)
  }

  async read(query: { table: string; json: object; index: null | string }) {
    const params = {
      TableName: query.table,
      IndexName: query.index ? query.index : undefined,
      ...query.json,
    }
    const response = await this.client.query(params)
    if (response.Items) {
      return response.Items
    }
    return response
  }

  async scan(query: { table: string; json: object; index: null | string }) {
    const params = {
      TableName: query.table,
      IndexName: query.index ? query.index : undefined,
      ...query.json,
    }
    const response = await this.client.scan(params)
    if (response.Items) {
      return response.Items
    }
    return response
  }

  async describe(query: { table: string }): Promise<any> {
    const params = {
      TableName: query.table,
    }
    return new DynamoDB(this.config).describeTable(params)
  }

  async get(query: {
    table: string
    json: Omit<GetCommandInput, "TableName">
  }) {
    const params = {
      TableName: query.table,
      ...query.json,
    }
    return this.client.get(params)
  }

  async update(query: {
    table: string
    json: Omit<UpdateCommandInput, "TableName">
  }) {
    const params = {
      TableName: query.table,
      ...query.json,
    }
    return this.client.update(params)
  }

  async delete(query: {
    table: string
    json: Omit<DeleteCommandInput, "TableName">
  }) {
    const params = {
      TableName: query.table,
      ...query.json,
    }
    return this.client.delete(params)
  }
}

export default {
  schema: SCHEMA,
  integration: DynamoDBIntegration,
}
