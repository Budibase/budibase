import fetch from "node-fetch"
import { HttpError } from "koa"
import { get } from "../oauth2"

export async function generateToken(id: string) {
  const config = get(id)
  if (!config) {
    throw new HttpError(`oAuth config ${id} count not be found`)
  }

  await fetch("TODO", { method: "post" })
}
