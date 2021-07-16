<script>
  import { isActive, redirect } from "@roxi/routify"
  import { admin, auth } from "stores/portal"
  import { onMount } from "svelte"

  let loaded = false
  $: hasAdminUser = !!$admin?.checklist?.adminUser

  onMount(async () => {
    await admin.init()
    await auth.checkAuth()
    loaded = true
  })

  // Force creation of an admin user if one doesn't exist
  $: {
    if (loaded && !hasAdminUser) {
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
