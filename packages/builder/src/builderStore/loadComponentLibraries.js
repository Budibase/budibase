import { get } from "builderStore/api"

/**
 * Fetches the definitions for component library components. This includes
 * their props and other metadata from components.json.
 * @param {string} appId - ID of the currently running app
 */
export const fetchComponentLibDefinitions = async appId => {
  const LIB_DEFINITION_URL = `/api/${appId}/components/definitions`
  try {
    const libDefinitionResponse = await get(LIB_DEFINITION_URL)
    return await libDefinitionResponse.json()
  } catch (err) {
    console.error(`Error fetching component definitions for ${appId}`, err)
  }
}
