<script>
  import { redirect } from "@roxi/routify"
  import { workspaceAppStore } from "@/stores/builder"

  $redirect

  $redirect(`./${$workspaceAppStore.selectedWorkspaceApp}`)
</script>
