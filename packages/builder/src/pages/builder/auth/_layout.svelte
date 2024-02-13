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
    let url = new URL(window.location.href)
    let hostname = url.hostname
    let parts = hostname.split(".")
    let tenantId = parts[0]
    let domain = parts.slice(-2).join(".")
    console.log(domain)
    CookieUtils.setCookie("tenantId", tenantId, domain)
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
