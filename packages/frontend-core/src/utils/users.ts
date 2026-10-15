import { StrippedUser, User } from "@budibase/types"
import { APIClient } from "../api"

export type PickerUser = User | StrippedUser | { _id: string; email: string }

// Resolves user ids that fall outside a picker's first page. Ids that no
// longer match a user get a placeholder so callers stop re-requesting them
// and still have something to render.
export const fetchUsersById = async (
  API: APIClient,
  ids: string[]
): Promise<Record<string, PickerUser>> => {
  const wanted = Array.from(new Set(ids.filter(Boolean)))
  const users: Record<string, PickerUser> = {}
  if (!wanted.length) {
    return users
  }
  try {
    const res = await API.searchUsers({
      query: { oneOf: { _id: wanted } },
      limit: wanted.length,
    })
    for (const user of res?.data || []) {
      if (user?._id) {
        users[user._id] = user
      }
    }
    for (const id of wanted) {
      if (!users[id]) {
        users[id] = { _id: id, email: id }
      }
    }
  } catch (error) {
    console.error("Failed to load users by id", error)
  }
  return users
}
