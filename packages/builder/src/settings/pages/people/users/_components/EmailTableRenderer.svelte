<script lang="ts">
  import ActiveDirectoryInfo from "../../_components/ActiveDirectoryInfo.svelte"

  interface Props {
    value: string
    row: {
      scimInfo?: { isSync: boolean }
    }
  }

  let { value, row }: Props = $props()
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
