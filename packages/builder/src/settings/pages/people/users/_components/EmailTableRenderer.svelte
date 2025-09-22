<script>
  import ActiveDirectoryInfo from "../../_components/ActiveDirectoryInfo.svelte"

  export let value
  export let row
</script>

<span title={value} class="email">
  {value}
</span>
{#if row.scimInfo?.isSync}
  <ActiveDirectoryInfo iconSize="XS" />
{/if}

<style>
  .email {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
</style>
