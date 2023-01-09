<script>
  import { Icon } from "@budibase/bbui"

  export let value
  export let row

  $: icon = row?.schema?.schema?.icon
  $: friendlyName = row?.schema?.schema?.friendlyName
</script>

<div title={value}>
  {#if icon}
    <Icon name={icon} />
  {/if}
  {friendlyName || value}
</div>

<style>
  div {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-m);
  }
</style>
