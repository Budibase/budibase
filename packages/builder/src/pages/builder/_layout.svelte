<script>
  import { isActive, redirect } from "@roxi/routify"
  import { admin, auth } from "stores/portal"
  import { onMount } from "svelte"

  let loaded = false
  $: multiTenancyEnabled = $admin.multiTenancy
  $: hasAdminUser = !!$admin?.checklist?.adminUser
  $: tenantSet = $auth.tenantSet

  onMount(async () => {
    await admin.init()
    await auth.checkAuth()
    loaded = true
  })

  // Force creation of an admin user if one doesn't exist
  $: {
    console.log(`loaded: ${loaded}`)
    console.log(`tenancy: ${multiTenancyEnabled}`)
    console.log(`tenant set: ${tenantSet}`)
    if (loaded && multiTenancyEnabled && !tenantSet) {
      $redirect("./auth/org")
    } else if (loaded && !hasAdminUser) {

      $redirect("./admin")
    }
  }

  // Redirect to log in at any time if the user isn't authenticated
  $: {
    if (
      loaded &&
      hasAdminUser &&
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
