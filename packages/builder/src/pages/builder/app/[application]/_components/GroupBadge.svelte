<script>
  import { Badge } from "@budibase/bbui"

  export let color
  export let name
</script>

<Badge size="S" customColor={`color-mix(in srgb, ${color} 30%, transparent)`}
  >{name}</Badge
>
