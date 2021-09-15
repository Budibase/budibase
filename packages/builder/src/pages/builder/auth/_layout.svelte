<script>
  import { auth, admin } from "stores/portal"
  import { onMount } from "svelte"
  import { redirect } from "@roxi/routify"

  // If already authenticated, redirect away from the auth section.
  // Check this onMount rather than a reactive statement to avoid trumping
  // the login return URL functionality.
  onMount(() => {
    if ($auth.user && !$auth.user.forceResetPassword) {
      $redirect("../")
    }

    // redirect to account portal for authentication in the cloud
    if ($admin.cloud && $admin.accountPortalUrl) {
      window.location.href = $admin.accountPortalUrl
    }
  })
</script>

{#if !$auth.user || $auth.user.forceResetPassword}
  <slot />
{/if}
