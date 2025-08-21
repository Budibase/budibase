import { cache, context } from "@budibase/backend-core"
import { App, DocumentType } from "@budibase/types"

export async function clearErrors(backupId?: string) {
  const database = context.getProdAppDB()
  const metadata = await database.get<App>(DocumentType.APP_METADATA)
  if (!backupId) {
    delete metadata.backupErrors
  } else if (metadata.backupErrors && metadata.backupErrors[backupId]) {
    delete metadata.backupErrors[backupId]
  }
  await database.put(metadata)
  await cache.app.invalidateAppMetadata(metadata.appId, metadata)
}
