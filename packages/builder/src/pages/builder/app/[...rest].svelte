<script>
  import { redirect, params } from "@roxi/routify"
  import { onMount } from "svelte"

  onMount(() => {
    const restPath = $params.rest || ""
    const workspacesPath = `/builder/workspace/${restPath}`
    $redirect(workspacesPath)
  })
</script>

<!-- Catch-all redirect from /builder/app/* to /builder/workspace/* -->
