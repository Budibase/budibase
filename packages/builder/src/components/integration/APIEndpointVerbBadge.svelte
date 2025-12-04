<script lang="ts">
  export let verb: string | undefined
  export let color: string | undefined

  $: displayVerb = verb ? verb.toUpperCase() : undefined
</script>

{#if displayVerb}
  <span
    class="verb-badge"
    style={color ? `--badge-bg-color:${color}4A;` : undefined}
  >
    {displayVerb}
  </span>
{/if}

<style>
  .verb-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    font-size: var(--spectrum-global-dimension-font-size-50);
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    white-space: nowrap;
    min-width: 42px;
    background-color: var(--badge-bg-color);
    border-radius: 4px;
  }
</style>
