<script>
  import { Router } from "@roxi/routify"
  import { routes } from "../.routify/routes"
  import { NotificationDisplay, BannerDisplay } from "@budibase/bbui"
  import { parse, stringify } from "qs"
  import HelpIcon from "components/common/HelpIcon.svelte"
  import LicensingOverlays from "components/portal/licensing/LicensingOverlays.svelte"

  const queryHandler = { parse, stringify }
</script>

<div class="banner-container" />
<BannerDisplay />

<NotificationDisplay />

<LicensingOverlays />

<Router {routes} config={{ queryHandler }} />
<div class="modal-container" />
<HelpIcon />

<style>
  .modal-container {
    position: absolute;
  }
</style>
