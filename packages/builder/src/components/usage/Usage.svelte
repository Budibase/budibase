<script>
  import { Body, ProgressBar, Heading, Icon, Link } from "@budibase/bbui"
  import { admin } from "../../stores/portal"
  import { onMount } from "svelte"
  export let usage
  export let warnWhenFull = false

  let percentage
  let unlimited = false
  let showWarning = false

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
    if (warnWhenFull && percentage === 100) {
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
      <div class="heading header-item">
        <Heading size="XS" weight="light">{usage.name}</Heading>
      </div>
    </div>
    {#if unlimited}
      <Body size="S">{usage.used} / Unlimited</Body>
    {:else}
      <Body size="S">{usage.used} / {usage.total}</Body>
    {/if}
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
        To get more queries <Link href={upgradeUrl}>upgrade your plan</Link>
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
    margin-bottom: 12px;
  }
  .header-container {
    display: flex;
  }
  .heading {
    margin-top: 3px;
    margin-left: 5px;
  }
</style>
