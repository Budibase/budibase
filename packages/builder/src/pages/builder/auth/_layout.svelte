<script>
  import { auth } from "stores/portal"
  import { onMount } from "svelte"
  import { redirect } from "@roxi/routify"

  // If already authenticated, redirect away from the auth section.
  // Check this onMount rather than a reactive statement to avoid trumping
  // the login return URL functionality.
  onMount(() => {
    if ($auth.user) {
      $redirect("../")
    }
  })
</script>

{#if !$auth.user}
  <slot />
{/if}
