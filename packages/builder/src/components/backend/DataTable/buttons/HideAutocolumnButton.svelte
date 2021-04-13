<script>
  import { Button } from "@budibase/bbui"

  export let hideAutocolumns

  let anchor
  let dropdown

  function hideOrUnhide() {
    hideAutocolumns = !hideAutocolumns
  }
</script>

<div bind:this={anchor}>
  <Button icon="MagicWand" primary size="S" quiet on:click={hideOrUnhide}>
    {#if hideAutocolumns}
      Show Auto Columns
    {:else}
      Hide Auto Columns
    {/if}
  </Button>
</div>

<style>
  i {
    margin-right: 4px;
  }
</style>
