import { context, docIds, encryption } from "@budibase/backend-core"
import type { DelegatedOAuthCredentialDoc } from "@budibase/types"

export const getDelegatedOAuthCredential = async (
  datasourceId: string,
  authConfigId: string
) => {
  const db = context.getWorkspaceDB()
  try {
    const doc = await db.get<DelegatedOAuthCredentialDoc>(
      docIds.generateDelegatedOAuthCredentialID(datasourceId, authConfigId)
    )
    return {
      ...doc,
      accessToken: doc.accessToken
        ? encryption.decrypt(doc.accessToken)
        : undefined,
      refreshToken: doc.refreshToken
        ? encryption.decrypt(doc.refreshToken)
        : undefined,
    }
  } catch {
    return undefined
  }
}

export const saveDelegatedOAuthCredential = async ({
  datasourceId,
  authConfigId,
  accessToken,
  refreshToken,
  tokenType,
  expiresAt,
}: DelegatedOAuthCredentialDoc) => {
  const db = context.getWorkspaceDB()
  const _id = docIds.generateDelegatedOAuthCredentialID(
    datasourceId,
    authConfigId
  )
  let _rev: string | undefined
  try {
    const existing = await db.get<DelegatedOAuthCredentialDoc>(_id)
    _rev = existing._rev
  } catch {
    _rev = undefined
  }
  await db.put<DelegatedOAuthCredentialDoc>({
    _id,
    _rev,
    datasourceId,
    authConfigId,
    accessToken: encryption.encrypt(accessToken),
    refreshToken: encryption.encrypt(refreshToken),
    tokenType,
    expiresAt,
    updatedAt: new Date().toISOString(),
  })
}
