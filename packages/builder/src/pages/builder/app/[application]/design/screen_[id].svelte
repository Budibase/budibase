<script>
  import { params, redirect } from "@roxi/routify"
  import { screenStore } from "@/stores/builder"

  // Workaround for Routify 2 + Svelte 5 compatibility
  // See: https://github.com/roxiness/routify/issues/563
  $params
  $redirect

  $: screen = $screenStore.screens.find(s => s._id === $params.id)

  $: screen && $redirect(`./${screen.workspaceAppId}/${screen._id}`)
</script>
