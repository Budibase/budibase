import { cache, db as dbCore } from "@budibase/backend-core"
import { utils } from "@budibase/shared-core"
import {
  FieldType,
  FieldSubtype,
  DocumentType,
  SEPARATOR,
} from "@budibase/types"
import { InvalidBBRefError } from "./errors"

const ROW_PREFIX = DocumentType.ROW + SEPARATOR

export function processInputBBReferences<T = FieldType.BB_REFERENCE_SINGLE>(
  value: string,
  type: T
): Promise<string | null>
export function processInputBBReferences<
  T = FieldType.BB_REFERENCE,
  TS = FieldSubtype.USER
>(
  value: string | string[] | { _id: string } | { _id: string }[],
  type: T,
  subtype: TS
): Promise<string | null>
export function processInputBBReferences<
  T = FieldType.BB_REFERENCE,
  TS = FieldSubtype.USERS
>(
  value: string | string[] | { _id: string } | { _id: string }[],
  type: T,
  subtype: TS
): Promise<string[] | null>

export async function processInputBBReferences<
  T extends FieldType.BB_REFERENCE | FieldType.BB_REFERENCE_SINGLE,
  TS extends FieldSubtype.USER | FieldSubtype.USERS
>(
  value: string | string[] | { _id: string } | { _id: string }[],
  type: T,
  subtype?: TS
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

  switch (type) {
    case FieldType.BB_REFERENCE:
      switch (subtype) {
        case undefined:
          throw "Subtype must be defined"
        case FieldSubtype.USER:
        case FieldSubtype.USERS: {
          const { notFoundIds } = await cache.user.getUsers(referenceIds)

          if (notFoundIds?.length) {
            throw new InvalidBBRefError(notFoundIds[0], FieldSubtype.USER)
          }

          if (subtype === FieldSubtype.USERS) {
            return referenceIds
          }

          return referenceIds.join(",") || null
        }
        default:
          throw utils.unreachable(subtype)
      }

    case FieldType.BB_REFERENCE_SINGLE: {
      const user = await cache.user.getUser(referenceIds[0])

      if (!user) {
        throw new InvalidBBRefError(referenceIds[0], FieldSubtype.USER)
      }

      return referenceIds[0] || null
    }

    default:
      throw utils.unreachable(type)
  }
}

interface UserReferenceInfo {
  _id: string
  primaryDisplay: string
  email: string
  firstName: string
  lastName: string
}

export function processOutputBBReferences<T = FieldType.BB_REFERENCE_SINGLE>(
  value: string,
  type: T
): Promise<UserReferenceInfo>
export function processOutputBBReferences<
  T = FieldType.BB_REFERENCE,
  TS = FieldSubtype.USER
>(value: string, type: T, subtype: TS): Promise<UserReferenceInfo[]>
export function processOutputBBReferences<
  T = FieldType.BB_REFERENCE,
  TS = FieldSubtype.USERS
>(value: string[], type: T, subtype: TS): Promise<UserReferenceInfo[]>

export async function processOutputBBReferences(
  value: string | string[],
  type: FieldType.BB_REFERENCE | FieldType.BB_REFERENCE_SINGLE,
  subtype?: FieldSubtype.USER | FieldSubtype.USERS
) {
  if (value === null || value === undefined) {
    // Already processed or nothing to process
    return value || undefined
  }

  switch (type) {
    case FieldType.BB_REFERENCE:
      const ids =
        typeof value === "string" ? value.split(",").filter(id => !!id) : value

      switch (subtype) {
        case undefined:
          throw "Subtype must be defined"
        case FieldSubtype.USER:
        case FieldSubtype.USERS: {
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

    case FieldType.BB_REFERENCE_SINGLE:
      const user = await cache.user.getUser(value as string)
      if (!user) {
        return undefined
      }

      return {
        _id: user._id,
        primaryDisplay: user.email,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      }

    default:
      throw utils.unreachable(type)
  }
}
