<script lang="ts">
  import { IconAvatar } from "@budibase/bbui"
  import type { UserGroup } from "@budibase/types"

  export let group: UserGroup | undefined = undefined
  export let size: "XS" | "S" | "M" | "L" = "M"
</script>

<div class="icon-group">
  <IconAvatar icon={group?.icon} background={group?.color} {size} />
</div>

<style>
  .icon-group {
    position: relative;
  }
</style>
