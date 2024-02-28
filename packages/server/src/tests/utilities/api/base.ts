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
}

export interface RequestOpts {
  headers?: Headers
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

  protected _get = async <T>(
    url: string,
    expectations?: Expectations
  ): Promise<T> => {
    return await this._request<T>("get", url, { expectations })
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
    const { headers = {}, body, fields, files, expectations } = opts || {}
    const { status = 200, contentType = /json/ } = expectations || {}

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
    if (contentType) {
      if (contentType instanceof RegExp) {
        request = request.expect("Content-Type", contentType)
      } else {
        request = request.expect("Content-Type", contentType)
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

    return response.body as T
  }
}
