<script>
  import { truncate } from "lodash"

  export let value
  $: truncatedValue = truncate(value, { length: 12 })
</script>

{truncatedValue}
