import API from "./api"

/**
 * Fetches screen definition for an app.
 */
export const fetchAppDefinition = async appId => {
  return await API.get({
    url: `/api/applications/${appId}/definition`,
  })
}

/* Fetches application package */
export const fetchAppPackage = async appId => {
  return await API.get({
    url: `/api/applications/${appId}/appPackage`,
  })
}


