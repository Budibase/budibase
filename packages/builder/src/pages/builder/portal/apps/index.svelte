<script>
  import { redirect } from "@roxi/routify"
  import { onMount } from "svelte"
  
  onMount(() => {
    $redirect("/builder/portal/workspaces")
  })
</script>

<!-- Redirect from /builder/portal/apps to /builder/portal/workspaces -->