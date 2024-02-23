<script>
  import { IconAvatar } from "@budibase/bbui"
  import ScimInfo from "../../_components/SCIMInfo.svelte"

  export let group
  export let size = "M"
</script>

<div class="icon-group">
  <IconAvatar icon={group?.icon} background={group?.color} {size} />

  {#if group.scimInfo?.isSync}
    <div class="scim-sync">
      <ScimInfo iconSize="XXS" />
    </div>
  {/if}
</div>

<style>
  .icon-group {
    position: relative;
  }

  .scim-sync {
    position: absolute;
    bottom: -4px;
    right: 0;
  }
</style>
