<script>
  import { auth, admin } from "stores/portal"
  import { redirect } from "@roxi/routify"
  import { CookieUtils } from "@budibase/frontend-core"

  // If already authenticated, redirect away from the auth section.
  // Check this onMount rather than a reactive statement to avoid trumping
  // the login return URL functionality.
  if ($auth.user && !$auth.user.forceResetPassword) {
    $redirect("../")
  }

  if ($admin?.checklist?.branding) {
    let url = new URL("http://hello.petertest.com:10001/auth/login")
    let hostname = url.hostname
    let parts = hostname.split(".")
    let tenantId = parts[0]
    CookieUtils.setCookie("tenantId", tenantId, "petertest.com")
  }

  if (
    !$auth.user &&
    $admin.cloud &&
    !$admin.disableAccountPortal &&
    $admin.accountPortalUrl &&
    !$admin?.checklist?.sso?.checked
  ) {
    window.location.href = $admin.accountPortalUrl
  }
</script>

{#if !$auth.user || $auth.user.forceResetPassword}
  <slot />
{/if}
