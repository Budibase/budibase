<script lang="ts">
  import { dataEnvironmentStore } from "@/stores/builder"
  import CtaNotification from "@/components/common/CtaNotification.svelte"
</script>

{#if !$dataEnvironmentStore.bannerHidden}
  <div class="location">
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
    width: 98%;
    z-index: 99;
  }
  .link {
    color: var(--spectrum-global-color-blue-700);
  }
  .link:hover {
    color: var(--spectrum-global-color-blue-400);
  }
</style>
