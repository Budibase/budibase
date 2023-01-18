<script>
  import GroupIcon from "./GroupIcon.svelte"

  export let value
  export let row
</script>

<div class="align">
  {#if value}
    <GroupIcon group={row} />
    <div class="text">
      {value}
    </div>
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
    max-width: var(--max-cell-width);
    flex: 1 1 auto;
    width: 0;
  }
  .text {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
