<script>
import "@spectrum-css/toast/dist/index-vars.css"
import { BANNER_TYPES, Banner } from "@budibase/bbui"
import { licensing } from "stores/portal"
import Portal from "svelte-portal"
import { fly } from "svelte/transition"

export let show = true

const oneDayInSeconds = 86400

$: license = $licensing.license

function daysUntilCancel() {
  const cancelAt = license?.billing?.subscription?.cancelAt
  const diffTime = Math.abs(cancelAt - new Date().getTime()) / 1000
  return Math.floor(diffTime / oneDayInSeconds)
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
          Your free trial will end in {daysUntilCancel()} days.
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
