import { derived } from "svelte/store"
import { workspaceStore, selectedScreen, workspaceAppStore } from "."

import { buildLiveUrl, buildPreviewUrl } from "@/helpers/urls"

export const selectedAppUrls = derived(
  [workspaceAppStore, selectedScreen, workspaceStore],
  ([$workspaceAppStore, $selectedScreen, $workspaceStore]) => {
    const selectedWorkspaceApp = $workspaceAppStore.selectedWorkspaceApp

    const route = $selectedScreen?.routing.route || ""
    const workspacePrefix = selectedWorkspaceApp ? selectedWorkspaceApp.url : ""

    const previewUrl = buildPreviewUrl($workspaceStore, workspacePrefix, route, true)

    const liveUrl = buildLiveUrl($workspaceStore, workspacePrefix, true)
    return { previewUrl, liveUrl }
  }
)
