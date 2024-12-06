import { cache, db as dbCore } from "@budibase/backend-core"
import { utils } from "@budibase/shared-core"
import {
  BBReferenceFieldSubType,
  DocumentType,
  SEPARATOR,
} from "@budibase/types"
import { InvalidBBRefError } from "./errors"

const ROW_PREFIX = DocumentType.ROW + SEPARATOR

export async function processInputBBReference(
  value: string | { _id: string },
  subtype: BBReferenceFieldSubType.USER
): Promise<string | null> {
  if (value && Array.isArray(value)) {
    if (value.length > 1) {
      throw new InvalidBBRefError(
        JSON.stringify(value),
        BBReferenceFieldSubType.USER
      )
    }
    value = value[0]
  }
  let id = typeof value === "string" ? value : value?._id

  if (!id) {
    return null
  }

  switch (subtype) {
    case BBReferenceFieldSubType.USER: {
      if (id.startsWith(ROW_PREFIX)) {
        id = dbCore.getGlobalIDFromUserMetadataID(id)
      }

      try {
        await cache.user.getUser({
          userId: id,
        })
        return id
      } catch (e: any) {
        if (e.statusCode === 404) {
          throw new InvalidBBRefError(id, BBReferenceFieldSubType.USER)
        }
        throw e
      }
    }

    default:
      throw utils.unreachable(subtype)
  }
}
export async function processInputBBReferences(
  value: string | string[] | { _id: string }[],
  subtype: BBReferenceFieldSubType
): Promise<string[] | null> {
  if (!value || !value[0]) {
    return null
  }

  let referenceIds
  if (typeof value === "string") {
    referenceIds = value
      .split(",")
      .map(u => u.trim())
      .filter(u => !!u)
  } else {
    referenceIds = value.map(idOrDoc =>
      typeof idOrDoc === "string" ? idOrDoc : idOrDoc._id
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
    case undefined:
      throw "Subtype must be defined"
    case BBReferenceFieldSubType.USER:
    case BBReferenceFieldSubType.USERS: {
      const { notFoundIds } = await cache.user.getUsers(referenceIds)

      if (notFoundIds?.length) {
        throw new InvalidBBRefError(
          notFoundIds[0],
          BBReferenceFieldSubType.USER
        )
      }

      if (!referenceIds?.length) {
        return null
      }

      return referenceIds
    }
    default:
      throw utils.unreachable(subtype)
  }
}

interface UserReferenceInfo {
  _id: string
  primaryDisplay: string
  email: string
  firstName?: string
  lastName?: string
}

export async function processOutputBBReference(
  value: string | null | undefined,
  subtype: BBReferenceFieldSubType.USER
): Promise<UserReferenceInfo | undefined> {
  if (!value) {
    return undefined
  }

  switch (subtype) {
    case BBReferenceFieldSubType.USER: {
      let user
      try {
        user = await cache.user.getUser({
          userId: value as string,
        })
      } catch (err: any) {
        if (err.statusCode !== 404) {
          throw err
        }
      }
      if (!user) {
        return undefined
      }

      return {
        _id: user._id!,
        primaryDisplay: user.email,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      }
    }
    default:
      throw utils.unreachable(subtype)
  }
}

export async function processOutputBBReferences(
  value: string | string[] | null | undefined,
  subtype: BBReferenceFieldSubType
): Promise<UserReferenceInfo[] | undefined> {
  if (!value || (Array.isArray(value) && value.length === 0)) {
    return undefined
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
        _id: u._id!,
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
