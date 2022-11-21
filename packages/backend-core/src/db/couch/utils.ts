import { getCouchInfo } from "./connections"
import fetch from "node-fetch"
import { checkSlashesInUrl } from "../../helpers"

export async function directCouchCall(
  path: string,
  method: string = "GET",
  body?: any
) {
  let { url, cookie } = getCouchInfo()
  const couchUrl = `${url}/${path}`
  const params: any = {
    method: method,
    headers: {
      Authorization: cookie,
    },
  }
  if (body && method !== "GET") {
    params.body = JSON.stringify(body)
    params.headers["Content-Type"] = "application/json"
  }
  return await fetch(checkSlashesInUrl(encodeURI(couchUrl)), params)
}

export async function directCouchQuery(
  path: string,
  method: string = "GET",
  body?: any
) {
  const response = await directCouchCall(path, method, body)
  if (response.status < 300) {
    return await response.json()
  } else {
    throw "Cannot connect to CouchDB instance"
  }
}
