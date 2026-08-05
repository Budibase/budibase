<script>
  import { TimeField } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"

  export let value = undefined
  export let name = undefined

  const dispatch = createEventDispatcher()
</script>

<TimeField
  {value}
  {name}
  showSeconds
  onchange={nextValue => dispatch("change", nextValue)}
/>
