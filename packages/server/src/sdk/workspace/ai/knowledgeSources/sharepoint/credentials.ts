import { context, encryption } from "@budibase/backend-core"

interface SharePointCredentialDoc {
  _id: string
  _rev?: string
  type: "sharepoint_oauth_credential"
  datasourceId: string
  authConfigId: string
  accessToken?: string
  refreshToken?: string
  tokenType?: string
  expiresAt?: number
  updatedAt: string
}

const docId = (authConfigId: string) => `sharepoint_credential_${authConfigId}`

const decrypt = (value?: string) => {
  if (!value) {
    return value
  }
  try {
    return encryption.decrypt(value)
  } catch {
    return value
  }
}

const encrypt = (value?: string) => {
  if (!value) {
    return value
  }
  const decrypted = decrypt(value)
  return decrypted ? encryption.encrypt(decrypted) : undefined
}

export const getSharePointCredential = async (
  datasourceId: string,
  authConfigId: string
) => {
  const db = context.getWorkspaceDB()
  try {
    const doc = await db.get<SharePointCredentialDoc>(docId(authConfigId))
    return {
      ...doc,
      accessToken: decrypt(doc.accessToken),
      refreshToken: decrypt(doc.refreshToken),
    }
  } catch {
    return undefined
  }
}

export const saveSharePointCredential = async ({
  datasourceId,
  authConfigId,
  accessToken,
  refreshToken,
  tokenType,
  expiresAt,
}: {
  datasourceId: string
  authConfigId: string
  accessToken?: string
  refreshToken?: string
  tokenType?: string
  expiresAt?: number
}) => {
  const db = context.getWorkspaceDB()
  const _id = docId(authConfigId)
  let _rev: string | undefined
  try {
    const existing = await db.get<SharePointCredentialDoc>(_id)
    _rev = existing._rev
  } catch {
    _rev = undefined
  }
  await db.put<SharePointCredentialDoc>({
    _id,
    _rev,
    type: "sharepoint_oauth_credential",
    datasourceId,
    authConfigId,
    accessToken: encrypt(accessToken),
    refreshToken: encrypt(refreshToken),
    tokenType,
    expiresAt,
    updatedAt: new Date().toISOString(),
  })
}
