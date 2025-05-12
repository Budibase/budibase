import { appStore } from "./app"
import {
  automationHistoryStore,
  automationStore,
  evaluationContext,
  selectedAutomation,
} from "./automations"
import { builderStore } from "./builder"
import { componentStore, selectedComponent } from "./components"
import { contextMenuStore } from "./contextMenu"
import { deploymentStore } from "./deployments"
import { hoverStore } from "./hover"
import { layoutStore } from "./layouts"
import { navigationStore } from "./navigation"
import { previewStore } from "./preview"
import {
  screenComponentErrorList,
  screenComponentErrors,
  screenComponentsList,
} from "./screenComponent"
import { screenStore, selectedScreen, sortedScreens } from "./screens"
import { snippets } from "./snippets"
import { themeStore } from "./theme"
import { isOnlyUser, userSelectedResourceMap, userStore } from "./users"

// Backend
import componentTreeNodesStore from "./componentTreeNodes"
import { datasources } from "./datasources"
import { flags } from "./flags"
import { integrations } from "./integrations"
import { oauth2 } from "./oauth2"
import { permissions } from "./permissions"
import { projectAppStore, selectedProjectAppId } from "./projectApps"
import { appPublished } from "./published"
import { queries } from "./queries"
import { roles } from "./roles"
import { rowActions } from "./rowActions"
import { sortedIntegrations } from "./sortedIntegrations"
import { tables } from "./tables"
import { views } from "./views"
import { viewsV2 } from "./viewsV2"

import { FetchAppPackageResponse } from "@budibase/types"

export {
  appPublished,
  appStore,
  automationHistoryStore,
  automationStore,
  builderStore,
  componentStore,
  componentTreeNodesStore,
  contextMenuStore,
  datasources,
  deploymentStore,
  evaluationContext,
  flags,
  hoverStore,
  integrations,
  isOnlyUser,
  layoutStore,
  navigationStore,
  oauth2,
  permissions,
  previewStore,
  projectAppStore,
  queries,
  roles,
  rowActions,
  screenComponentErrorList,
  screenComponentErrors,
  screenComponentsList,
  screenStore,
  selectedAutomation,
  selectedComponent,
  selectedProjectAppId,
  selectedScreen,
  snippets,
  sortedIntegrations,
  sortedScreens,
  tables,
  themeStore,
  userSelectedResourceMap,
  userStore,
  views,
  viewsV2,
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

export const initialise = async (pkg: FetchAppPackageResponse) => {
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
  projectAppStore.syncAppProjectApps(pkg)
  resetBuilderHistory()
  await refreshBuilderData()
}
