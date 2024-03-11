<script>
  import ActiveDirectoryInfo from "../../_components/ActiveDirectoryInfo.svelte"

  export let value
  export let row
</script>

{value}
{#if row.scimInfo?.isSync}
  <ActiveDirectoryInfo iconSize="XS" />
{/if}
