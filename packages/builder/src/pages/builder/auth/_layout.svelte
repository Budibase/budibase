<script>
  import { auth, admin } from "stores/portal"
  import { redirect } from "@roxi/routify"

  // If already authenticated, redirect away from the auth section.
  // Check this onMount rather than a reactive statement to avoid trumping
  // the login return URL functionality.
  if ($auth.user && !$auth.user.forceResetPassword) {
    $redirect("../")
  }

  if (
    !$auth.user &&
    $admin.cloud &&
    !$admin.disableAccountPortal &&
    $admin.accountPortalUrl &&
    !$admin?.checklist?.sso?.checked &&
    !$admin.checklist.branding
  ) {
    window.location.href = $admin.accountPortalUrl
  }
</script>

{#if !$auth.user || $auth.user.forceResetPassword}
  <slot />
{/if}
