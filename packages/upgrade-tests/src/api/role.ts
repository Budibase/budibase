import { Role } from "@budibase/types"
import type { BudibaseClient } from "./BudibaseClient"

export class RoleAPI {
  constructor(private client: BudibaseClient) {}

  async fetch(): Promise<Role[]> {
    const { data } = await this.client.get<Role[]>("/api/roles")
    return data
  }

  async get(roleId: string): Promise<Role> {
    const { data } = await this.client.get<Role>(`/api/roles/${roleId}`)
    return data
  }
}
