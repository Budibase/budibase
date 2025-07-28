import { FetchUsersResponse, User } from "@budibase/types"
import type { BudibaseClient } from "./BudibaseClient"

export class UserAPI {
  constructor(private client: BudibaseClient) {}

  async fetch(): Promise<FetchUsersResponse> {
    const { data } =
      await this.client.get<FetchUsersResponse>("/api/global/users")
    return data
  }

  async get(userId: string): Promise<User> {
    const { data } = await this.client.get<User>(`/api/global/users/${userId}`)
    return data
  }
}
