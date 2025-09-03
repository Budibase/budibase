<script>
  import { params, redirect } from "@roxi/routify"
  import { screenStore } from "@/stores/builder"

  $: screen = $screenStore.screens.find(s => s._id === $params.id)

  $: screen && $redirect(`./${screen.workspaceAppId}/${screen._id}`)
</script>
