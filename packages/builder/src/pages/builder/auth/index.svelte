<script>
  import { redirect } from "@roxi/routify"
  import { auth, admin } from "@/stores/portal"
  import { onMount } from "svelte"
  import { notifications } from "@budibase/bbui"

  // Workaround for Routify 2 + Svelte 5 compatibility
  // See: https://github.com/roxiness/routify/issues/563
  $redirect

  $: tenantSet = $auth.tenantSet
  $: multiTenancyEnabled = $admin.multiTenancy

  let loaded = false

  $: {
    if (loaded && multiTenancyEnabled && !tenantSet) {
      $redirect("./org")
    } else if (loaded) {
      $redirect("./login")
    }
  }

  onMount(async () => {
    try {
      await admin.init()
      await auth.checkQueryString()
    } catch (error) {
      notifications.error("Error getting checklist")
    }
    loaded = true
  })
</script>
