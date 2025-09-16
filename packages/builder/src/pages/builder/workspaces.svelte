<script>
  // This file should not be needed, but because an error we marked /builder/apps as redirect to /builder/workspaces.
  // This should not be the case, and it has been fixed. This will fix any user that has it cached on the browser.
  import { redirect } from "@roxi/routify"

  $: $redirect(`./apps`)
</script>
