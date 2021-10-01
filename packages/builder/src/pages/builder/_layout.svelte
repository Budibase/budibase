<script>
  import { isActive, redirect } from "@roxi/routify"
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

    if (user && user.tenantId) {
      let urlTenantId
      const hostParts = host.split(".")

      // only run validation when we know we are in a tenant url
      // not when we visit the root budibase.app domain
      // e.g. ['tenant', 'budibase', 'app'] vs ['budibase', 'app']
      if (hostParts.length > 2) {
        urlTenantId = hostParts[0]
      } else {
        // no tenant in the url - send to account portal to fix this
        window.location.href = $admin.accountPortalUrl
        return
      }

      if (user.tenantId !== urlTenantId) {
        // user should not be here - play it safe and log them out
        await auth.logout()
      }
    }
  }

  onMount(async () => {
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
