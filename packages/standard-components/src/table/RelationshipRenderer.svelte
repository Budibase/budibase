<script>
  import "@spectrum-css/label/dist/index-vars.css"

  export let value

  const displayLimit = 5
  $: relationships = value?.slice(0, displayLimit) ?? []
  $: leftover = (value?.length ?? 0) - relationships.length
</script>

{#each relationships as relationship}
  {#if relationship?.primaryDisplay}
    <span class="spectrum-Label spectrum-Label--grey">
      {relationship.primaryDisplay}
    </span>
  {/if}
{/each}
{#if leftover}
  <div>+{leftover} more</div>
{/if}
