import { ImportSource, ImportInfo, Query } from "./base"
import { URL } from 'url'
const curlconverter = require("curlconverter")

const parseCurl = (data: string): any => {
  const curlJson = curlconverter.toJsonString(data)
  return JSON.parse(curlJson)
}

/**
 * Curl
 * https://curl.se/docs/manpage.html
 */
export class Curl extends ImportSource {
  curl: any

  isSupported = async (data: string): Promise<boolean> => {
    try {
      const curl = parseCurl(data)
      this.curl = curl
    } catch (err) {
      return false
    }
    return true
  }

  getInfo = async (): Promise<ImportInfo> => {
    const url = new URL(this.curl.url)
    return {
      url: url.origin,
      name: url.hostname,
    }
  }

  getQueries = async (datasourceId: string): Promise<Query[]> => {
    const url = new URL(this.curl.url)
    const name = url.pathname
    const path = url.pathname
    const method = this.curl.method
    const queryString = url.search
    const headers = this.curl.headers
  
    const query = this.constructQuery(
      datasourceId,
      name,
      method,
      path,
      queryString,
      headers
    )

    return [query]
  }
}
