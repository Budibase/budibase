import { Response } from "node-fetch"
import { User } from "@budibase/types"
import InternalAPIClient from "./InternalAPIClient"
import { responseMessage } from "../fixtures/types/responseMessage"

export default class UserManagementApi {
    api: InternalAPIClient

    constructor(apiClient: InternalAPIClient) {
        this.api = apiClient
    }

    async searchUsers(): Promise<[Response, User[]]> {
        const response = await this.api.post(`/global/users/search`, {})
        const json = await response.json()
        expect(response).toHaveStatusCode(200)
        expect(json.length).toBeGreaterThan(0)
        return [response, json]
    }

    async getSelf(): Promise<[Response, User]> {
        const response = await this.api.get(`/global/self`)
        const json = await response.json()
        expect(response).toHaveStatusCode(200)
        return [response, json]
    }

    async getAllUsers(): Promise<[Response, User]> {
        const response = await this.api.get(`/global/users`)
        const json = await response.json()
        expect(response).toHaveStatusCode(200)
        return [response, json]
    }

    async inviteUsers(body: User[]): Promise<[Response, responseMessage]> {
        const response = await this.api.post(`/global/users/multi/invite`, { body })
        const json = await response.json()
        expect(response).toHaveStatusCode(200)
        expect(json.successful.length).toEqual(body.length)
        expect(json.unsuccessful.length).toEqual(0)
        return [response, json]
    }
}
