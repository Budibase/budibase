<script>
  import { redirect } from "@roxi/routify"
  import { screenStore } from "@/stores/builder"

  // Workaround for Routify 2 + Svelte 5 compatibility
  // See: https://github.com/roxiness/routify/issues/563
  $redirect

  $redirect(`./${$screenStore.selectedScreenId}-screen`)
</script>
