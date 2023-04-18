<script>
  import { Router } from "@roxi/routify"
  import { routes } from "../.routify/routes"
  import { NotificationDisplay, BannerDisplay } from "@budibase/bbui"
  import { parse, stringify } from "qs"
  import LicensingOverlays from "components/portal/licensing/LicensingOverlays.svelte"
  import { setupI18n, isLocaleLoaded, locale } from "../lang/i18n"
  const queryHandler = { parse, stringify }

  $: if (!$isLocaleLoaded) {
    setupI18n({ withLocale: "ru" })
  }
</script>

{#if $isLocaleLoaded}
  <div class="banner-container" />

  <BannerDisplay />
  <NotificationDisplay />
  <LicensingOverlays />
  <Router {routes} config={{ queryHandler }} />
  <div class="modal-container" />
{:else}
  <p>Loading...</p>
{/if}

<style>
  .modal-container {
    position: absolute;
  }
</style>
