<script>
  import { Router } from "@roxi/routify"
  import { routes } from "../.routify/routes"
  import { NotificationDisplay, BannerDisplay } from "@budibase/bbui"
  import { parse, stringify } from "qs"
  import HelpMenu from "components/common/HelpMenu.svelte"
  import LicensingOverlays from "components/portal/licensing/LicensingOverlays.svelte"

  const queryHandler = { parse, stringify }
</script>

<div class="banner-container" />
<BannerDisplay />
<NotificationDisplay />
<LicensingOverlays />
<Router {routes} config={{ queryHandler }} />
<div class="modal-container" />
<HelpMenu />

<style>
  .modal-container {
    position: absolute;
  }
</style>
