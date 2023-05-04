<script>
  import { Body, ProgressBar, Heading, Icon, Link } from "@budibase/bbui"
  import { admin, auth } from "../../stores/portal"
  import { onMount } from "svelte"
  export let usage
  export let warnWhenFull = false

  let percentage
  let unlimited = false
  let showWarning = false

  $: accountPortalAccess = $auth?.user?.accountPortalAccess

  const isUnlimited = () => {
    if (usage.total === -1) {
      return true
    }
    return false
  }

  const getPercentage = () => {
    return (usage.used / usage.total) * 100
  }

  const upgradeUrl = `${$admin.accountPortalUrl}/portal/upgrade`

  onMount(() => {
    unlimited = isUnlimited()
    percentage = getPercentage()
    if (warnWhenFull && percentage >= 100) {
      showWarning = true
    }
  })
</script>

<div class="usage">
  <div class="info">
    <div class="header-container">
      {#if showWarning}
        <Icon name="Alert" />
      {/if}
      <Heading size="XS" weight="light">
        <span class="nowrap">
          {usage.name}
        </span>
      </Heading>
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
  <div>
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
  </div>
</div>

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
  }
  .nowrap {
    white-space: nowrap;
  }
</style>
