<script lang="ts">
  import { dataEnvironmentStore } from "@/stores/builder"
  import { Icon } from "@budibase/bbui"
</script>

{#if !$dataEnvironmentStore.bannerHidden}
  <div class="dev-warning">
    <div class="dev-warning-inner">
      <Icon name="info" />
      <span
        >You're currently in Dev, so you can test things out without affecting
        real users. Switch to Prod to view/edit live data. <a
          href="https://docs.budibase.com/docs/dev-prod-switcher"
          class="link">Visit the Docs ↗</a
        ></span
      >
    </div>
    <Icon
      name="x"
      size="S"
      hoverable
      weight="bold"
      on:click={() => dataEnvironmentStore.hideBanner()}
    />
  </div>
{/if}

<style>
  .dev-warning {
    bottom: 0;
    width: 98%;
    background: rgba(75, 117, 255, 0.2);
    border: 1px solid rgba(75, 117, 255, 0.2);
    color: white;
    padding: var(--spacing-m);
    font-size: var(--font-size-m);
    margin: 0 var(--spacing-l) var(--spacing-l) var(--spacing-l);
    border-radius: 12px;
    z-index: 999;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .dev-warning-inner {
    display: flex;
    gap: var(--spacing-m);
  }
  .link {
    color: var(--spectrum-global-color-blue-700);
  }
  .link:hover {
    color: var(--spectrum-global-color-blue-400);
  }
</style>
