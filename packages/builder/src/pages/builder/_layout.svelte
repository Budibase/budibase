<script>
  import { onMount } from "svelte"
  import { isActive, goto, redirect } from "@roxi/routify"
  import { auth } from "stores/backend"
  import { admin } from "stores/portal"

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
    if (loaded && hasAdminUser && !$auth.user && !$isActive("./auth")) {
      $redirect("./auth/login")
    }
  }
</script>

{#if loaded}
  <slot />
{/if}
