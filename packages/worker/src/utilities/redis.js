const { Client, utils } = require("@budibase/auth/redis")
const { newid } = require("@budibase/auth").utils

function getExpirySecondsForDB(db) {
  switch (db) {
    case utils.Databases.PW_RESETS:
      // a hour
      return 3600
    case utils.Databases.INVITATIONS:
      // a day
      return 86400
  }
}

let pwResetClient, invitationClient

function getClient(db) {
  switch (db) {
    case utils.Databases.PW_RESETS:
      return pwResetClient
    case utils.Databases.INVITATIONS:
      return invitationClient
  }
}

async function writeACode(db, value) {
  const client = await getClient(db)
  const code = newid()
  await client.store(code, value, getExpirySecondsForDB(db))
  return code
}

async function getACode(db, code, deleteCode = true) {
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

exports.init = async () => {
  pwResetClient = await new Client(utils.Databases.PW_RESETS).init()
  invitationClient = await new Client(utils.Databases.INVITATIONS).init()
}

/**
 * make sure redis connection is closed.
 */
exports.shutdown = async () => {
  if (pwResetClient) await pwResetClient.finish()
  if (invitationClient) await invitationClient.finish()
}

/**
 * Given a user ID this will store a code (that is returned) for an hour in redis.
 * The user can then return this code for resetting their password (through their reset link).
 * @param {string} userId the ID of the user which is to be reset.
 * @return {Promise<string>} returns the code that was stored to redis.
 */
exports.getResetPasswordCode = async userId => {
  return writeACode(utils.Databases.PW_RESETS, userId)
}

/**
 * Given a reset code this will lookup to redis, check if the code is valid and delete if required.
 * @param {string} resetCode The code provided via the email link.
 * @param {boolean} deleteCode If the code is used/finished with this will delete it - defaults to true.
 * @return {Promise<string>} returns the user ID if it is found
 */
exports.checkResetPasswordCode = async (resetCode, deleteCode = true) => {
  try {
    return getACode(utils.Databases.PW_RESETS, resetCode, deleteCode)
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
exports.getInviteCode = async (email, info) => {
  return writeACode(utils.Databases.INVITATIONS, { email, info })
}

/**
 * Checks that the provided invite code is valid - will return the email address of user that was invited.
 * @param {string} inviteCode the invite code that was provided as part of the link.
 * @param {boolean} deleteCode whether or not the code should be deleted after retrieval - defaults to true.
 * @return {Promise<object>} If the code is valid then an email address will be returned.
 */
exports.checkInviteCode = async (inviteCode, deleteCode = true) => {
  try {
    return getACode(utils.Databases.INVITATIONS, inviteCode, deleteCode)
  } catch (err) {
    throw "Invitation is not valid or has expired, please request a new one."
  }
}
