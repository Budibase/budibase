<script lang="ts">
  import { IconAvatar } from "@budibase/bbui"

  interface GroupIconData {
    icon?: string
    color?: string
  }

  interface Props {
    group?: GroupIconData
    size?: "XS" | "S" | "M" | "L"
  }

  let { group, size = "M" }: Props = $props()
</script>

<div class="icon-group">
  <IconAvatar icon={group?.icon} background={group?.color} {size} />
</div>

<style>
  .icon-group {
    position: relative;
  }
</style>
