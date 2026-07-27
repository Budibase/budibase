<script>
  import GroupIcon from "./GroupIcon.svelte"
  import ActiveDirectoryInfo from "../../_components/ActiveDirectoryInfo.svelte"

  export let value
  export let row
</script>

<div class="align">
  {#if value}
    <GroupIcon group={row} />
    <div class="text" title={value}>
      {value}
    </div>
  {:else}
    <div class="text">-</div>
  {/if}
  {#if row.isDefault}
    <div class="default-badge">Default</div>
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
  .default-badge {
    color: var(--spectrum-global-color-static-white);
    background: var(--primary-500);
    border-radius: 6px;
    padding: 2px 8px;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    width: fit-content;
    flex-shrink: 0;
  }
</style>
