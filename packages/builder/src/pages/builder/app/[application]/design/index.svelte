<script lang="ts">
  import { featureFlag } from "@/helpers"
  import {
    screenStore,
    workspaceAppStore,
    componentStore,
  } from "@/stores/builder"
  import { FeatureFlag } from "@budibase/types"
  import { redirect } from "@roxi/routify"

  $: screenId = $screenStore.selectedScreenId
  $: componentId = $componentStore.selectedComponentId
  $: {
    if (
      featureFlag.isEnabled(FeatureFlag.WORKSPACE_APPS) &&
      $workspaceAppStore.workspaceApps?.[0]?.screens?.[0]
    ) {
      $redirect(`./${$workspaceAppStore.workspaceApps[0].screens[0]._id}`)
    } else if (screenId && componentId) {
      $redirect(`./${screenId}/${componentId}`)
    } else if (screenId) {
      $redirect(`./${$screenStore.selectedScreenId}`)
    } else if ($screenStore.screens.length > 0) {
      $redirect(`./${$screenStore.screens[0]._id}`)
    } else {
      $redirect("./new")
    }
  }
</script>
