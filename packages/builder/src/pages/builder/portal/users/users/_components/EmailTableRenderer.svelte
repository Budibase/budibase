<script>
  import ScimInfo from "../../_components/SCIMInfo.svelte"

  export let value
  export let row
</script>

{value}
{#if row.scimInfo?.isSync}
  <ScimInfo iconSize="XS" />
{/if}
