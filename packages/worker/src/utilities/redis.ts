import { redis, utils } from "@budibase/backend-core"

function getExpirySecondsForDB(db: string) {
  switch (db) {
    case redis.utils.Databases.PW_RESETS:
      // a hour
      return 3600
    case redis.utils.Databases.INVITATIONS:
      // a day
      return 86400
  }
}

let pwResetClient: any, invitationClient: any

function getClient(db: string) {
  switch (db) {
    case redis.utils.Databases.PW_RESETS:
      return pwResetClient
    case redis.utils.Databases.INVITATIONS:
      return invitationClient
  }
}

async function writeACode(db: string, value: any) {
  const client = await getClient(db)
  const code = utils.newid()
  await client.store(code, value, getExpirySecondsForDB(db))
  return code
}

async function getACode(db: string, code: string, deleteCode = true) {
  const client = await getClient(db)
  const value = await client.get(code)
  if (!value) {
    throw "Invalid code."
  }
  if (deleteCode) {
    await client.delete(code)
  }
  return value
}

export async function init() {
  pwResetClient = new redis.Client(redis.utils.Databases.PW_RESETS)
  invitationClient = new redis.Client(redis.utils.Databases.INVITATIONS)
  await pwResetClient.init()
  await invitationClient.init()
}

/**
 * make sure redis connection is closed.
 */
export async function shutdown() {
  if (pwResetClient) await pwResetClient.finish()
  if (invitationClient) await invitationClient.finish()
  console.log("Redis shutdown")
}

/**
 * Given a user ID this will store a code (that is returned) for an hour in redis.
 * The user can then return this code for resetting their password (through their reset link).
 * @param {string} userId the ID of the user which is to be reset.
 * @param {object} info Info about the user/the reset process.
 * @return {Promise<string>} returns the code that was stored to redis.
 */
export async function getResetPasswordCode(userId: string, info: any) {
  return writeACode(redis.utils.Databases.PW_RESETS, { userId, info })
}

/**
 * Given a reset code this will lookup to redis, check if the code is valid and delete if required.
 * @param {string} resetCode The code provided via the email link.
 * @param {boolean} deleteCode If the code is used/finished with this will delete it - defaults to true.
 * @return {Promise<string>} returns the user ID if it is found
 */
export async function checkResetPasswordCode(
  resetCode: string,
  deleteCode = true
) {
  try {
    return getACode(redis.utils.Databases.PW_RESETS, resetCode, deleteCode)
  } catch (err) {
    throw "Provided information is not valid, cannot reset password - please try again."
  }
}

/**
 * Generates an invitation code and writes it to redis - which can later be checked for user creation.
 * @param {string} email the email address which the code is being sent to (for use later).
 * @param {object|null} info Information to be carried along with the invitation.
 * @return {Promise<string>} returns the code that was stored to redis.
 */
export async function getInviteCode(email: string, info: any) {
  return writeACode(redis.utils.Databases.INVITATIONS, { email, info })
}

/**
 * Checks that the provided invite code is valid - will return the email address of user that was invited.
 * @param {string} inviteCode the invite code that was provided as part of the link.
 * @param {boolean} deleteCode whether or not the code should be deleted after retrieval - defaults to true.
 * @return {Promise<object>} If the code is valid then an email address will be returned.
 */
export async function checkInviteCode(
  inviteCode: string,
  deleteCode: boolean = true
) {
  try {
    return getACode(redis.utils.Databases.INVITATIONS, inviteCode, deleteCode)
  } catch (err) {
    throw "Invitation is not valid or has expired, please request a new one."
  }
}
