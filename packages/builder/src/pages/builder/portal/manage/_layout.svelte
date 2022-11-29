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

  $: wide = $page.path.includes("email/:template")
</script>

{#if $auth.isAdmin}
  <Page maxWidth="90ch" {wide}>
    <slot />
  </Page>
{/if}
