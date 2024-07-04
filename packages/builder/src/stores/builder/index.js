import { appStore } from "./app.js"
import {
  automationHistoryStore,
  automationStore,
  selectedAutomation,
} from "./automations.js"
import { builderStore } from "./builder.js"
import { componentStore, selectedComponent } from "./components"
import { deploymentStore } from "./deployments.js"
import { hoverStore } from "./hover.js"
import { layoutStore } from "./layouts.js"
import { navigationStore } from "./navigation.js"
import { previewStore } from "./preview.js"
import { screenStore, selectedScreen, sortedScreens } from "./screens.js"
import { snippets } from "./snippets"
import { themeStore } from "./theme.js"
import { isOnlyUser, userSelectedResourceMap, userStore } from "./users.js"

import componentTreeNodesStore from "./componentTreeNodes"
import { datasources } from "./datasources"
import { flags } from "./flags"
import { integrations } from "./integrations"
import { permissions } from "./permissions"
import { queries } from "./queries"
import { roles } from "./roles"
import { sortedIntegrations } from "./sortedIntegrations"
// Backend
import { tables } from "./tables"
import { views } from "./views"
import { viewsV2 } from "./viewsV2"

export {
  componentTreeNodesStore,
  layoutStore,
  appStore,
  componentStore,
  navigationStore,
  themeStore,
  screenStore,
  selectedScreen,
  builderStore,
  userSelectedResourceMap,
  previewStore,
  automationStore,
  selectedAutomation,
  automationHistoryStore,
  sortedScreens,
  userStore,
  isOnlyUser,
  deploymentStore,
  selectedComponent,
  tables,
  views,
  viewsV2,
  permissions,
  roles,
  datasources,
  integrations,
  sortedIntegrations,
  queries,
  flags,
  hoverStore,
  snippets,
}

export const reset = () => {
  appStore.reset()
  builderStore.reset()
  screenStore.reset()
  componentStore.reset()
  layoutStore.reset()
  navigationStore.reset()
}

const refreshBuilderData = async () => {
  await Promise.all([
    automationStore.actions.fetch(),
    datasources.init(),
    integrations.init(),
    queries.init(),
    tables.init(),
    roles.fetch(),
    flags.fetch(),
  ])
}

const resetBuilderHistory = () => {
  screenStore.history.reset()
  automationHistoryStore.reset()
}

export const initialise = async pkg => {
  const { application } = pkg
  // must be first operation to make sure subsequent requests have correct app ID
  appStore.syncAppPackage(pkg)
  await Promise.all([
    appStore.syncAppRoutes(),
    componentStore.refreshDefinitions(application?.appId),
  ])
  builderStore.init(application)
  navigationStore.syncAppNavigation(application?.navigation)
  themeStore.syncAppTheme(application)
  snippets.syncMetadata(application)
  screenStore.syncAppScreens(pkg)
  layoutStore.syncAppLayouts(pkg)
  resetBuilderHistory()
  await refreshBuilderData()
}
