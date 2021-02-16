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
    {#if hideAutocolumns}
      <i class="ri-magic-line"></i>
      Show Auto Columns
    {:else}
      <i class="ri-magic-fill"></i>
      Hide Auto Columns
    {/if}
  </TextButton>
</div>

<style>
  i {
    margin-right: 4px;
  }
</style>
