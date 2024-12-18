<script>
  import "@spectrum-css/toast/dist/index-vars.css"
  import Portal from "svelte-portal"
  import { fly } from "svelte/transition"
  import { Banner, BANNER_TYPES } from "@budibase/bbui"
  import { licensing } from "@/stores/portal"

  export let show = true

  const oneDayInSeconds = 86400

  $: license = $licensing.license

  function daysUntilCancel() {
    const cancelAt = license?.billing?.subscription?.cancelAt
    const diffTime = Math.abs(cancelAt - new Date().getTime()) / 1000
    const days = Math.floor(diffTime / oneDayInSeconds)
    if (days === 1) {
      return "tomorrow."
    } else if (days === 0) {
      return "today."
    }
    return `in ${days} days.`
  }
</script>

<Portal target=".banner-container">
  <div class="banner">
    {#if show}
      <div transition:fly={{ y: -30 }}>
        <Banner
          type={BANNER_TYPES.INFO}
          extraLinkText={"Please select a plan."}
          extraLinkAction={$licensing.goToUpgradePage}
          showCloseButton={false}
        >
          Your free trial will end {daysUntilCancel()}
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
