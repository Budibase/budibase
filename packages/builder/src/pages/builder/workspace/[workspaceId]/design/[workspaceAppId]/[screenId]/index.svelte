<script>
  import { redirect } from "@roxi/routify"
  import { screenStore } from "@/stores/builder"
  import { withWorkspaceHomeReturn } from "@/helpers/workspaceHomeNavigation"

  $redirect

  $: selectedScreenId = $screenStore.selectedScreenId

  $: if (selectedScreenId) {
    $redirect(
      withWorkspaceHomeReturn(`./${selectedScreenId}-screen`)
    )
  }
</script>
