import TestConfiguration from "../TestConfiguration"
import { SuperTest, Test, Response } from "supertest"
import { ReadStream } from "fs"

type Headers = Record<string, string | string[] | undefined>
type Method = "get" | "post" | "put" | "patch" | "delete"

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
  headers?: Record<string, string | RegExp>
  headersNotPresent?: string[]
  body?: Record<string, any>
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

  protected _requestRaw = async (
    method: "get" | "post" | "put" | "patch" | "delete",
    url: string,
    opts?: RequestOpts
  ): Promise<Response> => {
    const {
      headers = {},
      query = {},
      body,
      fields = {},
      files = {},
      expectations,
    } = opts || {}
    const { status = 200 } = expectations || {}
    const expectHeaders = expectations?.headers || {}

    if (status !== 204 && !expectHeaders["Content-Type"]) {
      expectHeaders["Content-Type"] = /^application\/json/
    }

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
    if (expectations?.headers) {
      for (const [key, value] of Object.entries(expectations.headers)) {
        if (value === undefined) {
          throw new Error(
            `Got an undefined expected value for header "${key}", if you want to check for the absence of a header, use headersNotPresent`
          )
        }
        request = request.expect(key, value as any)
      }
    }

    return await request
  }

  protected _request = async <T>(
    method: Method,
    url: string,
    opts?: RequestOpts
  ): Promise<T> => {
    const { expectations } = opts || {}
    const { status = 200 } = expectations || {}

    const response = await this._requestRaw(method, url, opts)

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

    if (expectations?.body) {
      expect(response.body).toMatchObject(expectations.body)
    }

    return response.body
  }
}
