import { redis, utils, tenancy } from "@budibase/backend-core"
import env from "../environment"

interface Invite {
  email: string
  info: any
}

interface InviteWithCode extends Invite {
  code: string
}

interface PasswordReset {
  userId: string
  info: any
}

type RedisDBName =
  | redis.utils.Databases.PW_RESETS
  | redis.utils.Databases.INVITATIONS
let pwResetClient: redis.Client, invitationClient: redis.Client

export async function init() {
  pwResetClient = new redis.Client(redis.utils.Databases.PW_RESETS)
  invitationClient = new redis.Client(redis.utils.Databases.INVITATIONS)
  await pwResetClient.init()
  await invitationClient.init()
}

export async function shutdown() {
  if (pwResetClient) await pwResetClient.finish()
  if (invitationClient) await invitationClient.finish()
  // shutdown core clients
  await redis.clients.shutdown()
  console.log("Redis shutdown")
}

function getExpirySecondsForDB(db: RedisDBName) {
  switch (db) {
    case redis.utils.Databases.PW_RESETS:
      // a hour
      return 3600
    case redis.utils.Databases.INVITATIONS:
      // a week
      return 604800
    default:
      throw new Error(`Unknown redis database: ${db}`)
  }
}

function getClient(db: RedisDBName): redis.Client {
  switch (db) {
    case redis.utils.Databases.PW_RESETS:
      return pwResetClient
    case redis.utils.Databases.INVITATIONS:
      return invitationClient
    default:
      throw new Error(`Unknown redis database: ${db}`)
  }
}

async function writeCode(db: RedisDBName, value: Invite | PasswordReset) {
  const client = getClient(db)
  const code = utils.newid()
  await client.store(code, value, getExpirySecondsForDB(db))
  return code
}

async function updateCode(
  db: RedisDBName,
  code: string,
  value: Invite | PasswordReset
) {
  const client = getClient(db)
  await client.store(code, value, getExpirySecondsForDB(db))
}

/**
 * Given an invite code and invite body, allow the update an existing/valid invite in redis
 * @param inviteCode The invite code for an invite in redis
 * @param value The body of the updated user invitation
 */
export async function updateInviteCode(code: string, value: Invite) {
  await updateCode(redis.utils.Databases.INVITATIONS, code, value)
}

async function deleteCode(db: RedisDBName, code: string) {
  const client = getClient(db)
  await client.delete(code)
}

async function getCode(db: RedisDBName, code: string) {
  const client = getClient(db)
  const value = await client.get(code)
  if (!value) {
    throw new Error(`Could not find code: ${code}`)
  }
  return value
}

/**
 * Given a user ID this will store a code (that is returned) for an hour in redis.
 * The user can then return this code for resetting their password (through their reset link).
 * @param userId the ID of the user which is to be reset.
 * @param info Info about the user/the reset process.
 * @return returns the code that was stored to redis.
 */
export async function createResetPasswordCode(userId: string, info: any) {
  return writeCode(redis.utils.Databases.PW_RESETS, { userId, info })
}

/**
 * Given a reset code this will lookup to redis, check if the code is valid.
 * @param resetCode The code provided via the email link.
 * @return returns the user ID if it is found
 */
export async function getResetPasswordCode(
  code: string
): Promise<PasswordReset> {
  try {
    return getCode(redis.utils.Databases.PW_RESETS, code)
  } catch (err) {
    throw "Provided information is not valid, cannot reset password - please try again."
  }
}

/**
 * Generates an invitation code and writes it to redis - which can later be checked for user creation.
 * @param email the email address which the code is being sent to (for use later).
 * @param info Information to be carried along with the invitation.
 * @return returns the code that was stored to redis.
 */
export async function createInviteCode(email: string, info: any) {
  return writeCode(redis.utils.Databases.INVITATIONS, { email, info })
}

/**
 * Checks that the provided invite code is valid - will return the email address of user that was invited.
 * @param inviteCode the invite code that was provided as part of the link.
 * @return If the code is valid then an email address will be returned.
 */
export async function getInviteCode(code: string): Promise<Invite> {
  try {
    return getCode(redis.utils.Databases.INVITATIONS, code)
  } catch (err) {
    throw "Invitation is not valid or has expired, please request a new one."
  }
}

export async function deleteInviteCode(code: string) {
  return deleteCode(redis.utils.Databases.INVITATIONS, code)
}

/** 
  Get all currently available user invitations for the current tenant.
**/
export async function getInviteCodes(): Promise<InviteWithCode[]> {
  const client = getClient(redis.utils.Databases.INVITATIONS)
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
