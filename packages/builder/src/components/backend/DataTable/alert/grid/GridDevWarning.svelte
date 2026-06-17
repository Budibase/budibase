<script lang="ts">
  import { dataEnvironmentStore } from "@/stores/builder"
  import { featureFlags } from "@/stores/portal"
  import { FeatureFlag } from "@budibase/types"
  import CtaNotification from "@/components/common/CtaNotification.svelte"
</script>

{#if !$dataEnvironmentStore.bannerHidden}
  <div
    class="location"
    class:with-companion={$featureFlags[FeatureFlag.FRONT_COMPANION]}
  >
    <CtaNotification
      icon="info"
      button={{ icon: "x" }}
      on:click={() => dataEnvironmentStore.hideBanner()}
    >
      <span>
        You're currently in Dev, so you can test things out without affecting
        real users. Switch to Prod to view/edit live data.
        <a
          href="https://docs.budibase.com/docs/dev-prod-switcher"
          class="link"
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit the Docs ↗
        </a>
      </span>
    </CtaNotification>
  </div>
{/if}

<style>
  .location {
    position: absolute;
    bottom: 2%;
    left: 1%;
    right: 1%;
    z-index: 99;
  }
  /* The Front support widget is pinned to the bottom-right corner (right: 16px)
     and renders above everything else, so it would cover the banner's close
     button. When that widget is enabled, leave room for it on the right
     (16px gutter + ~60px launcher + 16px widget offset) so the close button
     stays clickable. */
  .location.with-companion {
    right: 92px;
  }
  .link {
    color: var(--spectrum-global-color-blue-700);
  }
  .link:hover {
    color: var(--spectrum-global-color-blue-400);
  }
</style>
