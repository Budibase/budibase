<script>
  import { redirect } from "@roxi/routify"
  import { onMount } from "svelte"

  onMount(() => {
    const currentPath = window.location.href.replace(
      "/builder/app",
      "/builder/workspace"
    )
    $redirect(currentPath)
  })
</script>

<!-- Fallback redirect from /builder/app/* to /builder/workspace/* -->
