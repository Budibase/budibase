const bcrypt = require("bcryptjs")

const SALT_ROUNDS = process.env.SALT_ROUNDS || 10

exports.hash = async data => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS)
  const result = await bcrypt.hash(data, salt)
  return result
}

exports.compare = async (data, encrypted) =>
  await bcrypt.compare(data, encrypted)
