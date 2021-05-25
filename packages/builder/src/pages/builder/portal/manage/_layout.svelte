<script>
  import { Page } from "@budibase/bbui"
  import { auth } from "stores/portal"
  import { redirect } from "@roxi/routify"

  // Only admins allowed here
  $: {
    if (!$auth.isAdmin) {
      $redirect("../")
    }
  }
</script>

{#if $auth.isAdmin}
  <slot />
{/if}
