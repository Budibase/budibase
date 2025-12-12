import {
  ConnectionInfo,
  DatasourceFieldConfig,
  DatasourceFieldType,
  Integration,
  IntegrationBase,
  QueryType,
} from "@budibase/types"
import { fetch } from "undici"
import { URLSearchParams } from "url"

interface ServiceNowConfig {
  domain: string
  username: string
  password: string
}

export const buildServiceNowBaseUrl = (rawDomain?: string) => {
  const trimmed = rawDomain?.trim()
  if (!trimmed) {
    throw new Error("ServiceNow domain is required")
  }
  const withoutProtocol = trimmed.replace(/^https?:\/\//i, "")
  const withoutPath = withoutProtocol.replace(/\/.*$/, "")
  const withoutSuffix = withoutPath.replace(/\.service-now\.com$/i, "")
  const cleanedDomain = withoutSuffix.trim()
  if (!cleanedDomain) {
    throw new Error("ServiceNow domain is required")
  }
  if (!/^[a-z0-9-]+$/i.test(cleanedDomain)) {
    throw new Error(
      "ServiceNow domain may only contain letters, numbers, or hyphens"
    )
  }
  const normalised = cleanedDomain.toLowerCase()
  return `https://${normalised}.service-now.com/api`
}

type ServiceNowReadEndpoint =
  | "incident.list"
  | "incident.get"
  | "businessService.list"
  | "configurationItem.list"
  | "department.list"
  | "dictionary.list"
  | "attachment.list"
  | "attachment.get"
  | "tableRecord.list"
  | "tableRecord.get"
  | "user.list"
  | "user.get"
  | "userGroup.list"
  | "userRole.list"

type ServiceNowCreateEndpoint =
  | "incident.create"
  | "tableRecord.create"
  | "user.create"

type ServiceNowUpdateEndpoint =
  | "incident.update"
  | "tableRecord.update"
  | "user.update"

type ServiceNowDeleteEndpoint =
  | "incident.delete"
  | "tableRecord.delete"
  | "user.delete"
  | "attachment.delete"

interface ServiceNowReadQuery {
  extra: {
    endpoint: ServiceNowReadEndpoint
  }
  sysId?: string
  tableName?: string
  customQuery?: string
  fields?: string
  returnAll?: boolean
  limit?: number
  userName?: string
}

interface ServiceNowWriteQuery<TEndpoint> {
  extra: {
    endpoint: TEndpoint
  }
  tableName?: string
  sysId?: string
  payload?: Record<string, any>
}

const READ_ENDPOINT_OPTIONS: ServiceNowReadEndpoint[] = [
  "incident.list",
  "incident.get",
  "businessService.list",
  "configurationItem.list",
  "department.list",
  "dictionary.list",
  "attachment.list",
  "attachment.get",
  "tableRecord.list",
  "tableRecord.get",
  "user.list",
  "user.get",
  "userGroup.list",
  "userRole.list",
]

const CREATE_ENDPOINT_OPTIONS: ServiceNowCreateEndpoint[] = [
  "incident.create",
  "tableRecord.create",
  "user.create",
]

const UPDATE_ENDPOINT_OPTIONS: ServiceNowUpdateEndpoint[] = [
  "incident.update",
  "tableRecord.update",
  "user.update",
]

const DELETE_ENDPOINT_OPTIONS: ServiceNowDeleteEndpoint[] = [
  "incident.delete",
  "tableRecord.delete",
  "user.delete",
  "attachment.delete",
]

const listFields: Record<string, DatasourceFieldConfig> = {
  customQuery: {
    display: "Custom query",
    tooltip: "sysparm_query",
    type: DatasourceFieldType.STRING,
    required: false,
  },
  fields: {
    display: "Fields",
    tooltip: "comma separated",
    type: DatasourceFieldType.STRING,
    required: false,
  },
  returnAll: {
    display: "Return all records",
    type: DatasourceFieldType.BOOLEAN,
    placeholder: "true/false",
    required: false,
    default: false,
  },
  limit: {
    display: "Limit",
    type: DatasourceFieldType.NUMBER,
    default: 25,
  },
}

const payloadField = {
  display: "Payload",
  type: DatasourceFieldType.JSON,
  required: true,
}

const SCHEMA: Integration = {
  docs: "https://developer.servicenow.com/dev.do#!/reference/api/rome/rest",
  description:
    "Connect directly to ServiceNow's REST API to create, read, update, and delete records such as incidents, users, attachments, and configuration items.",
  friendlyName: "ServiceNow",
  type: "API",
  datasource: {
    domain: {
      type: DatasourceFieldType.STRING,
      required: true,
      display: "Instance domain",
      placeholder: "example",
      tooltip:
        "Enter just the domain, e.g. 'example' for https://example.service-now.com",
    },
    username: {
      type: DatasourceFieldType.STRING,
      required: true,
    },
    password: {
      type: DatasourceFieldType.PASSWORD,
      required: true,
    },
  },
  query: {
    create: {
      type: QueryType.FIELDS,
      fields: {
        tableName: {
          display: "Table name",
          type: DatasourceFieldType.STRING,
          required: false,
          tooltip: "table records only",
        },
        payload: payloadField,
      },
    },
    read: {
      readable: true,
      type: QueryType.FIELDS,
      fields: {
        sysId: {
          display: "Sys ID",
          type: DatasourceFieldType.STRING,
        },
        tableName: {
          display: "Table name",
          tooltip: "table records / attachments",
          type: DatasourceFieldType.STRING,
        },
        userName: {
          display: "User name",
          type: DatasourceFieldType.STRING,
        },
        ...listFields,
      },
    },
    update: {
      type: QueryType.FIELDS,
      fields: {
        sysId: {
          display: "Sys ID",
          type: DatasourceFieldType.STRING,
          required: true,
        },
        tableName: {
          display: "Table name",
          tooltip: "table records only",
          type: DatasourceFieldType.STRING,
        },
        payload: payloadField,
      },
    },
    delete: {
      type: QueryType.FIELDS,
      fields: {
        sysId: {
          display: "Sys ID",
          type: DatasourceFieldType.STRING,
          required: true,
        },
        tableName: {
          display: "Table name",
          tooltip: "table records only",
          type: DatasourceFieldType.STRING,
        },
      },
    },
  },
  extra: {
    endpoint: {
      displayName: "Action",
      type: DatasourceFieldType.LIST,
      required: true,
      data: {
        create: CREATE_ENDPOINT_OPTIONS,
        read: READ_ENDPOINT_OPTIONS,
        update: UPDATE_ENDPOINT_OPTIONS,
        delete: DELETE_ENDPOINT_OPTIONS,
      },
    },
  },
}

type RequestOptions = {
  query?: Record<string, string | number>
  body?: Record<string, any>
}

class ServiceNowIntegration implements IntegrationBase {
  private readonly config: ServiceNowConfig
  private readonly baseUrl: string
  private readonly authHeader: string

  constructor(config: ServiceNowConfig) {
    this.config = config
    this.baseUrl = this.buildBaseUrl()
    this.authHeader = `Basic ${Buffer.from(
      `${config.username}:${config.password}`
    ).toString("base64")}`
  }

  async testConnection(): Promise<ConnectionInfo> {
    try {
      await this.request("GET", "/now/table/sys_user", {
        query: { sysparm_limit: 1 },
      })
      return { connected: true }
    } catch (err: any) {
      return {
        connected: false,
        error: err?.message || "Unable to connect to ServiceNow",
      }
    }
  }

  async create(query: ServiceNowWriteQuery<ServiceNowCreateEndpoint>) {
    const endpoint = this.getEndpoint(query)
    const payload = this.requirePayload(query.payload)
    switch (endpoint) {
      case "incident.create":
        return this.request("POST", "/now/table/incident", { body: payload })
      case "tableRecord.create": {
        const table = this.requireTableName(query.tableName)
        return this.request("POST", `/now/table/${table}`, { body: payload })
      }
      case "user.create":
        return this.request("POST", "/now/table/sys_user", { body: payload })
      default:
        throw new Error(`Unsupported create endpoint: ${endpoint}`)
    }
  }

  async read(query: ServiceNowReadQuery) {
    const endpoint = this.getEndpoint(query)
    switch (endpoint) {
      case "incident.list":
        return this.listTable("/now/table/incident", query)
      case "incident.get":
        return this.getRecord(
          `/now/table/incident/${this.requireSysId(query.sysId)}`,
          query
        )
      case "businessService.list":
        return this.listTable("/now/table/cmdb_ci_service", query)
      case "configurationItem.list":
        return this.listTable("/now/table/cmdb_ci", query)
      case "department.list":
        return this.listTable("/now/table/cmn_department", query)
      case "dictionary.list":
        return this.listTable("/now/table/sys_dictionary", query)
      case "attachment.list":
        return this.listAttachments(query)
      case "attachment.get":
        return this.getRecord(
          `/now/attachment/${this.requireSysId(query.sysId)}`,
          query
        )
      case "tableRecord.list":
        return this.listTable(
          `/now/table/${this.requireTableName(query.tableName)}`,
          query
        )
      case "tableRecord.get":
        return this.getRecord(
          `/now/table/${this.requireTableName(
            query.tableName
          )}/${this.requireSysId(query.sysId)}`,
          query
        )
      case "user.list":
        return this.listTable("/now/table/sys_user", query)
      case "user.get":
        return this.getUser(query)
      case "userGroup.list":
        return this.listTable("/now/table/sys_user_group", query)
      case "userRole.list":
        return this.listTable("/now/table/sys_user_role", query)
      default:
        throw new Error(`Unsupported read endpoint: ${endpoint}`)
    }
  }

  async update(query: ServiceNowWriteQuery<ServiceNowUpdateEndpoint>) {
    const endpoint = this.getEndpoint(query)
    const payload = this.requirePayload(query.payload)
    switch (endpoint) {
      case "incident.update":
        return this.request(
          "PATCH",
          `/now/table/incident/${this.requireSysId(query.sysId)}`,
          { body: payload }
        )
      case "tableRecord.update":
        return this.request(
          "PATCH",
          `/now/table/${this.requireTableName(
            query.tableName
          )}/${this.requireSysId(query.sysId)}`,
          {
            body: payload,
          }
        )
      case "user.update":
        return this.request(
          "PATCH",
          `/now/table/sys_user/${this.requireSysId(query.sysId)}`,
          { body: payload }
        )
      default:
        throw new Error(`Unsupported update endpoint: ${endpoint}`)
    }
  }

  async delete(query: ServiceNowWriteQuery<ServiceNowDeleteEndpoint>) {
    const endpoint = this.getEndpoint(query)
    switch (endpoint) {
      case "incident.delete":
        await this.request(
          "DELETE",
          `/now/table/incident/${this.requireSysId(query.sysId)}`
        )
        return { success: true }
      case "tableRecord.delete":
        await this.request(
          "DELETE",
          `/now/table/${this.requireTableName(
            query.tableName
          )}/${this.requireSysId(query.sysId)}`
        )
        return { success: true }
      case "user.delete":
        await this.request(
          "DELETE",
          `/now/table/sys_user/${this.requireSysId(query.sysId)}`
        )
        return { success: true }
      case "attachment.delete":
        await this.request(
          "DELETE",
          `/now/attachment/${this.requireSysId(query.sysId)}`
        )
        return { success: true }
      default:
        throw new Error(`Unsupported delete endpoint: ${endpoint}`)
    }
  }

  private async listAttachments(query: ServiceNowReadQuery) {
    const table = this.requireTableName(query.tableName)
    const base = `table_name=${table}`
    const combinedQuery = this.combineQueries(base, query.customQuery)
    const params: Record<string, string | number> = {
      sysparm_query: combinedQuery,
    }
    return this.readWithListParams("/now/attachment", query, params)
  }

  private async getUser(query: ServiceNowReadQuery) {
    if (query.sysId) {
      return this.getRecord(
        `/now/table/sys_user/${this.requireSysId(query.sysId)}`,
        query
      )
    }
    if (!query.userName) {
      throw new Error("Either a sysId or userName is required for user.get")
    }
    const params = {
      sysparm_query: `user_name=${query.userName}`,
      sysparm_limit: 1,
    }
    const results = await this.request<any[]>("GET", "/now/table/sys_user", {
      query: params,
    })
    return Array.isArray(results) && results.length > 0 ? results[0] : undefined
  }

  private async listTable(path: string, query: ServiceNowReadQuery) {
    return this.readWithListParams(path, query)
  }

  private async readWithListParams(
    path: string,
    query: ServiceNowReadQuery,
    overrides: Record<string, string | number> = {}
  ) {
    const params = this.buildListParams(query, overrides)
    if (query.returnAll) {
      return this.fetchAll(path, params, query.limit)
    }
    const limit = query.limit || 25
    return this.request("GET", path, {
      query: {
        ...params,
        sysparm_limit: limit,
      },
    })
  }

  private buildListParams(
    query: ServiceNowReadQuery,
    overrides: Record<string, string | number>
  ) {
    const params: Record<string, string | number> = { ...overrides }
    if (query.customQuery && !params.sysparm_query) {
      params.sysparm_query = query.customQuery
    }
    if (query.fields) {
      params.sysparm_fields = this.formatFields(query.fields)
    }
    return params
  }

  private async getRecord(path: string, query: ServiceNowReadQuery) {
    const params: Record<string, string> = {}
    if (query.fields) {
      params.sysparm_fields = this.formatFields(query.fields)
    }
    return this.request("GET", path, { query: params })
  }

  private async fetchAll(
    path: string,
    params: Record<string, string | number>,
    limit?: number
  ) {
    const results: any[] = []
    const pageSize = 100
    let offset = 0
    while (true) {
      if (limit && results.length >= limit) {
        break
      }
      const remaining = limit ? limit - results.length : undefined
      const requested =
        remaining != null
          ? Math.min(pageSize, Math.max(remaining, 1))
          : pageSize
      const query = {
        ...params,
        sysparm_limit: requested,
        sysparm_offset: offset,
      }
      const page = await this.request<any[]>("GET", path, { query })
      if (!Array.isArray(page) || page.length === 0) {
        break
      }
      results.push(...page)
      if ((limit && results.length >= limit) || page.length < requested) {
        break
      }
      offset += page.length
    }
    return limit ? results.slice(0, limit) : results
  }

  private async request<T>(
    method: string,
    path: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const url = this.buildUrl(path, options.query)
    const body =
      options.body && Object.keys(options.body).length > 0
        ? JSON.stringify(options.body)
        : undefined
    const response = await fetch(url, {
      method,
      headers: {
        Authorization: this.authHeader,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body,
    })
    if (!response.ok) {
      const text = await response.text()
      throw new Error(
        `ServiceNow request failed (${response.status}): ${text || "Unknown"}`
      )
    }
    if (method === "DELETE" || response.status === 204) {
      return undefined as T
    }
    const contentLength = response.headers.get("content-length")
    if (contentLength === "0") {
      return undefined as T
    }
    const json = await response.json()
    if (this.hasResult(json)) {
      return (json.result ?? json) as T
    }
    return json as T
  }

  private buildBaseUrl() {
    return buildServiceNowBaseUrl(this.config.domain)
  }

  private buildUrl(
    path: string,
    query?: Record<string, string | number>
  ): string {
    const cleanedPath = path.startsWith("/") ? path : `/${path}`
    let url = `${this.baseUrl}${cleanedPath}`
    if (query) {
      const params = new URLSearchParams()
      for (const [key, value] of Object.entries(query)) {
        if (value === "" || value == null) {
          continue
        }
        params.append(key, String(value))
      }
      const qs = params.toString()
      if (qs) {
        url += `?${qs}`
      }
    }
    return url
  }

  private requireTableName(name?: string) {
    if (!name) {
      throw new Error("A tableName value is required for this endpoint")
    }
    if (!/^[a-zA-Z0-9_]+$/.test(name)) {
      throw new Error("Table names may only contain alphanumeric or underscore")
    }
    return name
  }

  private requireSysId(id?: string) {
    if (!id) {
      throw new Error("A sysId value is required for this endpoint")
    }
    if (/[\\/]/.test(id)) {
      throw new Error("Sys ID contains invalid characters")
    }
    return id
  }

  private requirePayload(payload?: Record<string, any>) {
    if (!payload || Object.keys(payload).length === 0) {
      throw new Error("Payload is required for this endpoint")
    }
    return payload
  }

  private formatFields(fields?: string) {
    if (!fields) {
      return ""
    }
    return fields
      .split(",")
      .map(value => value.trim())
      .filter(Boolean)
      .join(",")
  }

  private combineQueries(...queries: (string | undefined)[]) {
    return queries.filter(Boolean).join("^")
  }

  private getEndpoint<T extends string>(query: {
    extra?: { endpoint?: T }
  }): T {
    const endpoint = query.extra?.endpoint
    if (!endpoint) {
      throw new Error("You must select an action")
    }
    return endpoint
  }

  private hasResult(json: unknown): json is { result?: unknown } {
    return typeof json === "object" && json !== null && "result" in json
  }
}

export default {
  schema: SCHEMA,
  integration: ServiceNowIntegration,
}
