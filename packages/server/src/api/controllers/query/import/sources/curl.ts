import { ImportSource, ImportInfo } from "./base"
import { Query } from "../../../../../definitions/common"
import { URL } from "url"

const curlconverter = require("curlconverter")

// Type derived from examples on https://curlconverter.com/json/
interface CurlJSON {
  url: string
  raw_url: string
  method: string
  files?: {
    [key: string]: string
  }
  data?:
    | {
        [key: string]: unknown
      }
    | string
  auth?: {
    user: string
    password: string
  }
  auth_type?: "basic" | "bearer"
  headers?: {
    [key: string]: string
  }
  cookies?: {
    [key: string]: string
  }
  compressed?: boolean
}

const parseCurl = (data: string): CurlJSON => {
  return JSON.parse(curlconverter.toJsonString(data)) as CurlJSON
}

/**
 * The curl converter parses the request body into the key field of an object
 * e.g. --d '{"key":"val"}' produces an object { "{"key":"val"}" : "" }
 * This is not what we want, so we need to parse out the key from the object
 */
const parseBody = (curl: CurlJSON) => {
  if (!curl.data || typeof curl.data === "string") {
    return curl.data
  }

  let key = Object.keys(curl.data)[0]
  if (!key) {
    return curl.data
  }

  try {
    // filter out the dollar syntax used by curl for shell support
    if (key.startsWith("$")) {
      key = key.substring(1)
    }
    return JSON.parse(key)
  } catch (e) {
    // do nothing
  }

  return undefined
}

const parseCookie = (curl: CurlJSON) => {
  if (!curl.cookies) {
    return undefined
  }

  return Object.entries(curl.cookies)
    .map(([key, value]) => `${key}=${value};`)
    .join(" ")
}

/**
 * Curl
 * https://curl.se/docs/manpage.html
 */
export class Curl extends ImportSource {
  curl!: CurlJSON

  isSupported = async (data: string): Promise<boolean> => {
    try {
      this.curl = parseCurl(data)
    } catch (err) {
      return false
    }
    return true
  }

  getUrl = (): URL => {
    return new URL(this.curl.raw_url)
  }

  getInfo = async (): Promise<ImportInfo> => {
    const url = this.getUrl()
    return {
      name: url.hostname,
    }
  }

  getImportSource(): string {
    return "curl"
  }

  getQueries = async (datasourceId: string): Promise<Query[]> => {
    const url = this.getUrl()
    const name = url.pathname
    const path = url.origin + url.pathname
    const method = this.curl.method
    const queryString = url.search
    const headers = this.curl.headers || {}
    const requestBody = parseBody(this.curl)

    const cookieHeader = parseCookie(this.curl)
    if (cookieHeader) {
      headers["Cookie"] = cookieHeader
    }

    const query = this.constructQuery(
      datasourceId,
      name,
      method,
      path,
      undefined,
      queryString,
      headers,
      [],
      requestBody
    )

    return [query]
  }
}
