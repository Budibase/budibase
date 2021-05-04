<script>
  import { onMount } from "svelte"
  import { Router } from "@roxi/routify"
  import { routes } from "../.routify/routes"
  import { initialise } from "builderStore"
  import { NotificationDisplay } from "@budibase/bbui"
  
  onMount(async () => {
    await initialise()
  })

  const config = {}
</script>

<NotificationDisplay />
<Router {routes} {config} />
<div class="modal-container" />

<style>
  .modal-container {
    position: absolute;
  }
</style>