<script>
  import { redirect } from "@roxi/routify"
  import { onMount } from "svelte"

  onMount(() => {
    const currentPath = window.location.href.replace(
      "/builder/portal/apps",
      "/builder/portal/workspaces"
    )
    $redirect(currentPath)
  })
</script>

<!-- Fallback redirect from /builder/portal/apps/* to /builder/portal/workspaces/* -->
