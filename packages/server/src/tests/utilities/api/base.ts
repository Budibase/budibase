import TestConfiguration from "../TestConfiguration"
import { SuperTest, Test } from "supertest"

export interface TestAPIOpts {
  headers?: Record<string, string | string[] | undefined>
  status?: number
}

export abstract class TestAPI {
  config: TestConfiguration
  request: SuperTest<Test>

  protected constructor(config: TestConfiguration) {
    this.config = config
    this.request = config.request!
  }

  protected _get = async <T>(
    url: string,
    opts: TestAPIOpts = {}
  ): Promise<T> => {
    return await this._request<T>("get", url, undefined, opts)
  }

  protected _post = async <T>(
    url: string,
    body: Record<string, any>,
    opts: TestAPIOpts = {}
  ): Promise<T> => {
    return await this._request<T>("post", url, body, opts)
  }

  protected _put = async <T>(
    url: string,
    body: Record<string, any>,
    opts: TestAPIOpts = {}
  ): Promise<T> => {
    return await this._request<T>("put", url, body, opts)
  }

  protected _patch = async <T>(
    url: string,
    body: Record<string, any>,
    opts: TestAPIOpts = {}
  ): Promise<T> => {
    return await this._request<T>("patch", url, body, opts)
  }

  protected _delete = async <T>(
    url: string,
    body: Record<string, any>,
    opts: TestAPIOpts = {}
  ): Promise<T> => {
    return await this._request<T>("delete", url, body, opts)
  }

  protected _request = async <T>(
    method: "get" | "post" | "put" | "patch" | "delete",
    url: string,
    body?: Record<string, any>,
    opts: TestAPIOpts = {}
  ): Promise<T> => {
    const { headers = {}, status = 200 } = opts
    const response = await this.request[method](url)
      .send(body)
      .set(this.config.defaultHeaders())
      .set(headers)
      .expect("Content-Type", /json/)

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
