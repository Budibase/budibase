const crypto = require("crypto")
const env = require("../environment")

const ALGO = "aes-256-ctr"
const SECRET = env.JWT_SECRET
const SEPARATOR = "/"

exports.encrypt = input => {
  const random = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(ALGO, SECRET, random)
  const base = cipher.update(input)
  const final = cipher.final()
  const encrypted = Buffer.concat([base, final]).toString("hex")
  return `${random.toString("hex")}${SEPARATOR}${encrypted}`
}

exports.decrypt = input => {
  const [random, encrypted] = input.split(SEPARATOR)
  const decipher = crypto.createDecipheriv(
    ALGO,
    SECRET,
    Buffer.from(random, "hex")
  )
  const base = decipher.update(Buffer.from(encrypted, "hex"))
  const final = decipher.final()
  return Buffer.concat([base, final]).toString()
}
