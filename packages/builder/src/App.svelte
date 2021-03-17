<script>
  import { onMount } from "svelte"
  import { Router } from "@roxi/routify"
  import { routes } from '../.routify/routes'
  import { initialise } from "builderStore"
  import NotificationDisplay from "components/common/Notification/NotificationDisplay.svelte"

  onMount(async () => {
    await initialise()
  })

  const config = {
     urlTransform: {
       apply: url => `/_builder${url}`,
       remove: url => url.replace('/_builder', '')
     }
   }
</script>

<NotificationDisplay />
<Router {routes} {config} />
