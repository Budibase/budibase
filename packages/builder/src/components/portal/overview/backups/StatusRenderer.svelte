<script>
  import { Badge } from "@budibase/bbui"

  export let value = "started"
  $: status = value[0].toUpperCase() + value?.slice(1)
</script>

<Badge
  grey={value === "started" || value === "pending"}
  green={value === "complete"}
  red={value === "failed"}
  size="S"
>
  {status}
</Badge>
