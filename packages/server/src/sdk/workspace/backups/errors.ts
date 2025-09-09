import { cache, context } from "@budibase/backend-core"
import { DocumentType, Workspace } from "@budibase/types"

export async function clearErrors(backupId?: string) {
  const database = context.getProdWorkspaceDB()
  const metadata = await database.get<Workspace>(
    DocumentType.WORKSPACE_METADATA
  )
  if (!backupId) {
    delete metadata.backupErrors
  } else if (metadata.backupErrors && metadata.backupErrors[backupId]) {
    delete metadata.backupErrors[backupId]
  }
  await database.put(metadata)
  await cache.workspace.invalidateWorkspaceMetadata(metadata.appId, metadata)
}
