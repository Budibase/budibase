import { User } from "@budibase/types"
import { Expectations, PublicAPI } from "../base"

export class UserPublicAPI extends PublicAPI {
  find = async (id: string, expectations?: Expectations): Promise<User> => {
    return await this._get<User>(`/users/${id}`, { expectations })
  }

  update = async (user: User, expectations?: Expectations): Promise<User> => {
    return await this._put<User>(`/users/${user._id}`, {
      body: user,
      expectations,
    })
  }

  destroy = async (id: string, expectations?: Expectations): Promise<void> => {
    return await this._delete(`/users/${id}`, { expectations })
  }
}
