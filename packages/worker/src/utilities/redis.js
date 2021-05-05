const { Client, utils } = require("@budibase/auth").redis
const { newid } = require("@budibase/auth").utils

const EXPIRE_TOKEN_SECONDS = 3600

async function getClient(db) {
  return await (new Client(db)).init()
}

async function writeACode(db, value) {
  const client = await getClient(db)
  const code = newid()
  await client.store(code, value, EXPIRE_TOKEN_SECONDS)
  client.finish()
  return code
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
 * @param {boolean} deleteCode If the code is used/finished with this will delete it.
 * @return {Promise<string>} returns the user ID if it is found
 */
exports.checkResetPasswordCode = async (resetCode, deleteCode = false) => {
  const client = await getClient(utils.Databases.PW_RESETS)
  const userId = await client.get(resetCode)
  if (deleteCode) {
    await client.delete(resetCode)
  }
  client.finish()
  return userId
}

/**
 * Generates an invitation code and writes it to redis - which can later be checked for user creation.
 * @param {string} email the email address which the code is being sent to (for use later).
 * @return {Promise<string>} returns the code that was stored to redis.
 */
exports.getInviteCode = async email => {
  return writeACode(utils.Databases.INVITATIONS, email)
}