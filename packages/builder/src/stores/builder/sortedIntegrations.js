import { integrations } from "./integrations"
import { derived } from "svelte/store"

import { DatasourceTypes } from "constants/backend"

const getIntegrationOrder = type => {
  if (type === DatasourceTypes.API) return 1
  if (type === DatasourceTypes.RELATIONAL) return 2
  if (type === DatasourceTypes.NON_RELATIONAL) return 3

  // Sort all others arbitrarily by the first character of their name.
  // Character codes can technically be as low as 0, so make sure the number is at least 4
  return type.charCodeAt(0) + 4
}

export const createSortedIntegrationsStore = () => {
  return derived(integrations, $integrations => {
    const integrationsAsArray = Object.entries($integrations).map(
      ([name, integration]) => ({
        name,
        ...integration,
      })
    )

    return integrationsAsArray.sort((integrationA, integrationB) => {
      const integrationASortOrder = getIntegrationOrder(integrationA.type)
      const integrationBSortOrder = getIntegrationOrder(integrationB.type)
      if (integrationASortOrder === integrationBSortOrder) {
        return integrationA.friendlyName.localeCompare(
          integrationB.friendlyName
        )
      }

      return integrationASortOrder < integrationBSortOrder ? -1 : 1
    })
  })
}

export const sortedIntegrations = createSortedIntegrationsStore()
