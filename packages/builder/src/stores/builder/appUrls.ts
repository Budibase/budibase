import { derived } from "svelte/store"
import { appStore, selectedScreen, workspaceAppStore } from "."
import { featureFlags } from "../portal"

export const selectedAppUrls = derived(
  [workspaceAppStore, selectedScreen, featureFlags, appStore],
  ([$workspaceAppStore, $selectedScreen, $featureFlags, $appStore]) => {
    const selectedWorkspaceApp = $workspaceAppStore.selectedWorkspaceApp

    const route = $selectedScreen?.routing.route || "/"
    const workspacePrefix =
      $featureFlags.WORKSPACE_APPS && selectedWorkspaceApp
        ? selectedWorkspaceApp.urlPrefix
        : ""

    const previewUrl = `/${$appStore.appId}${workspacePrefix}#${route}`

    const baseUrl = $appStore.url
      ? `/app${$appStore.url}`
      : `/${$appStore.appId}`
    const liveUrl = `${baseUrl}${workspacePrefix}#${route}`
    return { previewUrl, liveUrl }
  }
)
