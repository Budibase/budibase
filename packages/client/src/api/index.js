import { ERROR } from "../state/standardState"
import { loadRecord } from "./loadRecord"
import { listRecords } from "./listRecords"
import { authenticate } from "./authenticate"
import { saveRecord } from "./saveRecord"

export const createApi = ({ rootPath, setState, getState }) => {
  const apiCall = method => ({
    url,
    body,
    notFound,
    badRequest,
    forbidden,
  }) => {
    return fetch(`${rootPath}${url}`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body && JSON.stringify(body),
      credentials: "same-origin",
    }).then(r => {
      switch (r.status) {
        case 200:
          return r.json()
        case 404:
          return error(notFound || `${url} Not found`)
        case 400:
          return error(badRequest || `${url} Bad Request`)
        case 403:
          return error(forbidden || `${url} Forbidden`)
        default:
          if (
            r.status.toString().startsWith("2") ||
            r.status.toString().startsWith("3")
          )
            return r.json()
          else return error(`${url} - ${r.statusText}`)
      }
    })
  }

  const post = apiCall("POST")
  const get = apiCall("GET")
  const patch = apiCall("PATCH")
  const del = apiCall("DELETE")

  const ERROR_MEMBER = "##error"
  const error = message => {
    const e = {}
    e[ERROR_MEMBER] = message
    setState(ERROR, message)
    return e
  }

  const isSuccess = obj => !obj || !obj[ERROR_MEMBER]

  const apiOpts = {
    rootPath,
    setState,
    getState,
    isSuccess,
    error,
    post,
    get,
    patch,
    delete: del,
  }

  return {
    loadRecord: loadRecord(apiOpts),
    listRecords: listRecords(apiOpts),
    authenticate: authenticate(apiOpts),
    saveRecord: saveRecord(apiOpts),
  }
}
