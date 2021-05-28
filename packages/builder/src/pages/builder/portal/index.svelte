<script>
  import { onMount } from "svelte"
  import { redirect, goto } from "@roxi/routify"
  import { apps, organisation, auth } from "stores/portal"
  import { AppStatus } from "constants"

  onMount(async () => {
    await apps.load()
    // Skip the portal if you only have one app
    if (!$auth.isBuilder && $apps.filter(app => app.status === AppStatus.DEPLOYED).length === 1) {
      // window.location = `/${publishedApps[0].prodId}`
      $redirect(`/${publishedApps[0].prodId}`)
    } else {
      $goto("./apps")
    }
  })

</script>
