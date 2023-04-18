<script>
  import { redirect } from "@roxi/routify"
  import { auth, admin } from "stores/portal"
  import { onMount } from "svelte"
  import { notifications } from "@budibase/bbui"

  import { _ } from "../../../../lang/i18n"

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
      notifications.error($_("pages.builder.auth.index.notificationsError"))
    }
    loaded = true
  })
</script>
