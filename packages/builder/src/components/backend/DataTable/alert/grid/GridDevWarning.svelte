<script lang="ts">
  import { dataEnvironmentStore } from "@/stores/builder"
  import { Icon } from "@budibase/bbui"
</script>

{#if !$dataEnvironmentStore.bannerHidden}
  <div class="dev-warning">
    <div class="dev-warning-inner">
      <Icon name="info" />
      <span
        >You're currently editing development data, switch to production to edit
        data your users' will interact with.</span
      >
    </div>
    <Icon
      name="x"
      hoverable
      weight="bold"
      on:click={() => dataEnvironmentStore.hideBanner()}
    />
  </div>
{/if}

<style>
  .dev-warning {
    bottom: 0;
    width: 100%;
    background: var(--spectrum-global-color-blue-600);
    color: white;
    padding: var(--spacing-l);
    font-size: var(--font-size-m);
    font-weight: 500;
    z-index: 999;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .dev-warning-inner {
    display: flex;
    gap: var(--spacing-m);
  }
</style>
