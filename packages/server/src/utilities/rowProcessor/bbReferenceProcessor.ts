import { cache } from "@budibase/backend-core"
import { utils } from "@budibase/shared-core"
import { FieldSubtype } from "@budibase/types"
import { InvalidBBRefError } from "./errors"

export async function processInputBBReferences(
  value: string | string[] | { _id: string } | { _id: string }[],
  subtype: FieldSubtype
): Promise<string | null> {
  const referenceIds: string[] = []

  if (Array.isArray(value)) {
    referenceIds.push(
      ...value.map(idOrDoc =>
        typeof idOrDoc === "string" ? idOrDoc : idOrDoc._id
      )
    )
  } else if (typeof value !== "string") {
    referenceIds.push(value._id)
  } else {
    referenceIds.push(
      ...value
        .split(",")
        .filter(x => x)
        .map((id: string) => id.trim())
    )
  }

  switch (subtype) {
    case FieldSubtype.USER:
      const { notFoundIds } = await cache.user.getUsers(referenceIds)

      if (notFoundIds?.length) {
        throw new InvalidBBRefError(notFoundIds[0], FieldSubtype.USER)
      }

      break
    default:
      throw utils.unreachable(subtype)
  }

  return referenceIds.join(",") || null
}

export async function processOutputBBReferences(
  value: string,
  subtype: FieldSubtype
) {
  if (typeof value !== "string") {
    // Already processed or nothing to process
    return value || undefined
  }

  const ids = value.split(",").filter(id => !!id)

  switch (subtype) {
    case FieldSubtype.USER:
      const { users } = await cache.user.getUsers(ids)
      if (!users.length) {
        return undefined
      }

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
