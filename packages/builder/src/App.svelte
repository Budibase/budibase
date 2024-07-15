<script>
  import { Router } from "@roxi/routify"
  import { routes } from "../.routify/routes"
  import { NotificationDisplay, BannerDisplay } from "@budibase/bbui"
  import { parse, stringify } from "qs"
  import LicensingOverlays from "components/portal/licensing/LicensingOverlays.svelte"
  import ContextMenu from "components/ContextMenu.svelte"

  const queryHandler = { parse, stringify }
</script>

<ContextMenu />
<div class="banner-container" />
<BannerDisplay />
<NotificationDisplay />
<LicensingOverlays />
<Router {routes} config={{ queryHandler }} />
<div class="modal-container" />

<style>
  .modal-container {
    position: absolute;
  }
</style>
