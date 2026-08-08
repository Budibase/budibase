import crypto from "crypto"
import {
  DocumentType,
  ServiceApiKeyAccessLevel,
  ServiceApiKeyDoc,
  ServiceApiKeyStatus,
  ServiceApiKeySummary,
  ServiceApiKeyWorkspaceAccess,
} from "@budibase/types"
import { getGlobalDB, getTenantId, doInTenant } from "../context"
import { getDocParams } from "../docIds"
import { decrypt, encrypt } from "../security/encryption"
import { newid } from "../utils"

export const SERVICE_API_KEY_PREFIX = "bbsvc_"

interface ServiceApiKeyTokenPayload {
  tenantId: string
  id: string
  secret: string
}

export interface CreateServiceApiKeyOpts {
  name: string
  accessLevel: ServiceApiKeyAccessLevel
  workspaceAccess: ServiceApiKeyWorkspaceAccess
  tenantAdmin: boolean
  createdBy: string
}

const hashSecret = (secret: string) =>
  crypto.createHash("sha256").update(secret).digest("base64url")

const secretsMatch = (secret: string, secretHash: string) => {
  const actual = Buffer.from(hashSecret(secret))
  const expected = Buffer.from(secretHash)
  return (
    actual.length === expected.length &&
    crypto.timingSafeEqual(new Uint8Array(actual), new Uint8Array(expected))
  )
}

const toSummary = (doc: ServiceApiKeyDoc): ServiceApiKeySummary => {
  const { secretHash: _secretHash, ...summary } = doc
  return summary
}

const parseToken = (apiKey: string): ServiceApiKeyTokenPayload => {
  if (!apiKey.startsWith(SERVICE_API_KEY_PREFIX)) {
    throw new Error("Not a service API key")
  }
  const decrypted = decrypt(apiKey.slice(SERVICE_API_KEY_PREFIX.length))
  const payload = JSON.parse(decrypted) as ServiceApiKeyTokenPayload
  if (!payload.tenantId || !payload.id || !payload.secret) {
    throw new Error("Invalid service API key")
  }
  return payload
}

export const isServiceApiKey = (apiKey: string) =>
  apiKey.startsWith(SERVICE_API_KEY_PREFIX)

export const create = async ({
  name,
  accessLevel,
  workspaceAccess,
  tenantAdmin,
  createdBy,
}: CreateServiceApiKeyOpts) => {
  const tenantId = getTenantId()
  const id = `${DocumentType.SERVICE_API_KEY}_${newid()}`
  const secret = crypto.randomBytes(32).toString("base64url")
  const now = new Date().toISOString()
  const doc: ServiceApiKeyDoc = {
    _id: id,
    name,
    secretHash: hashSecret(secret),
    accessLevel,
    workspaceAccess,
    tenantAdmin,
    status: ServiceApiKeyStatus.ACTIVE,
    createdAt: now,
    createdBy,
  }
  const db = getGlobalDB()
  const response = await db.put(doc)
  doc._rev = response.rev
  const apiKey = `${SERVICE_API_KEY_PREFIX}${encrypt(
    JSON.stringify({ tenantId, id, secret } satisfies ServiceApiKeyTokenPayload)
  )}`
  return { apiKey, serviceApiKey: toSummary(doc) }
}

export const fetch = async (id: string) => {
  return getGlobalDB().tryGet<ServiceApiKeyDoc>(id)
}

export const fetchSummary = async (id: string) => {
  const doc = await fetch(id)
  return doc ? toSummary(doc) : undefined
}

export const list = async (): Promise<ServiceApiKeySummary[]> => {
  const response = await getGlobalDB().allDocs<ServiceApiKeyDoc>(
    getDocParams(DocumentType.SERVICE_API_KEY, null, { include_docs: true })
  )
  return response.rows
    .map(row => row.doc)
    .filter((doc): doc is ServiceApiKeyDoc => !!doc)
    .map(toSummary)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export const revoke = async ({
  id,
  revokedBy,
}: {
  id: string
  revokedBy: string
}) => {
  const db = getGlobalDB()
  const doc = await db.tryGet<ServiceApiKeyDoc>(id)
  if (!doc) {
    return
  }
  if (doc.status === ServiceApiKeyStatus.REVOKED) {
    return { serviceApiKey: toSummary(doc), revoked: false }
  }
  doc.status = ServiceApiKeyStatus.REVOKED
  doc.revokedAt = new Date().toISOString()
  doc.revokedBy = revokedBy
  delete doc.secretHash
  const response = await db.put(doc)
  doc._rev = response.rev
  return { serviceApiKey: toSummary(doc), revoked: true }
}

export const authenticate = async (apiKey: string) => {
  const payload = parseToken(apiKey)
  return doInTenant(payload.tenantId, async () => {
    const doc = await fetch(payload.id)
    if (
      !doc ||
      doc.status !== ServiceApiKeyStatus.ACTIVE ||
      !doc.secretHash ||
      !secretsMatch(payload.secret, doc.secretHash)
    ) {
      throw new Error("Invalid service API key")
    }
    return {
      tenantId: payload.tenantId,
      serviceApiKey: toSummary(doc),
    }
  })
}
