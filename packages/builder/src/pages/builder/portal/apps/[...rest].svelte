<script>
  import { redirect, params } from "@roxi/routify"
  import { onMount } from "svelte"

  onMount(() => {
    // Get the current path after /apps and redirect to /workspaces with the same path
    const restPath = $params.rest || ""
    const workspacesPath = `/builder/portal/workspaces/${restPath}`
    $redirect(workspacesPath)
  })
</script>

<!-- Catch-all redirect from /builder/portal/apps/* to /builder/portal/workspaces/* -->
