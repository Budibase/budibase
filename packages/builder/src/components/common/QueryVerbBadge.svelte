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
    justify-content: flex-start;
    font-size: var(--spectrum-global-dimension-font-size-50);
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    white-space: nowrap;
    min-width: 42px;
  }
</style>
