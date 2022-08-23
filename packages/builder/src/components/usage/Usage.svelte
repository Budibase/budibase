<script>
  import { Body, ProgressBar, Label } from "@budibase/bbui"
  import { onMount } from "svelte"
  export let usage

  let percentage
  let unlimited = false

  const isUnlimited = () => {
    if (usage.total === -1) {
      return true
    }
    return false
  }

  const getPercentage = () => {
    return Math.min(Math.ceil((usage.used / usage.total) * 100), 100)
  }

  onMount(() => {
    unlimited = isUnlimited()
    percentage = getPercentage()
  })
</script>

<div class="usage">
  <div class="info">
    <Label size="XL">{usage.name}</Label>
    {#if unlimited}
      <Body size="S">{usage.used}</Body>
    {:else}
      <Body size="S">{usage.used} / {usage.total}</Body>
    {/if}
  </div>
  <div>
    {#if unlimited}
      <Body size="S">Unlimited</Body>
    {:else}
      <ProgressBar width={"100%"} duration={1} value={percentage} />
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
    gap: var(--spacing-m);
  }
</style>
