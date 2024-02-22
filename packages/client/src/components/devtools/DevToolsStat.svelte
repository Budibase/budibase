<script>
  import { Helpers } from "@budibase/bbui"
  import { notificationStore } from "stores"

  export let label
  export let value
  export let copyable = false

  $: prettyLabel = label == null ? "-" : label
  $: prettyValue = value == null ? "-" : value
  $: empty = value == null
  $: canCopy = copyable && !empty

  const copyValue = async () => {
    try {
      await Helpers.copyToClipboard(value)
      notificationStore.actions.success("Copied to clipboard")
    } catch (error) {
      notificationStore.actions.error(
        "Failed to copy to clipboard. Check the dev console for the value."
      )
      console.warn("Failed to copy the value", value)
    }
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="stat">
  <div class="stat-label" title={prettyLabel}>{prettyLabel}</div>
  <div
    class="stat-value"
    class:copyable={canCopy}
    class:empty
    title={prettyValue}
    on:click={canCopy ? copyValue : null}
  >
    {prettyValue}
  </div>
</div>

<style>
  .stat {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-xl);
  }
  .stat-label {
    font-size: var(--font-size-xs);
    color: var(--spectrum-global-color-gray-600);
    text-transform: uppercase;
    flex: 0 0 auto;
    width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .stat-value {
    flex: 1 1 auto;
    width: 0;
    text-align: right;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: color var(--spectrum-global-animation-duration-100, 130ms)
      ease-in-out;
  }
  .stat-value.empty {
    color: var(--spectrum-global-color-gray-500);
  }
  .stat-value.copyable:hover {
    color: var(--spectrum-global-color-blue-600);
    cursor: pointer;
  }
</style>
