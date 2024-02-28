import exp from "constants"
import TestConfiguration from "../TestConfiguration"
import { SuperTest, Test } from "supertest"

type Headers = Record<string, string | string[] | undefined>

export interface TestAPIOpts {
  headers?: Headers
  status?: number
}

export interface Expectations {
  status?: number
  contentType?: string | RegExp
  headers?: Record<string, string | RegExp>
  headersNotPresent?: string[]
}

export interface RequestOpts {
  headers?: Headers
  query?: Record<string, string | undefined>
  body?: Record<string, any>
  fields?: Record<string, any>
  files?: Record<string, any>
  expectations?: Expectations
}

export abstract class TestAPI {
  config: TestConfiguration
  request: SuperTest<Test>

  constructor(config: TestConfiguration) {
    this.config = config
    this.request = config.request!
  }

  protected _get = async <T>(url: string, opts?: RequestOpts): Promise<T> => {
    return await this._request<T>("get", url, opts)
  }

  protected _post = async <T>(url: string, opts?: RequestOpts): Promise<T> => {
    return await this._request<T>("post", url, opts)
  }

  protected _put = async <T>(url: string, opts?: RequestOpts): Promise<T> => {
    return await this._request<T>("put", url, opts)
  }

  protected _patch = async <T>(url: string, opts?: RequestOpts): Promise<T> => {
    return await this._request<T>("patch", url, opts)
  }

  protected _delete = async <T>(
    url: string,
    opts?: RequestOpts
  ): Promise<T> => {
    return await this._request<T>("delete", url, opts)
  }

  protected _request = async <T>(
    method: "get" | "post" | "put" | "patch" | "delete",
    url: string,
    opts?: RequestOpts
  ): Promise<T> => {
    const {
      headers = {},
      query = {},
      body,
      fields,
      files,
      expectations,
    } = opts || {}
    const { status = 200, contentType = /json/ } = expectations || {}

    let queryParams = []
    for (const [key, value] of Object.entries(query)) {
      if (value) {
        queryParams.push(`${key}=${value}`)
      }
    }
    if (queryParams.length) {
      url += `?${queryParams.join("&")}`
    }

    let request = this.request[method](url).set(this.config.defaultHeaders())
    if (headers) {
      request = request.set(headers)
    }
    if (body) {
      request = request.send(body)
    }
    if (fields) {
      for (const [key, value] of Object.entries(fields)) {
        request = request.field(key, value)
      }
    }
    if (files) {
      for (const [key, value] of Object.entries(files)) {
        request = request.attach(key, value)
      }
    }
    if (contentType && status !== 204) {
      if (contentType instanceof RegExp) {
        request = request.expect("Content-Type", contentType)
      } else {
        request = request.expect("Content-Type", contentType)
      }
    }
    if (expectations?.headers) {
      for (const [key, value] of Object.entries(expectations.headers)) {
        if (value instanceof RegExp) {
          request = request.expect(key, value)
        } else {
          request = request.expect(key, value)
        }
      }
    }

    const response = await request

    if (response.status !== status) {
      throw new Error(
        `Expected status ${status} but got ${
          response.status
        } with body ${JSON.stringify(response.body)}`
      )
    }

    if (expectations?.headersNotPresent) {
      for (const header of expectations.headersNotPresent) {
        if (response.headers[header]) {
          throw new Error(
            `Expected header ${header} not to be present, found value "${response.headers[header]}"`
          )
        }
      }
    }

    return response.body as T
  }
}
