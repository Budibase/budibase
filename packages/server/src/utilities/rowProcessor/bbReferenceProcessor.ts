import { cache, db as dbCore } from "@budibase/backend-core"
import { utils } from "@budibase/shared-core"
import {
  FieldType,
  BBReferenceFieldSubType,
  DocumentType,
  SEPARATOR,
} from "@budibase/types"
import { InvalidBBRefError } from "./errors"

const ROW_PREFIX = DocumentType.ROW + SEPARATOR

export function processInputBBReferences(
  value: string | { _id: string },
  type: FieldType.BB_REFERENCE_SINGLE
): Promise<string | null>
export function processInputBBReferences(
  value: string | string[] | { _id: string } | { _id: string }[],
  type: FieldType.BB_REFERENCE,
  subtype: BBReferenceFieldSubType
): Promise<string | null>

export async function processInputBBReferences(
  value: string | string[] | { _id: string } | { _id: string }[],
  type: FieldType.BB_REFERENCE | FieldType.BB_REFERENCE_SINGLE,
  subtype?: BBReferenceFieldSubType
): Promise<string | string[] | null> {
  switch (type) {
    case FieldType.BB_REFERENCE: {
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

          if (subtype === BBReferenceFieldSubType.USERS) {
            return referenceIds
          }

          return referenceIds.join(",")
        }
        default:
          throw utils.unreachable(subtype)
      }
    }
    case FieldType.BB_REFERENCE_SINGLE: {
      if (value && Array.isArray(value)) {
        throw "BB_REFERENCE_SINGLE cannot be an array"
      }

      const id = typeof value === "string" ? value : value._id

      const user = await cache.user.getUser(id)

      if (!user) {
        throw new InvalidBBRefError(id, BBReferenceFieldSubType.USER)
      }

      return user._id!
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

export function processOutputBBReferences(
  value: string,
  type: FieldType.BB_REFERENCE_SINGLE
): Promise<UserReferenceInfo>
export function processOutputBBReferences(
  value: string,
  type: FieldType.BB_REFERENCE,
  subtype: BBReferenceFieldSubType
): Promise<UserReferenceInfo[]>

export async function processOutputBBReferences(
  value: string | string[],
  type: FieldType.BB_REFERENCE | FieldType.BB_REFERENCE_SINGLE,
  subtype?: BBReferenceFieldSubType
) {
  if (value === null || value === undefined) {
    // Already processed or nothing to process
    return value || undefined
  }

  switch (type) {
    case FieldType.BB_REFERENCE: {
      const ids =
        typeof value === "string" ? value.split(",").filter(id => !!id) : value

      switch (subtype) {
        case undefined:
          throw "Subtype must be defined"
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
    case FieldType.BB_REFERENCE_SINGLE: {
      if (!value) {
        return undefined
      }

      let user
      try {
        user = await cache.user.getUser(value as string)
      } catch (err: any) {
        if (err.code !== 404) {
          throw err
        }
      }
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
    }

    default:
      throw utils.unreachable(type)
  }
}
