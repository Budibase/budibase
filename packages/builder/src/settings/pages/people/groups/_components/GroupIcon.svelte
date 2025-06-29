<script>
  import { IconAvatar } from "@budibase/bbui"

  export let group
  export let size = "M"
</script>

<div class="icon-group">
  <IconAvatar icon={group?.icon} background={group?.color} {size} />
</div>

<style>
  .icon-group {
    position: relative;
  }
</style>
