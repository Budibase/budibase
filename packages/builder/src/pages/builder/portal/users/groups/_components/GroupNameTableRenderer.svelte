<script>
  import GroupIcon from "./GroupIcon.svelte"

  export let value
  export let row
</script>

<div class="align">
  {#if value}
    <GroupIcon group={row} />
    {value}
  {:else}
    <div class="text">-</div>
  {/if}
</div>

<style>
  .align {
    display: flex;
    align-items: center;
    overflow: hidden;
    gap: var(--spacing-m);
  }
  .text {
    opacity: 0.8;
  }
</style>
