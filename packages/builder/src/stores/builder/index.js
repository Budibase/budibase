import { layoutStore } from "./layouts"
import { appStore } from "./app"
import { componentStore, selectedComponent } from "./components"
import { navigationStore } from "./navigation"
import { themeStore } from "./theme"
import { screenStore, selectedScreen, sortedScreens } from "./screens"
import { builderStore } from "./builder"
import { hoverStore } from "./hover"
import { previewStore } from "./preview"
import {
  automationStore,
  selectedAutomation,
  automationHistoryStore,
  evaluationContext,
} from "./automations"
import { userStore, userSelectedResourceMap, isOnlyUser } from "./users"
import { deploymentStore } from "./deployments"
import { contextMenuStore } from "./contextMenu"
import { snippets } from "./snippets"
import {
  screenComponentsList,
  screenComponentErrors,
  screenComponentErrorList,
} from "./screenComponent"

// Backend
import { tables } from "./tables"
import { views } from "./views"
import { viewsV2 } from "./viewsV2"
import { permissions } from "./permissions"
import { roles } from "./roles"
import { datasources } from "./datasources"
import { integrations } from "./integrations"
import { sortedIntegrations } from "./sortedIntegrations"
import { queries } from "./queries"
import { flags } from "./flags"
import { rowActions } from "./rowActions"
import componentTreeNodesStore from "./componentTreeNodes"
import { appPublished } from "./published"

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
  contextMenuStore,
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
  rowActions,
  appPublished,
  evaluationContext,
  screenComponentsList,
  screenComponentErrors,
  screenComponentErrorList,
}

export const reset = () => {
  appStore.reset()
  builderStore.reset()
  screenStore.reset()
  componentStore.reset()
  layoutStore.reset()
  navigationStore.reset()
  rowActions.reset()
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
