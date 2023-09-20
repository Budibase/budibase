import { cache } from "@budibase/backend-core"
import { utils } from "@budibase/shared-core"
import { FieldSubtype } from "@budibase/types"
import { InvalidBBRefError } from "./errors"

export async function processInputBBReferences(
  value: string | string[] | { _id: string } | { _id: string }[],
  subtype: FieldSubtype
): Promise<string> {
  const result: string[] = []

  switch (subtype) {
    case FieldSubtype.USER:
      if (Array.isArray(value)) {
        result.push(...value.map(x => (typeof x === "string" ? x : x._id)))
      } else if (typeof value !== "string") {
        result.push(value._id)
      } else {
        result.push(...value.split(",").map((id: string) => id.trim()))
      }

      const { notFoundIds } = await cache.user.getUsers(result)

      if (notFoundIds?.length) {
        throw new InvalidBBRefError(notFoundIds[0], FieldSubtype.USER)
      }

      break
    default:
      throw utils.unreachable(subtype)
  }

  return result.join(",")
}

export async function processOutputBBReferences(
  value: string,
  subtype: FieldSubtype
) {
  if (typeof value !== "string") {
    // Already processed or nothing to process
    return value
  }

  const ids = value.split(",").filter(id => !!id)

  switch (subtype) {
    case FieldSubtype.USER:
      const { users } = await cache.user.getUsers(ids)
      return users.map(u => ({
        _id: u._id,
        primaryDisplay: u.email,
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
      }))

    default:
      throw utils.unreachable(subtype)
  }
}
