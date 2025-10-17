<script lang="ts">
  import { screenStore, componentStore } from "@/stores/builder"
  import { redirect } from "@roxi/routify"

  // Workaround for Routify 2 + Svelte 5 compatibility
  // See: https://github.com/roxiness/routify/issues/563
  $redirect

  $: screenId = $screenStore.selectedScreenId
  $: componentId = $componentStore.selectedComponentId
  if (screenId && componentId) {
    $redirect(`./${screenId}/${componentId}`)
  } else if (screenId) {
    $redirect(`./${$screenStore.selectedScreenId}`)
  } else if ($screenStore.screens.length > 0) {
    $redirect(`./${$screenStore.screens[0]._id}`)
  } else {
    $redirect("./new")
  }
</script>
