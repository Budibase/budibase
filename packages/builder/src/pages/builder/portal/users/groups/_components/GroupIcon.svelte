<script>
  import { IconAvatar } from "@budibase/bbui"

  export let group
  export let size = "M"
</script>

<IconAvatar icon={group?.icon} background={group?.color} {size} />
