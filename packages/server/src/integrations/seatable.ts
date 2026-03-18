import {
  ConnectionInfo,
  DatasourceFeature,
  DatasourceFieldType,
  Integration,
  IntegrationBase,
  QueryType,
} from "@budibase/types"

import axios, { AxiosInstance } from "axios"

interface SeaTableConfig {
  serverUrl: string
  apiToken: string
}

const SCHEMA: Integration = {
  docs: "https://developer.seatable.com",
  description:
    "SeaTable is an open-source collaborative database platform. Works with SeaTable Cloud (cloud.seatable.io) or any self-hosted instance.",
  friendlyName: "SeaTable",
  type: "Spreadsheet",
  features: {
    [DatasourceFeature.CONNECTION_CHECKING]: true,
  },
  datasource: {
    serverUrl: {
      display: "Server URL",
      type: DatasourceFieldType.STRING,
      default: "https://cloud.seatable.io",
      required: true,
    },
    apiToken: {
      display: "API Token",
      type: DatasourceFieldType.PASSWORD,
      default: "",
      required: true,
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
      fields: {
        table: {
          type: DatasourceFieldType.STRING,
          required: true,
        },
        view: {
          type: DatasourceFieldType.STRING,
        },
        numRecords: {
          type: DatasourceFieldType.NUMBER,
          default: 100,
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
        id: {
          display: "Row ID",
          type: DatasourceFieldType.STRING,
          required: true,
        },
      },
    },
    delete: {
      type: QueryType.FIELDS,
      fields: {
        table: {
          type: DatasourceFieldType.STRING,
          required: true,
        },
        id: {
          display: "Row ID",
          type: DatasourceFieldType.STRING,
          required: true,
        },
      },
    },
  },
}

function sanitizeError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status ?? "unknown"
    const statusText = err.response?.statusText ?? ""
    const detail = err.response?.data?.error_msg ?? err.message
    return `HTTP ${status} ${statusText}: ${detail}`
  }
  return err instanceof Error ? err.message : "Unknown error"
}

class SeaTableIntegration implements IntegrationBase {
  private readonly serverUrl: string
  private readonly apiToken: string
  private http?: AxiosInstance
  private baseUuid?: string
  private tokenExpiresAt = 0

  constructor(config: SeaTableConfig) {
    this.serverUrl = config.serverUrl.replace(/\/$/, "")
    this.apiToken = config.apiToken
  }

  private async ensureAuthenticated(): Promise<void> {
    if (this.http && Date.now() < this.tokenExpiresAt) {
      return
    }

    const url = `${this.serverUrl}/api/v2.1/dtable/app-access-token/`
    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${this.apiToken}` },
      timeout: 15_000,
    })

    const baseToken = res.data.access_token
    this.baseUuid = res.data.dtable_uuid
    const dtableServer: string = res.data.dtable_server ?? ""

    if (!baseToken || !this.baseUuid || !dtableServer) {
      throw new Error(
        "SeaTable token exchange failed – missing access_token, dtable_uuid, or dtable_server"
      )
    }

    this.tokenExpiresAt = Date.now() + 59 * 60 * 1000

    const baseURL = `${dtableServer.replace(/\/$/, "")}/api/v2/dtables/${this.baseUuid}`
    this.http = axios.create({
      baseURL,
      timeout: 30_000,
      headers: { Authorization: `Bearer ${baseToken}` },
    })
  }

  async testConnection(): Promise<ConnectionInfo> {
    try {
      await this.ensureAuthenticated()
      await this.http!.get("/metadata/")
      return { connected: true }
    } catch (e: any) {
      return {
        connected: false,
        error: sanitizeError(e),
      }
    }
  }

  async create(query: { table: string; json: Record<string, unknown> }) {
    const { table, json } = query
    try {
      await this.ensureAuthenticated()
      const res = await this.http!.post("/rows/", {
        table_name: table,
        rows: [json],
      })
      return res.data.first_row ?? res.data
    } catch (err) {
      const message = sanitizeError(err)
      console.error("Error creating row in SeaTable:", message)
      throw new Error(message)
    }
  }

  async read(query: { table: string; numRecords: number; view?: string }) {
    try {
      await this.ensureAuthenticated()
      const params: Record<string, unknown> = {
        table_name: query.table,
        start: 0,
        limit: query.numRecords || 100,
        convert_keys: true,
      }
      if (query.view) {
        params.view_name = query.view
      }
      const res = await this.http!.get("/rows/", { params })
      return res.data.rows ?? []
    } catch (err) {
      const message = sanitizeError(err)
      console.error("Error reading from SeaTable:", message)
      throw new Error(message)
    }
  }

  async update(query: {
    table: string
    id: string
    json: Record<string, unknown>
  }) {
    const { table, id, json } = query
    try {
      await this.ensureAuthenticated()
      const res = await this.http!.put("/rows/", {
        table_name: table,
        updates: [{ row_id: id, row: json }],
      })
      return res.data
    } catch (err) {
      const message = sanitizeError(err)
      console.error("Error updating row in SeaTable:", message)
      throw new Error(message)
    }
  }

  async delete(query: { table: string; id: string }) {
    const { table, id } = query
    try {
      await this.ensureAuthenticated()
      const res = await this.http!.delete("/rows/", {
        data: { table_name: table, row_ids: [id] },
      })
      return res.data
    } catch (err) {
      const message = sanitizeError(err)
      console.error("Error deleting row from SeaTable:", message)
      throw new Error(message)
    }
  }
}

export default {
  schema: SCHEMA,
  integration: SeaTableIntegration,
}
