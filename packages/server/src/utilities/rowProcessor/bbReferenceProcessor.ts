import { cache, db as dbCore } from "@budibase/backend-core"
import { utils } from "@budibase/shared-core"
import {
  BBReferenceFieldSubType,
  DocumentType,
  SEPARATOR,
} from "@budibase/types"
import { InvalidBBRefError } from "./errors"

const ROW_PREFIX = DocumentType.ROW + SEPARATOR

export async function processInputBBReferences(
  value: string | string[] | { _id: string } | { _id: string }[],
  subtype: BBReferenceFieldSubType.USER | BBReferenceFieldSubType.USERS
): Promise<string | string[] | null> {
  let referenceIds: string[] = []

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

  // make sure all reference IDs are correct global user IDs
  // they may be user metadata references (start with row prefix)
  // and these need to be converted to global IDs
  referenceIds = referenceIds.map(id => {
    if (id?.startsWith(ROW_PREFIX)) {
      return dbCore.getGlobalIDFromUserMetadataID(id)
    } else {
      return id
    }
  })

  switch (subtype) {
    case BBReferenceFieldSubType.USER:
    case BBReferenceFieldSubType.USERS: {
      const { notFoundIds } = await cache.user.getUsers(referenceIds)

      if (notFoundIds?.length) {
        throw new InvalidBBRefError(
          notFoundIds[0],
          BBReferenceFieldSubType.USER
        )
      }

      if (subtype === BBReferenceFieldSubType.USERS) {
        return referenceIds
      }

      return referenceIds.join(",") || null
    }
    default:
      throw utils.unreachable(subtype)
  }
}

export async function processOutputBBReferences(
  value: string | string[],
  subtype: BBReferenceFieldSubType.USER | BBReferenceFieldSubType.USERS
) {
  if (value === null || value === undefined) {
    // Already processed or nothing to process
    return value || undefined
  }

  const ids =
    typeof value === "string" ? value.split(",").filter(id => !!id) : value

  switch (subtype) {
    case BBReferenceFieldSubType.USER:
    case BBReferenceFieldSubType.USERS: {
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
    }
    default:
      throw utils.unreachable(subtype)
  }
}
