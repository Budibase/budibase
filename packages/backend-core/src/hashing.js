const env = require("./environment")
const bcrypt = env.JS_BCRYPT ? require("bcryptjs") : require("bcrypt")
const { v4 } = require("uuid")

const SALT_ROUNDS = env.SALT_ROUNDS || 10

exports.hash = async data => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS)
  return bcrypt.hash(data, salt)
}

exports.compare = async (data, encrypted) => {
  return bcrypt.compare(data, encrypted)
}

exports.newid = function () {
  return v4().replace(/-/g, "")
}
