<script>
  import { Icon } from "@budibase/bbui"

  export let value
  export let row

  $: icon = row?.schema?.schema?.icon
  $: friendlyName = row?.schema?.schema?.friendlyName
</script>

<div class="container" title={value}>
  {#if icon}
    <Icon name={icon} />
  {/if}
  <div class="name">
    {friendlyName || value}
  </div>
</div>

<style>
  .container {
    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-m);
  }
  .name {
    flex: 1 1 auto;
    width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
