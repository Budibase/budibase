<script>
  import { Router } from "@roxi/routify"
  import { routes } from "../.routify/routes"
  import { NotificationDisplay, BannerDisplay } from "@budibase/bbui"
  import { parse, stringify } from "qs"
  import LicensingOverlays from "components/portal/licensing/LicensingOverlays.svelte"

  const queryHandler = { parse, stringify }

  const uuid = "AD06443E-6892-4833-89F6-A165A37E8CA3"
  console.log(uuid)
</script>

<div class="banner-container" />
<BannerDisplay />
<NotificationDisplay />
<LicensingOverlays />
<Router {routes} config={{ queryHandler }} />
<div class="modal-container" />

<div class="test" />

<style>
  .modal-container {
    position: absolute;
  }
  .test {
    color: white;
    display: none;
  }
</style>
