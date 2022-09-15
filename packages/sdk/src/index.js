import * as BudibaseApi from "../sdk"

let ApiClient = new BudibaseApi.ApiClient()

// Default to current host
ApiClient.basePath = "/api/public/v1"

/**
 * Configures the Budibase Public API SDK
 * @param apiKey the user's API key
 * @param host the Budibase server host
 */
export const configure = ({ apiKey, host }) => {
  ApiClient.authentications["ApiKeyAuth"].apiKey = apiKey
  ApiClient.basePath = `${host || ""}/api/public/v1`
}

/**
 * Promisifies a generated API SDK and turns it into a more traditional async
 * function.
 * @param apiName the name of the generated API SDK to promisify
 */
const promisify = apiName => {
  // Construct an instance of the generated API
  let api = new BudibaseApi[apiName](ApiClient)

  // Patch each API endpoint and promisify it
  let fns = Object.getOwnPropertyNames(Object.getPrototypeOf(api))
  fns = fns.filter(x => x !== "constructor")
  fns.forEach(fn => {
    const generated = api[fn].bind(api)
    api[fn] = async (...params) => {
      return new Promise((resolve, reject) => {
        generated(...params, (error, data) => {
          if (error) {
            reject(error)
          } else {
            resolve(data)
          }
        })
      })
    }
  })
  return api
}

export const ApplicationsApi = promisify("ApplicationsApi")
export const QueriesApi = new BudibaseApi.QueriesApi(ApiClient)
export const RowsApi = promisify("RowsApi")
export const TablesApi = promisify("TablesApi")
export const UsersApi = promisify("UsersApi")
