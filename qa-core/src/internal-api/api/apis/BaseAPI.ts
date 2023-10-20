import { Response } from "node-fetch"
import BudibaseInternalAPIClient from "../BudibaseInternalAPIClient"

export default class BaseAPI {
  client: BudibaseInternalAPIClient

  constructor(client: BudibaseInternalAPIClient) {
    this.client = client
  }

  async get(url: string, status?: number): Promise<[Response, any]> {
    const [response, json] = await this.client.get(url)
    expect(response).toHaveStatusCode(status ? status : 200)
    return [response, json]
  }

  async post(
    url: string,
    body?: any,
    statusCode?: number
  ): Promise<[Response, any]> {
    const [response, json] = await this.client.post(url, { body })
    expect(response).toHaveStatusCode(statusCode ? statusCode : 200)
    return [response, json]
  }

  async put(
    url: string,
    body?: any,
    statusCode?: number
  ): Promise<[Response, any]> {
    const [response, json] = await this.client.put(url, { body })
    expect(response).toHaveStatusCode(statusCode ? statusCode : 200)
    return [response, json]
  }

  async patch(
    url: string,
    body?: any,
    statusCode?: number
  ): Promise<[Response, any]> {
    const [response, json] = await this.client.patch(url, { body })
    expect(response).toHaveStatusCode(statusCode ? statusCode : 200)
    return [response, json]
  }

  async del(
    url: string,
    statusCode?: number,
    body?: any
  ): Promise<[Response, any]> {
    const [response, json] = await this.client.del(url, { body })
    expect(response).toHaveStatusCode(statusCode ? statusCode : 200)
    return [response, json]
  }
}
