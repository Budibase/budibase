<script>
  import { onMount } from "svelte"
  import { Router } from "@roxi/routify"
  import { routes } from "../.routify/routes"
  import { initialise } from "builderStore"
  import { NotificationDisplay } from "@budibase/bbui"
  import { parse, stringify } from "qs"
  import HelpIcon from "components/common/HelpIcon.svelte"
  import { initI18n } from "builderStore/store/i18n.js"
  
  initI18n()
  
  onMount(async () => {
    await initialise()
  })

  const queryHandler = { parse, stringify }
</script>

<NotificationDisplay />
<Router {routes} config={{ queryHandler }} />
<div class="modal-container" />
<HelpIcon />

<style>
  .modal-container {
    position: absolute;
  }
</style>
