<script>
  import { isActive, redirect, params } from "@roxi/routify"
  import { admin, auth } from "stores/portal"
  import { onMount } from "svelte"

  let loaded = false

  $: multiTenancyEnabled = $admin.multiTenancy
  $: hasAdminUser = $admin?.checklist?.adminUser?.checked
  $: tenantSet = $auth.tenantSet
  $: cloud = $admin.cloud
  $: user = $auth.user

  $: useAccountPortal = cloud && !$admin.disableAccountPortal

  const validateTenantId = async () => {
    const host = window.location.host
    if (host.includes("localhost:")) {
      // ignore local dev
      return
    }

    // e.g. ['tenant', 'budibase', 'app'] vs ['budibase', 'app']
    let urlTenantId
    const hostParts = host.split(".")
    if (hostParts.length > 2) {
      urlTenantId = hostParts[0]
    }

    if (user && user.tenantId) {
      if (!urlTenantId) {
        // redirect to correct tenantId subdomain
        if (!window.location.host.includes("localhost")) {
          let redirectUrl = window.location.href
          redirectUrl = redirectUrl.replace("://", `://${user.tenantId}.`)
          window.location.href = redirectUrl
        }
        return
      }

      if (user.tenantId !== urlTenantId) {
        // user should not be here - play it safe and log them out
        await auth.logout()
        await auth.setOrganisation(null)
        return
      }
    } else {
      // no user - set the org according to the url
      await auth.setOrganisation(urlTenantId)
    }
  }

  onMount(async () => {
    if ($params["?template"]) {
      await auth.setInitInfo({ init_template: $params["?template"] })
    }

    await auth.checkAuth()
    await admin.init()

    if (useAccountPortal && multiTenancyEnabled) {
      await validateTenantId()
    }

    loaded = true
  })

  $: {
    const apiReady = $admin.loaded && $auth.loaded
    // if tenant is not set go to it
    if (
      loaded &&
      !useAccountPortal &&
      apiReady &&
      multiTenancyEnabled &&
      !tenantSet
    ) {
      $redirect("./auth/org")
    }
    // Force creation of an admin user if one doesn't exist
    else if (loaded && !useAccountPortal && apiReady && !hasAdminUser) {
      $redirect("./admin")
    }
    // Redirect to log in at any time if the user isn't authenticated
    else if (
      loaded &&
      (hasAdminUser || cloud) &&
      !$auth.user &&
      !$isActive("./auth") &&
      !$isActive("./invite") &&
      !$isActive("./admin")
    ) {
      const returnUrl = encodeURIComponent(window.location.pathname)
      $redirect("./auth?", { returnUrl })
    }
    // check if password reset required for user
    else if ($auth.user?.forceResetPassword) {
      $redirect("./auth/reset")
    }
  }
</script>

{#if loaded}
  <slot />
{/if}
