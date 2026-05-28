<script>
  import {
    Body,
    Button,
    ProgressBar,
    Heading,
    Icon,
    Link,
    Modal,
  } from "@budibase/bbui"
  import { helpers } from "@budibase/shared-core"
  import { admin } from "@/stores/portal/admin"
  import { auth } from "@/stores/portal/auth"
  import ActionsBreakdownModal from "./ActionsBreakdownModal.svelte"

  export let usage
  export let warnWhenFull = false
  export let breakdown = null
  export let showPurchaseCreditsLink = false
  export let purchaseCreditsUrl = ""

  let percentage
  let unlimited = false
  let showWarning = false
  let breakdownModal

  $: accountPortalAccess = $auth?.user?.accountPortalAccess
  const { accountPortalUpgradeUrl } = helpers

  const getPercentage = () => {
    if (!usage?.total || usage.total <= 0) {
      return 0
    }
    return (usage.used / usage.total) * 100
  }

  $: upgradeUrl = accountPortalUpgradeUrl($admin.accountPortalUrl)

  $: unlimited = usage?.total === -1
  $: percentage = unlimited ? 100 : getPercentage()
  $: showWarning = warnWhenFull && !unlimited && percentage >= 100
</script>

<div class="usage">
  <div class="info">
    <div class="header-container">
      {#if showWarning}
        <Icon name="warning" />
      {/if}
      <Heading size="XS" weight="light">
        <span class="nowrap">
          {usage.name}
        </span>
      </Heading>
      {#if breakdown}
        <button
          class="info-btn"
          on:click={() => breakdownModal.show()}
          aria-label="View breakdown"
        >
          <Icon name="InfoOutline" size="S" />
        </button>
      {/if}
    </div>
    <Body size="S">
      <span class="nowrap">
        {#if unlimited}
          {usage.used} / Unlimited
        {:else}
          {usage.used} / {usage.total}
        {/if}
      </span>
    </Body>
  </div>
  <div class="usage-bar">
    {#if unlimited}
      <ProgressBar
        showPercentage={false}
        width={"100%"}
        duration={1}
        value={100}
      />
    {:else}
      <ProgressBar
        color={showWarning ? "red" : "green"}
        showPercentage={false}
        width={"100%"}
        duration={1}
        value={percentage}
      />
    {/if}
    {#if showWarning}
      <Body size="S">
        To get more {usage.name.toLowerCase()}
        {#if accountPortalAccess}
          <Link href={upgradeUrl}>upgrade your plan</Link>
        {:else}
          contact your account holder
        {/if}
      </Body>
    {/if}
    {#if showPurchaseCreditsLink && purchaseCreditsUrl}
      <div class="purchase-credits-action">
        <Button primary on:click={() => (window.location.href = purchaseCreditsUrl)}>
          Purchase credits
        </Button>
      </div>
    {/if}
  </div>
</div>

{#if breakdown}
  <Modal bind:this={breakdownModal}>
    <ActionsBreakdownModal {usage} {breakdown} />
  </Modal>
{/if}

<style>
  .usage {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .info {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 12px;
    gap: var(--spacing-m);
  }
  .header-container {
    display: flex;
    align-items: center;
  }
  .nowrap {
    white-space: nowrap;
  }

  .info-btn {
    background: none;
    border: none;
    padding: 0;
    margin-left: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    color: var(--spectrum-global-color-gray-600);
    opacity: 0.7;
  }

  .info-btn:hover {
    opacity: 1;
    color: var(--spectrum-global-color-blue-500);
  }

  .usage-bar {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .purchase-credits-action {
    display: flex;
    justify-content: flex-end;
  }
</style>
