<script>
  import { Router } from "@roxi/routify"
  import { routes } from "../.routify/routes"
  import { NotificationDisplay, BannerDisplay, Context } from "@budibase/bbui"
  import LicensingOverlays from "@/components/portal/licensing/LicensingOverlays.svelte"
  import { parse, stringify } from "qs"
  import { setContext } from "svelte"

  const queryHandler = { parse, stringify }

  setContext(Context.PopoverRoot, "body")
</script>

<div class="banner-container"></div>

<Router {routes} config={{ queryHandler }} />
<BannerDisplay />
<NotificationDisplay />
<LicensingOverlays />

<div class="modal-container"></div>

<style>
  .modal-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 999;
  }
  .modal-container :global(*) {
    pointer-events: auto;
  }
</style>
