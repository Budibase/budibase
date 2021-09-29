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

  const validateTenantId = async () => {
    // set the tenant from the url in the cloud
    const tenantId = window.location.host.split(".")[0]

    if (!tenantId.includes("localhost:")) {
      // user doesn't have permission to access this tenant - kick them out
      if (user && user.tenantId && user.tenantId !== tenantId) {
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
    if (!cloud) {
      const apiReady = $admin.loaded && $auth.loaded
      // if tenant is not set go to it
      if (loaded && apiReady && multiTenancyEnabled && !tenantSet) {
        $redirect("./auth/org")
      }
      // Force creation of an admin user if one doesn't exist
      else if (loaded && apiReady && !hasAdminUser) {
        $redirect("./admin")
      }
    }
  }
  // Redirect to log in at any time if the user isn't authenticated
  $: {
    if (
      loaded &&
      (hasAdminUser || cloud) &&
      !$auth.user &&
      !$isActive("./auth") &&
      !$isActive("./invite")
    ) {
      const returnUrl = encodeURIComponent(window.location.pathname)
      $redirect("./auth?", { returnUrl })
    } else if ($auth?.user?.forceResetPassword) {
      $redirect("./auth/reset")
    }
  }
</script>

{#if loaded}
  <slot />
{/if}
