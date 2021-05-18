<script>
  import { onMount } from "svelte"
  import { Router } from "@roxi/routify"
  import { routes } from "../.routify/routes"
  import { initialise } from "builderStore"
  import { NotificationDisplay } from "@budibase/bbui"
  import { parse, stringify } from "qs"

  onMount(async () => {
    await initialise()
  })

  const queryHandler = { parse, stringify }
</script>

<NotificationDisplay />
<Router {routes} config={{ queryHandler }} />
<div class="modal-container" />

<style>
  .modal-container {
    position: absolute;
  }
</style>
