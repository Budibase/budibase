import TestConfiguration from "../TestConfiguration"
import { SuperTest, Test } from "supertest"
import { ReadStream } from "fs"

type Headers = Record<string, string | string[] | undefined>

export interface AttachedFile {
  name: string
  file: Buffer | ReadStream | string
}

function isAttachedFile(file: any): file is AttachedFile {
  if (file === undefined) {
    return false
  }
  const attachedFile = file as AttachedFile
  return (
    Object.hasOwnProperty.call(attachedFile, "file") &&
    Object.hasOwnProperty.call(attachedFile, "name")
  )
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
  files?: Record<
    string,
    Buffer | ReadStream | string | AttachedFile | undefined
  >
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
      fields = {},
      files = {},
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

    let request = this.request[method](url).set(
      this.config.defaultHeaders({
        "x-budibase-include-stacktrace": "true",
      })
    )
    if (headers) {
      request = request.set(headers)
    }
    if (body) {
      request = request.send(body)
    }
    for (const [key, value] of Object.entries(fields)) {
      request = request.field(key, value)
    }

    for (const [key, value] of Object.entries(files)) {
      if (isAttachedFile(value)) {
        request = request.attach(key, value.file, value.name)
      } else {
        request = request.attach(key, value as any)
      }
    }
    if (contentType && status !== 204) {
      request = request.expect("Content-Type", contentType as any)
    }
    if (expectations?.headers) {
      for (const [key, value] of Object.entries(expectations.headers)) {
        request = request.expect(key, value as any)
      }
    }

    const response = await request

    if (response.status !== status) {
      let message = `Expected status ${status} but got ${response.status}`

      const stack = response.body.stack
      delete response.body.stack

      if (response.body) {
        message += `\n\nBody:`
        const body = JSON.stringify(response.body, null, 2)
        for (const line of body.split("\n")) {
          message += `\n⏐ ${line}`
        }
      }

      if (stack) {
        message += `\n\nStack from request handler:`
        for (const line of stack.split("\n")) {
          message += `\n⏐ ${line}`
        }
      }

      throw new Error(message)
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
