<script>
  import { isActive, redirect } from "@roxi/routify"
  import { admin, auth } from "stores/portal"
  import { onMount } from "svelte"

  let loaded = false
  // don't react to these
  let cloud = $admin.cloud
  let shouldRedirect = !cloud || $admin.disableAccountPortal

  $: multiTenancyEnabled = $admin.multiTenancy
  $: hasAdminUser = $admin?.checklist?.adminUser?.checked
  $: tenantSet = $auth.tenantSet
  $: cloud = $admin.cloud
  $: user = $auth.user

  const validateTenantId = async () => {
    // set the tenant from the url in the cloud
    const tenantId = window.location.host.split(".")[0]

    if (!tenantId.includes("localhost:")) {
      // user doesn't have permission to access this tenant - kick them out
      if (user?.tenantId !== tenantId) {
        await auth.logout()
        await auth.setOrganisation(null)
      } else {
        await auth.setOrganisation(tenantId)
      }
    }
  }

  onMount(async () => {
    await auth.checkAuth()
    await admin.init()

    if (cloud && multiTenancyEnabled) {
      await validateTenantId()
    }

    loaded = true
  })

  $: {
    // We should never see the org or admin user creation screens in the cloud
    const apiReady = $admin.loaded && $auth.loaded
    // if tenant is not set go to it
    if (
      loaded &&
      shouldRedirect &&
      apiReady &&
      multiTenancyEnabled &&
      !tenantSet
    ) {
      $redirect("./auth/org")
    }
    // Force creation of an admin user if one doesn't exist
    else if (loaded && shouldRedirect && apiReady && !hasAdminUser) {
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
