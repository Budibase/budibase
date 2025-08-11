import { derived } from "svelte/store"
import { appStore, selectedScreen, workspaceAppStore } from "."
import { featureFlags } from "../portal"
import { buildLiveUrl, buildPreviewUrl } from "@/helpers/urls"

export const selectedAppUrls = derived(
  [workspaceAppStore, selectedScreen, featureFlags, appStore],
  ([$workspaceAppStore, $selectedScreen, $featureFlags, $appStore]) => {
    const selectedWorkspaceApp = $workspaceAppStore.selectedWorkspaceApp

    const route = $selectedScreen?.routing.route || ""
    const workspacePrefix =
      $featureFlags.WORKSPACE_APPS && selectedWorkspaceApp
        ? selectedWorkspaceApp.url
        : ""

    const previewUrl = buildPreviewUrl($appStore, workspacePrefix, route)

    const liveUrl = buildLiveUrl($appStore, workspacePrefix)
    return { previewUrl, liveUrl }
  }
)
