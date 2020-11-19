import { authenticate } from "./authenticate"
import { getAppId } from "../render/getAppId"

export async function baseApiCall(method, url, body) {
  return await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      "x-budibase-app-id": getAppId(window.document.cookie),
      "x-budibase-type": "client",
    },
    body: body && JSON.stringify(body),
    credentials: "same-origin",
  })
}

const apiCall = method => async ({ url, body }) => {
  const response = await baseApiCall(method, url, body)

  switch (response.status) {
    case 200:
      return response.json()
    case 404:
      return error(`${url} Not found`)
    case 400:
      return error(`${url} Bad Request`)
    case 403:
      return error(`${url} Forbidden`)
    default:
      if (response.status >= 200 && response.status < 400) {
        return response.json()
      }

      return error(`${url} - ${response.statusText}`)
  }
}

const post = apiCall("POST")
const get = apiCall("GET")
const patch = apiCall("PATCH")
const del = apiCall("DELETE")

const ERROR_MEMBER = "##error"
const error = message => {
  // appStore.update(s => s["##error_message"], message)
  return { [ERROR_MEMBER]: message }
}

const isSuccess = obj => !obj || !obj[ERROR_MEMBER]

const apiOpts = {
  isSuccess,
  error,
  post,
  get,
  patch,
  delete: del,
}

const saveRow = async (params, state) =>
  await post({
    url: `/api/${params.tableId}/rows`,
    body: makeRowRequestBody(params, state),
  })

const updateRow = async (params, state) => {
  const row = makeRowRequestBody(params, state)
  row._id = params._id
  await patch({
    url: `/api/${params.tableId}/rows/${params._id}`,
    body: row,
  })
}

const deleteRow = async params =>
  await del({
    url: `/api/${params.tableId}/rows/${params.rowId}/${params.revId}`,
  })

const makeRowRequestBody = (parameters, state) => {
  // start with the row thats currently in context
  const body = { ...(state.data || {}) }

  // dont send the table
  if (body._table) delete body._table

  // then override with supplied parameters
  if (parameters.fields) {
    for (let fieldName of Object.keys(parameters.fields)) {
      const field = parameters.fields[fieldName]

      // ensure fields sent are of the correct type
      if (field.type === "boolean") {
        if (field.value === "true") body[fieldName] = true
        if (field.value === "false") body[fieldName] = false
      } else if (field.type === "number") {
        const val = parseFloat(field.value)
        if (!isNaN(val)) {
          body[fieldName] = val
        }
      } else if (field.type === "datetime") {
        const date = new Date(field.value)
        if (!isNaN(date.getTime())) {
          body[fieldName] = date.toISOString()
        }
      } else {
        body[fieldName] = field.value
      }
    }
  }

  return body
}

export default {
  authenticate: authenticate(apiOpts),
  saveRow,
  updateRow,
  deleteRow,
}
