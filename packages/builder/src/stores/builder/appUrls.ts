import { derived } from "svelte/store"
import { appStore, selectedScreen, workspaceAppStore } from "."

import { buildLiveUrl, buildPreviewUrl } from "@/helpers/urls"

export const selectedAppUrls = derived(
  [workspaceAppStore, selectedScreen, appStore],
  ([$workspaceAppStore, $selectedScreen, $appStore]) => {
    const selectedWorkspaceApp = $workspaceAppStore.selectedWorkspaceApp

    const route = $selectedScreen?.routing.route || ""
    const workspacePrefix = selectedWorkspaceApp ? selectedWorkspaceApp.url : ""

    const previewUrl = buildPreviewUrl($appStore, workspacePrefix, route, true)

    const liveUrl = buildLiveUrl($appStore, workspacePrefix, true)
    return { previewUrl, liveUrl }
  }
)
