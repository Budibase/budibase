<script>
  import { licensing } from "@/stores/portal"

  export let show = true

  const oneDayInMilliseconds = 86400000

  const startOfDay = timestamp => {
    const date = new Date(timestamp)
    date.setHours(0, 0, 0, 0)
    return date.getTime()
  }

  $: license = $licensing.license

  const getTrialCopy = () => {
    const cancelAt = license?.billing?.subscription?.cancelAt

    if (!cancelAt) {
      return "Free trial"
    }

    const days = Math.max(
      0,
      Math.floor(
        (startOfDay(cancelAt) - startOfDay(Date.now())) / oneDayInMilliseconds
      )
    )

    if (days === 0) {
      return "Free trial ends today"
    }

    if (days === 1) {
      return "Free trial: 1 day left"
    }

    return `Free trial: ${days} days left`
  }
</script>

{#if show}
  <div class="trial-notice">
    <button
      type="button"
      class="trial-status"
      on:click={licensing.goToUpgradePage}
    >
      {getTrialCopy()}
    </button>
    <button
      type="button"
      class="trial-action"
      on:click={licensing.goToUpgradePage}
    >
      View plans
    </button>
  </div>
{/if}

<style>
  .trial-notice {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-m);
    min-width: 0;
  }

  .trial-status,
  .trial-action {
    border: 0;
    background: none;
    padding: 0;
    margin: 0;
    font-size: 13px;
    line-height: 18px;
    font-family: inherit;
    cursor: pointer;
  }

  .trial-status {
    color: var(--spectrum-global-color-orange-700);
  }

  .trial-status:hover,
  .trial-action:hover {
    text-decoration: underline;
  }

  .trial-action {
    color: var(--spectrum-global-color-gray-700);
    white-space: nowrap;
  }
</style>
