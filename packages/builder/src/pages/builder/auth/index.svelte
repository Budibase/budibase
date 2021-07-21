<script>
  import { redirect } from "@roxi/routify"
  import { auth, admin } from "stores/portal"
  import { onMount } from "svelte"

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
    await admin.init()
    auth.checkQueryString()
    loaded = true
  })
</script>
