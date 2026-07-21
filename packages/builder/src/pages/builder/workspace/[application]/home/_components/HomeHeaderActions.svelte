<svelte:options runes={true} />

<script lang="ts">
  import FreeTrialBanner from "@/components/portal/licensing/FreeTrialBanner.svelte"
  import { Button } from "@budibase/bbui"

  interface Props {
    projectsEnabled?: boolean
    isEnterprisePlan?: boolean
    showTrialBanner?: boolean
    onUpgradePlan?: () => void
    onContactSales?: () => void
  }

  let {
    projectsEnabled = false,
    isEnterprisePlan = false,
    showTrialBanner = false,
    onUpgradePlan = () => {},
    onContactSales = () => {},
  }: Props = $props()
</script>

<div class="header-actions">
  {#if projectsEnabled}
    {#if !isEnterprisePlan}
      <button type="button" class="header-link" onclick={onUpgradePlan}>
        Upgrade plan
      </button>
    {/if}
  {:else if showTrialBanner}
    <FreeTrialBanner show />
  {/if}

  {#if !isEnterprisePlan}
    <Button size="M" secondary on:click={onContactSales}>Contact sales</Button>
  {/if}
</div>

<style>
  .header-actions {
    display: flex;
    gap: var(--spacing-l);
    align-items: center;
  }

  .header-link {
    border: none;
    background: none;
    padding: 0;
    font-family: var(--font-sans);
    font-size: var(--font-size-s);
    color: var(--spectrum-global-color-gray-900);
    cursor: pointer;
  }

  .header-link:hover {
    color: var(--spectrum-global-color-gray-800);
  }
</style>
