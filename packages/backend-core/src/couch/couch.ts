import env from "../environment"
import { getUrlInfo } from "../db/pouch"

export const getCouchInfo = () => {
  const urlInfo = getUrlInfo()
  let username
  let password
  if (env.COUCH_DB_USERNAME) {
    // set from env
    username = env.COUCH_DB_USERNAME
  } else if (urlInfo.auth.username) {
    // set from url
    username = urlInfo.auth.username
  } else if (!env.isTest()) {
    throw new Error("CouchDB username not set")
  }
  if (env.COUCH_DB_PASSWORD) {
    // set from env
    password = env.COUCH_DB_PASSWORD
  } else if (urlInfo.auth.password) {
    // set from url
    password = urlInfo.auth.password
  } else if (!env.isTest()) {
    throw new Error("CouchDB password not set")
  }
  const authCookie = Buffer.from(`${username}:${password}`).toString("base64")
  return {
    url: urlInfo.url!,
    auth: {
      username: username,
      password: password,
    },
    cookie: `Basic ${authCookie}`,
  }
}
