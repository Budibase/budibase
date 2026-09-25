import type { BudibaseRow, BudibaseTable } from "./types.js"

export interface PostgresDatasourceConfig {
  host: string
  port: number
  database: string
  user: string
  password: string
  schema: string
  ssl: boolean
}

export class BudibaseClient {
  private cookie = ""

  constructor(
    private readonly baseUrl: string,
    private readonly appId: string
  ) {}

  async login(
    email: string,
    password: string,
    tenantId: string
  ): Promise<void> {
    const res = await fetch(
      `${this.baseUrl}/api/global/auth/${tenantId}/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      }
    )
    if (!res.ok) {
      throw new Error(
        `Budibase login failed: ${res.status} ${await res.text()}`
      )
    }
    const cookies = res.headers.getSetCookie()
    this.cookie = cookies.map(c => c.split(";")[0]).join("; ")
  }

  private headers(extra?: Record<string, string>): Record<string, string> {
    return {
      Cookie: this.cookie,
      "x-budibase-app-id": this.appId,
      ...extra,
    }
  }

  async getTable(tableId: string): Promise<BudibaseTable> {
    const res = await fetch(`${this.baseUrl}/api/tables/${tableId}`, {
      headers: this.headers(),
    })
    if (!res.ok) {
      throw new Error(
        `Failed to fetch table ${tableId}: ${res.status} ${await res.text()}`
      )
    }
    return (await res.json()) as BudibaseTable
  }

  async *searchAllRows(
    tableId: string,
    pageSize: number
  ): AsyncGenerator<BudibaseRow[]> {
    let bookmark: string | number | undefined
    while (true) {
      const res = await fetch(`${this.baseUrl}/api/${tableId}/search`, {
        method: "POST",
        headers: this.headers({ "Content-Type": "application/json" }),
        body: JSON.stringify({
          query: {},
          paginate: true,
          limit: pageSize,
          bookmark,
        }),
      })
      if (!res.ok) {
        throw new Error(
          `Failed to search rows for ${tableId}: ${res.status} ${await res.text()}`
        )
      }
      const body = (await res.json()) as {
        rows: BudibaseRow[]
        bookmark?: string | number
        hasNextPage?: boolean
      }
      yield body.rows
      if (!body.hasNextPage || body.rows.length === 0) {
        break
      }
      bookmark = body.bookmark
    }
  }

  async createPostgresDatasource(
    name: string,
    config: PostgresDatasourceConfig,
    tablesFilter: string[]
  ): Promise<{ datasourceId: string; errors: Record<string, string> }> {
    const res = await fetch(`${this.baseUrl}/api/datasources`, {
      method: "POST",
      headers: this.headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        datasource: {
          name,
          source: "POSTGRES",
          config,
        },
        fetchSchema: true,
        tablesFilter,
      }),
    })
    if (!res.ok) {
      throw new Error(
        `Failed to create Postgres datasource: ${res.status} ${await res.text()}`
      )
    }
    const body = (await res.json()) as {
      datasource: { _id: string }
      errors: Record<string, string>
    }
    return { datasourceId: body.datasource._id, errors: body.errors ?? {} }
  }
}
