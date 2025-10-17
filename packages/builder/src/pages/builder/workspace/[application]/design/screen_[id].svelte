<script>
  import { params, redirect } from "@roxi/routify"
  import { screenStore } from "@/stores/builder"

  $params
  $redirect

  $: screen = $screenStore.screens.find(s => s._id === $params.id)

  $: screen && $redirect(`./${screen.workspaceAppId}/${screen._id}`)
</script>
