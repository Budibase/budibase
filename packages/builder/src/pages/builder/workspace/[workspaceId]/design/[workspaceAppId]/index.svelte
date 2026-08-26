<script>
  import { redirect } from "@roxi/routify"
  import { workspaceAppStore } from "@/stores/builder"
  import { withWorkspaceHomeReturn } from "@/helpers/workspaceHomeNavigation"

  $redirect

  $redirect(
    withWorkspaceHomeReturn(`./${$workspaceAppStore.selectedWorkspaceApp}`)
  )
</script>
