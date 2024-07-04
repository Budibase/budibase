<script>
import { BannerDisplay, NotificationDisplay } from "@budibase/bbui"
import { Router } from "@roxi/routify"
import LicensingOverlays from "components/portal/licensing/LicensingOverlays.svelte"
import { parse, stringify } from "qs"
import { routes } from "../.routify/routes"

const queryHandler = { parse, stringify }
</script>

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
