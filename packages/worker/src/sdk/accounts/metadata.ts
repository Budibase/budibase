import { AccountMetadata } from "@budibase/types"
import {
  db,
  StaticDatabases,
  DocumentType,
  SEPARATOR,
} from "@budibase/backend-core"

export const formatAccountMetadataId = (accountId: string) => {
  return `${DocumentType.ACCOUNT_METADATA}${SEPARATOR}${accountId}`
}

export const saveMetadata = async (
  metadata: AccountMetadata
): Promise<AccountMetadata> => {
  return db.doWithDB(StaticDatabases.PLATFORM_INFO.name, async (db: any) => {
    const existing = await getMetadata(metadata._id!)
    if (existing) {
      metadata._rev = existing._rev
    }
    try {
      const res = await db.put(metadata)
      metadata._rev = res.rev
    } catch (e: any) {
      // account can be updated frequently
      // ignore 409
      if (e.status !== 409) {
        throw e
      }
    }

    return metadata
  })
}

export const getMetadata = async (
  accountId: string
): Promise<AccountMetadata | undefined> => {
  return db.doWithDB(StaticDatabases.PLATFORM_INFO.name, async (db: any) => {
    try {
      return await db.get(accountId)
    } catch (e: any) {
      if (e.status === 404) {
        // do nothing
        return
      } else {
        throw e
      }
    }
  })
}

export const destroyMetadata = async (accountId: string) => {
  await db.doWithDB(StaticDatabases.PLATFORM_INFO.name, async (db: any) => {
    const metadata = await getMetadata(accountId)
    if (!metadata) {
      return
    }
    try {
      await db.remove(accountId, metadata._rev)
    } catch (e: any) {
      if (e.status !== 404) {
        throw e
      }
    }
  })
}
