<script>
  import { Page } from "@budibase/bbui"
  import { auth } from "stores/portal"
  import { page, redirect } from "@roxi/routify"

  // Only admins allowed here
  $: {
    if (!$auth.isAdmin) {
      $redirect("../")
    }
  }
</script>

{#if $auth.isAdmin}
  <Page wide={$page.path.includes("email/:template")}>
    <slot />
  </Page>
{/if}
