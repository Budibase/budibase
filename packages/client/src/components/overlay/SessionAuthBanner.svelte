<script>
  import "@spectrum-css/toast/dist/index-vars.css"
  import Portal from "svelte-portal"
  import { fly } from "svelte/transition"
  import { Banner, BANNER_TYPES } from "@budibase/bbui"
  import {
    sessionBannerStore,
    redirectToLoginWithReturnUrl,
  } from "@budibase/frontend-core"

  $: sessionBanner = $sessionBannerStore
  $: show =
    sessionBanner?.variant === "session-not-authenticated" &&
    !!sessionBanner?.text?.trim?.()

  const handleAction = () => {
    if (typeof sessionBanner?.action?.onClick === "function") {
      sessionBanner.action.onClick()
      return
    }
    redirectToLoginWithReturnUrl()
  }

  const handleDismiss = () => {
    sessionBannerStore.set(null)
  }
</script>

<Portal target=".banner-container">
  <div class="banner">
    {#if show}
      <div transition:fly={{ y: -30 }}>
        <Banner
          type={BANNER_TYPES.WARNING}
          extraButtonText={sessionBanner?.action?.label || "Log in"}
          extraButtonAction={handleAction}
          showCloseButton={true}
          closeButtonTooltip="Close"
          on:change={handleDismiss}
        >
          {sessionBanner?.text}
        </Banner>
      </div>
    {/if}
  </div>
</Portal>

<style>
  .banner {
    pointer-events: none;
    width: 100%;
  }
</style>
