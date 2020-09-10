import { authenticate } from "./authenticate"
import { triggerWorkflow } from "./workflow"
import appStore from "../state/store"

const apiCall = method => async ({ url, body }) => {
  const response = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body && JSON.stringify(body),
    credentials: "same-origin",
  })

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
  const err = { [ERROR_MEMBER]: message }
  appStore.update(s => s["##error_message"], message)
  return err
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

const createRecord = async params =>
  await post({ url: `/api/${params.modelId}/records`, body: params.fields })

const updateRecord = async params => {
  const record = params.fields
  record._id = params._id
  await patch({
    url: `/api/${params.modelId}/records/${params._id}`,
    body: record,
  })
}

export default {
  authenticate: authenticate(apiOpts),
  triggerWorkflow: triggerWorkflow(apiOpts),
  createRecord,
  updateRecord,
}
