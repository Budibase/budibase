<script>
  export let row

  $: usedInApps = row?.usedInApps || []
  $: tooltipText = usedInApps.length
    ? usedInApps.join(", ")
    : "Not used in any app"
</script>

<div class="usage" title={tooltipText}>
  {#if usedInApps.length}
    {#if usedInApps.length === 1}
      {usedInApps[0]}
    {:else}
      {usedInApps[0]} +{usedInApps.length - 1}
    {/if}
  {:else}
    <span class="unused">Not used</span>
  {/if}
</div>

<style>
  .usage {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .unused {
    color: var(--spectrum-global-color-gray-700);
  }
</style>
