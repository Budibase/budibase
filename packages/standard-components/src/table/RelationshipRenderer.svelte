<script>
  import "@spectrum-css/label/dist/index-vars.css"

  export let value
</script>

{#if value && value.length}
  {#each value as item}
    {#if item && item.primaryDisplay}
      <span class="spectrum-Label spectrum-Label--grey">
        {item.primaryDisplay}
      </span>
    {/if}
  {/each}
{/if}
