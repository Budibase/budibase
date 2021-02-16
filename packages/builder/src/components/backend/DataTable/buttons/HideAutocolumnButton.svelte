<script>
  import { TextButton } from "@budibase/bbui"

  export let hideAutocolumns = true

  let anchor
  let dropdown

  function hideOrUnhide() {
    hideAutocolumns = !hideAutocolumns
  }
</script>

<div bind:this={anchor}>
  <TextButton text small on:click={hideOrUnhide}>
    <i class="ri-magic-fill"></i>
    {#if hideAutocolumns}
      Show Auto Columns
    {:else}
      Hide Auto Columns
    {/if}
  </TextButton>
</div>

<style>
  i {
    margin-right: 4px;
  }
</style>
