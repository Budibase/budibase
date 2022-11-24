import env from "../environment"
const bcrypt = env.JS_BCRYPT ? require("bcryptjs") : require("bcrypt")
import { v4 } from "uuid"

const SALT_ROUNDS = env.SALT_ROUNDS || 10

export async function hash(data: string) {
  const salt = await bcrypt.genSalt(SALT_ROUNDS)
  return bcrypt.hash(data, salt)
}

export async function compare(data: string, encrypted: string) {
  return bcrypt.compare(data, encrypted)
}

export function newid() {
  return v4().replace(/-/g, "")
}
