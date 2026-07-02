<script>
  import { auth, admin } from "@/stores/portal"
  import { CookieUtils } from "@budibase/frontend-core"
  import { helpers } from "@budibase/shared-core"

  let redirectedAway = false

  $: if (
    !redirectedAway &&
    $auth.loaded &&
    $auth.user &&
    !$auth.user.forceResetPassword
  ) {
    redirectedAway = true
    window.location.href = helpers.getDefaultPostLoginPath($auth.user)
  }

  if ($admin?.cloud && $admin?.checklist?.branding) {
    let url = new URL(window.location.href)
    let hostname = url.hostname
    let parts = hostname.split(".")
    let newTenantId = parts[0]
    let domain = parts.slice(-2).join(".")

    let existingTenantId = CookieUtils.getCookie("tenantId")

    if (!existingTenantId || existingTenantId !== newTenantId) {
      CookieUtils.setCookie("tenantId", newTenantId, domain)
    }
  }
</script>

{#if !$auth.user || $auth.user.forceResetPassword}
  <slot />
{/if}
