import { User, Table, SearchFilters, Row } from "@budibase/types"
import { HttpMethod, MakeRequestResponse, generateMakeRequest } from "./utils"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import { Expectations } from "../../../../tests/utilities/api/base"

type RequestOpts = { internal?: boolean; appId?: string }

type PublicAPIExpectations = Omit<Expectations, "headers" | "headersNotPresent">

export class PublicAPIRequest {
  private makeRequest: MakeRequestResponse | undefined
  private appId: string | undefined
  private _tables: PublicTableAPI | undefined
  private _rows: PublicRowAPI | undefined
  private _apiKey: string | undefined

  async init(config: TestConfiguration, user: User, opts?: RequestOpts) {
    this._apiKey = await config.generateApiKey(user._id)
    this.makeRequest = generateMakeRequest(this.apiKey, opts)
    this.appId = opts?.appId
    this._tables = new PublicTableAPI(this)
    this._rows = new PublicRowAPI(this)
    return this
  }

  opts(opts: RequestOpts) {
    if (opts.appId) {
      this.appId = opts.appId
    }
    this.makeRequest = generateMakeRequest(this.apiKey, opts)
  }

  async send(
    method: HttpMethod,
    endpoint: string,
    body?: any,
    expectations?: PublicAPIExpectations
  ) {
    if (!this.makeRequest) {
      throw new Error("Init has not been called")
    }
    const res = await this.makeRequest(method, endpoint, body, this.appId)
    if (expectations?.status) {
      expect(res.status).toEqual(expectations.status)
    }
    if (expectations?.body) {
      expect(res.body).toEqual(expectations?.body)
    }
    return res.body
  }

  get apiKey(): string {
    if (!this._apiKey) {
      throw new Error("Init has not been called")
    }
    return this._apiKey
  }

  get tables(): PublicTableAPI {
    if (!this._tables) {
      throw new Error("Init has not been called")
    }
    return this._tables
  }

  get rows(): PublicRowAPI {
    if (!this._rows) {
      throw new Error("Init has not been called")
    }
    return this._rows
  }
}

export class PublicTableAPI {
  request: PublicAPIRequest

  constructor(request: PublicAPIRequest) {
    this.request = request
  }

  async create(
    table: Table,
    expectations?: PublicAPIExpectations
  ): Promise<{ data: Table }> {
    return this.request.send("post", "/tables", table, expectations)
  }
}

export class PublicRowAPI {
  request: PublicAPIRequest

  constructor(request: PublicAPIRequest) {
    this.request = request
  }

  async search(
    tableId: string,
    query: SearchFilters,
    expectations?: PublicAPIExpectations
  ): Promise<{ data: Row[] }> {
    return this.request.send(
      "post",
      `/tables/${tableId}/rows/search`,
      {
        query,
      },
      expectations
    )
  }
}
