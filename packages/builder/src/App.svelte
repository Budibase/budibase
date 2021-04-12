<script>
  import { onMount } from "svelte"
  import { Router } from "@roxi/routify"
  import { routes } from "../.routify/routes"
  import { initialise } from "builderStore"
  import NotificationDisplay from "components/common/Notification/NotificationDisplay.svelte"

  onMount(async () => {
    await initialise()
  })

  const config = {}
</script>

<NotificationDisplay />
<Router {routes} {config} />
