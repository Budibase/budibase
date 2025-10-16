<script>
  // Add these in dev only?
  // Output in build?
  console.group("Svelte Mode Detection")

  try {
    // These exist in legacy mode
    const test = $$props
    console.log("Legacy mode confirmed - $$props exists")
  } catch {
    console.log("Runes mode - $$props does not exist")
  }

  import { Router } from "@roxi/routify"
  import { routes } from "../.routify/routes"
  import { NotificationDisplay, BannerDisplay, Context } from "@budibase/bbui"
  import LicensingOverlays from "@/components/portal/licensing/LicensingOverlays.svelte"
  import { parse, stringify } from "qs"
  import { setContext, onMount } from "svelte"

  const queryHandler = { parse, stringify }

  console.log("Routes import OK", routes ? routes.length : 0)

  setContext(Context.PopoverRoot, "body")
  console.log("APP setContext set!!")

  console.groupEnd()

  onMount(async () => {
    console.log("App Mounted")
  })
</script>

<span>hello </span>
<div class="banner-container" />

<Router {routes} config={{ queryHandler }} />
<BannerDisplay />
<NotificationDisplay />
<LicensingOverlays />

<div class="modal-container" />

<style>
  .modal-container {
    position: absolute;
  }
</style>
