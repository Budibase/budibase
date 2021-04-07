const bcrypt = require("bcryptjs")

const SALT_ROUNDS = process.env.SALT_ROUNDS || 10

exports.hash = async data => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS)
  return bcrypt.hash(data, salt)
}

exports.compare = async (data, encrypted) => {
  return bcrypt.compare(data, encrypted)
}
