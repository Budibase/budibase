<script lang="ts">
  export let verb: string | undefined
  export let color: string | undefined

  $: displayVerb = verb ? verb.toUpperCase() : undefined
</script>

{#if displayVerb}
  <span class="query-verb-badge" style={color ? `color:${color};` : undefined}>
    {displayVerb}
  </span>
{/if}

<style>
  .query-verb-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: var(--spectrum-global-dimension-font-size-50);
    font-weight: 500;
    text-transform: uppercase;
    white-space: nowrap;
    min-width: 42px;
    background-color: var(--spectrum-global-color-gray-100);
    border-radius: 4px;
    padding: 4px 8px;
  }
</style>
