import env from "../environment"
export * from "../docIds/newid"
const bcrypt = env.JS_BCRYPT ? require("bcryptjs") : require("bcrypt")

const SALT_ROUNDS = env.SALT_ROUNDS || 10

export async function hash(data: string) {
  const salt = await bcrypt.genSalt(SALT_ROUNDS)
  return bcrypt.hash(data, salt)
}

export async function compare(data: string, encrypted: string) {
  return bcrypt.compare(data, encrypted)
}
