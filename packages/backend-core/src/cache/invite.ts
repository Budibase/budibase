import * as utils from "../utils"
import { Duration } from "../utils"
import env from "../environment"
import { getTenantId } from "../context"
import * as redis from "../redis/init"
import * as locks from "../redis/redlockImpl"
import { Invite, InviteWithCode, LockName, LockType } from "@budibase/types"

const TTL_SECONDS = Duration.fromDays(7).toSeconds()
const INVITE_LIST_LOCK_TTL_MS = Duration.fromSeconds(10).toMs()
const INVALID_INVITE_MESSAGE =
  "Invitation is not valid or has expired, please request a new one."

interface InviteListEntry {
  email: string
  info: Invite["info"]
  expiresAt: number
}

interface InviteListPayload {
  tenantId: string
  invites: Record<string, InviteListEntry>
}

function normaliseInviteList(
  value?: InviteListPayload | null,
  tenantId?: string
): InviteListPayload | null {
  if (!value) {
    return null
  }
  const resolvedTenantId = value.tenantId || tenantId
  if (!resolvedTenantId) {
    return null
  }
  return {
    tenantId: resolvedTenantId,
    invites: value.invites || {},
  }
}

function pruneExpiredInvites(list: InviteListPayload) {
  let changed = false
  const now = Date.now()
  for (const [code, invite] of Object.entries(list.invites)) {
    if (!invite?.expiresAt || invite.expiresAt <= now) {
      delete list.invites[code]
      changed = true
    }
  }
  return { list, changed }
}

async function loadInviteList(tenantId: string) {
  const client = await redis.getInviteListClient()
  const list = (await client.get(tenantId)) as InviteListPayload | undefined
  return normaliseInviteList(list, tenantId)
}

async function saveInviteList(tenantId: string, list: InviteListPayload) {
  const client = await redis.getInviteListClient()
  await client.store(tenantId, list)
}

async function withInviteListLock<T>(
  tenantId: string,
  fn: () => Promise<T>
): Promise<T> {
  const { result } = await locks.doWithLock(
    {
      type: LockType.DEFAULT,
      name: LockName.PROCESS_USER_INVITE,
      systemLock: true,
      resource: tenantId,
      ttl: INVITE_LIST_LOCK_TTL_MS,
    },
    fn
  )
  return result
}

function toInviteWithCode(
  code: string,
  invite: InviteListEntry
): InviteWithCode {
  return {
    code,
    email: invite.email,
    info: invite.info,
  }
}

async function findInviteInList(code: string, tenantId: string) {
  const client = await redis.getInviteListClient()
  const list = normaliseInviteList(
    (await client.get(tenantId)) as InviteListPayload | undefined,
    tenantId
  )
  if (!list) {
    throw new Error(INVALID_INVITE_MESSAGE)
  }
  const inviteCodes = Object.keys(list.invites)
  if (!inviteCodes.includes(code)) {
    throw new Error(INVALID_INVITE_MESSAGE)
  }
  return { list, invite: list.invites[code] }
}

/**
 * Given an invite code and invite body, allow the update an existing/valid invite in redis
 * @param code The invite code for an invite in redis
 * @param value The body of the updated user invitation
 */
export async function updateCode(code: string, value: Invite) {
  const client = await redis.getInviteClient()
  const legacyExists = await client.exists(code)
  if (legacyExists) {
    await client.store(code, value, TTL_SECONDS)
  }

  const info: Invite["info"] = {
    ...value.info,
  }
  const tenantId = info.tenantId || getTenantId()
  info.tenantId = tenantId

  await withInviteListLock(tenantId, async () => {
    const list = (await loadInviteList(tenantId)) || {
      tenantId,
      invites: {},
    }
    list.invites[code] = {
      email: value.email,
      info,
      expiresAt: Date.now() + TTL_SECONDS * 1000,
    }
    await saveInviteList(tenantId, list)
  })
}

/**
 * Generates an invitation code and writes it to redis - which can later be checked for user creation.
 * @param email the email address which the code is being sent to (for use later).
 * @param info Information to be carried along with the invitation.
 * @return returns the code that was stored to redis.
 */
export async function createCode(email: string, info: any): Promise<string> {
  const code = utils.newid()
  const inviteInfo = {
    ...(info || {}),
  }
  const tenantId = inviteInfo.tenantId || getTenantId()
  inviteInfo.tenantId = tenantId

  await withInviteListLock(tenantId, async () => {
    const list =
      (await loadInviteList(tenantId)) ||
      ({
        tenantId,
        invites: {},
      } as InviteListPayload)
    list.invites[code] = {
      email,
      info: inviteInfo,
      expiresAt: Date.now() + TTL_SECONDS * 1000,
    }
    await saveInviteList(tenantId, list)
  })
  return code
}

/**
 * Checks that the provided invite code is valid - will return the email address of user that was invited.
 * @param code the invite code that was provided as part of the link.
 * @return If the code is valid then an email address will be returned.
 */
export async function getCode(
  code: string,
  tenantId?: string
): Promise<Invite> {
  const client = await redis.getInviteClient()
  const value = (await client.get(code)) as Invite | undefined
  if (value) {
    return value
  }

  const resolvedTenantId = tenantId || getTenantId()
  return await withInviteListLock(resolvedTenantId, async () => {
    const found = await findInviteInList(code, resolvedTenantId)

    const { list, invite } = found
    if (invite.expiresAt <= Date.now()) {
      delete list.invites[code]
      await saveInviteList(list.tenantId, list)
      throw new Error(INVALID_INVITE_MESSAGE)
    }

    return {
      email: invite.email,
      info: invite.info,
    }
  })
}

export async function deleteCode(code: string, tenantId?: string) {
  const client = await redis.getInviteClient()
  await client.delete(code)

  const resolvedTenantId = tenantId || getTenantId()
  try {
    await withInviteListLock(resolvedTenantId, async () => {
      const found = await findInviteInList(code, resolvedTenantId)
      delete found.list.invites[code]
      await saveInviteList(found.list.tenantId, found.list)
    })
  } catch (err) {
    if (err instanceof Error && err.message === INVALID_INVITE_MESSAGE) {
      return
    }
    throw err
  }
}

/**
 Get all currently available user invitations for the current tenant.
 **/
export async function getInviteCodes(): Promise<InviteWithCode[]> {
  const tenantId = getTenantId()
  const list = await withInviteListLock(tenantId, async () => {
    let found = (await loadInviteList(tenantId)) || {
      tenantId,
      invites: {},
    }

    const pruned = pruneExpiredInvites(found)
    found = pruned.list
    if (pruned.changed) {
      await saveInviteList(tenantId, found)
    }
    return found
  })

  const results = new Map<string, InviteWithCode>()
  for (const [code, invite] of Object.entries(list.invites)) {
    results.set(code, toInviteWithCode(code, invite))
  }

  const client = await redis.getInviteClient()
  const legacyInvites: { key: string; value: Invite }[] = await client.scan()
  for (const invite of legacyInvites) {
    if (!invite?.value?.info) {
      continue
    }
    if (env.MULTI_TENANCY && invite.value.info.tenantId !== tenantId) {
      continue
    }
    if (!results.has(invite.key)) {
      results.set(invite.key, { ...invite.value, code: invite.key })
    }
  }

  return Array.from(results.values())
}

export async function getExistingInvites(
  emails: string[]
): Promise<InviteWithCode[]> {
  return (await getInviteCodes()).filter(invite =>
    emails.includes(invite.email)
  )
}
