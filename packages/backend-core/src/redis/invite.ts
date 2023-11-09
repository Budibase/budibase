import { redis, utils, tenancy } from "../"
import env from "../environment"

const TTL_SECONDS = 60 * 60 * 24 * 7

interface Invite {
  email: string
  info: any
}

interface InviteWithCode extends Invite {
  code: string
}

let client: redis.Client

async function getClient(): Promise<redis.Client> {
  if (!client) {
    client = new redis.Client(redis.utils.Databases.INVITATIONS)
    await client.init()
  }
  return client
}

/**
 * Given an invite code and invite body, allow the update an existing/valid invite in redis
 * @param inviteCode The invite code for an invite in redis
 * @param value The body of the updated user invitation
 */
export async function updateInviteCode(code: string, value: Invite) {
  const client = await getClient()
  await client.store(code, value, TTL_SECONDS)
}

/**
 * Generates an invitation code and writes it to redis - which can later be checked for user creation.
 * @param email the email address which the code is being sent to (for use later).
 * @param info Information to be carried along with the invitation.
 * @return returns the code that was stored to redis.
 */
export async function createInviteCode(
  email: string,
  info: any
): Promise<string> {
  const client = await getClient()
  const code = utils.newid()
  await client.store(code, { email, info }, TTL_SECONDS)
  return code
}

/**
 * Checks that the provided invite code is valid - will return the email address of user that was invited.
 * @param inviteCode the invite code that was provided as part of the link.
 * @return If the code is valid then an email address will be returned.
 */
export async function getInviteCode(code: string): Promise<Invite> {
  const client = await getClient()
  const value = (await client.get(code)) as Invite | undefined
  if (!value) {
    throw "Invitation is not valid or has expired, please request a new one."
  }
  return value
}

export async function deleteInviteCode(code: string) {
  const client = await getClient()
  await client.delete(code)
}

/** 
  Get all currently available user invitations for the current tenant.
**/
export async function getInviteCodes(): Promise<InviteWithCode[]> {
  const client = await getClient()
  const invites: { key: string; value: Invite }[] = await client.scan()

  const results: InviteWithCode[] = invites.map(invite => {
    return {
      ...invite.value,
      code: invite.key,
    }
  })
  if (!env.MULTI_TENANCY) {
    return results
  }
  const tenantId = tenancy.getTenantId()
  return results.filter(invite => tenantId === invite.info.tenantId)
}

export async function getExistingInvites(
  emails: string[]
): Promise<InviteWithCode[]> {
  return (await getInviteCodes()).filter(invite =>
    emails.includes(invite.email)
  )
}
