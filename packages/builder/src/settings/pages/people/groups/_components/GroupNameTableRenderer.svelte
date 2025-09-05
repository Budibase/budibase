<script>
  import GroupIcon from "./GroupIcon.svelte"
  import ActiveDirectoryInfo from "../../_components/ActiveDirectoryInfo.svelte"

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
  {#if row.scimInfo?.isSync}
    <ActiveDirectoryInfo iconSize="XS" />
  {/if}
</div>

<style>
  .align {
    display: flex;
    align-items: center;
    overflow: visible;
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
