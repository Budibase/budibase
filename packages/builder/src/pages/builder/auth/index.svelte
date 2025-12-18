<script>
  import { redirect } from "@roxi/routify"
  import { auth, admin } from "@/stores/portal"
  import { onMount } from "svelte"
  import { notifications } from "@budibase/bbui"

  $: tenantSet = $auth.tenantSet
  $: multiTenancyEnabled = $admin.multiTenancy
  $: useAccountPortal = $admin.cloud && !$admin.disableAccountPortal

  let loaded = false

  $: {
    if (loaded && multiTenancyEnabled && !tenantSet && !useAccountPortal) {
      $redirect("./org")
    } else if (loaded) {
      $redirect("./login")
    }
  }

  onMount(async () => {
    try {
      await auth.validateTenantId()
      await admin.init()
      await auth.checkQueryString()
    } catch (error) {
      notifications.error("Error getting checklist")
    }
    loaded = true
  })
</script>
