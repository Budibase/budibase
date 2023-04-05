import { Response } from "node-fetch"
import { Role, User, UserDeletedEvent, UserRoles } from "@budibase/types"
import BudibaseInternalAPIClient from "../BudibaseInternalAPIClient"
import { MessageResponse } from "../../../types"

export default class UserAPI {
  client: BudibaseInternalAPIClient

  constructor(client: BudibaseInternalAPIClient) {
    this.client = client
  }

  async search(): Promise<[Response, Partial<User>[]]> {
    const [response, json] = await this.client.post(`/global/users/search`, {})
    expect(response).toHaveStatusCode(200)
    expect(json.data.length).toBeGreaterThan(0)
    return [response, json]
  }

  async getSelf(): Promise<[Response, Partial<User>]> {
    const [response, json] = await this.client.get(`/global/self`)
    expect(response).toHaveStatusCode(200)
    return [response, json]
  }

  async getAll(): Promise<[Response, Partial<User>[]]> {
    const [response, json] = await this.client.get(`/global/users`)
    expect(response).toHaveStatusCode(200)
    expect(json.length).toBeGreaterThan(0)
    return [response, json]
  }

  // This endpoint is used for one or more users when we want add users with passwords set.
  async addMultiple(userList: Partial<User>[]): Promise<[Response, any]> {
    const body = {
      create: {
        users: userList,
        groups: [],
      },
    }
    const [response, json] = await this.client.post(`/global/users/bulk`, {
      body,
    })
    expect(response).toHaveStatusCode(200)
    expect(json.created.unsuccessful.length).toEqual(0)
    expect(json.created.successful.length).toEqual(body.create.users.length)
    return [response, json]
  }

  async deleteMultiple(userId: string[]): Promise<[Response, MessageResponse]> {
    const body = {
      delete: {
        userIds: [userId],
      },
    }
    const [response, json] = await this.client.post(`/global/users/bulk`, {
      body,
    })
    expect(response).toHaveStatusCode(200)
    expect(json.deleted.successful.length).toEqual(1)
    expect(json.deleted.unsuccessful.length).toEqual(0)
    expect(json.deleted.successful[0].userId).toEqual(userId)
    return [response, json]
  }
  async delete(userId: string): Promise<[Response, UserDeletedEvent]> {
    const [response, json] = await this.client.del(`/global/users/${userId}`)
    expect(response).toHaveStatusCode(200)
    expect(json.message).toEqual(`User ${userId} deleted.`)
    return [response, json]
  }

  async invite(body: any): Promise<[Response, MessageResponse]> {
    const [response, json] = await this.client.post(
      `/global/users/multi/invite`,
      { body }
    )
    expect(response).toHaveStatusCode(200)
    expect(json.unsuccessful.length).toEqual(0)
    expect(json.successful.length).toEqual(body.length)

    return [response, json]
  }

  async getRoles(): Promise<[Response, Role[]]> {
    const [response, json] = await this.client.get(`/roles`)
    expect(response).toHaveStatusCode(200)
    return [response, json]
  }

  async updateInfo(body: any): Promise<[Response, User]> {
    const [response, json] = await this.client.post(`/global/users/`, { body })
    expect(response).toHaveStatusCode(200)
    expect(json._id).toEqual(body._id)
    expect(json._rev).not.toEqual(body._rev)
    return [response, json]
  }

  async forcePasswordReset(body: any): Promise<[Response, User]> {
    const [response, json] = await this.client.post(`/global/users/`, { body })
    expect(response).toHaveStatusCode(200)
    expect(json._id).toEqual(body._id)
    expect(json._rev).not.toEqual(body._rev)
    return [response, json]
  }

  async getInfo(userId: string): Promise<[Response, User]> {
    const [response, json] = await this.client.get(`/global/users/${userId}`)
    expect(response).toHaveStatusCode(200)
    return [response, json]
  }

  async changeSelfPassword(body: Partial<User>): Promise<[Response, User]> {
    const [response, json] = await this.client.post(`/global/self`, { body })
    expect(response).toHaveStatusCode(200)
    expect(json._id).toEqual(body._id)
    expect(json._rev).not.toEqual(body._rev)
    return [response, json]
  }

  async createRole(body: Partial<UserRoles>): Promise<[Response, UserRoles]> {
    const [response, json] = await this.client.post(`/roles`, { body })
    expect(response).toHaveStatusCode(200)
    return [response, json]
  }
}
