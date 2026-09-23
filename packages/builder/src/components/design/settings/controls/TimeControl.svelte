<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { TimeField } from "@budibase/bbui"

  export let value: string | null | undefined = undefined
  export let name: string | undefined = undefined

  const dispatch = createEventDispatcher<{ change: string | undefined }>()
</script>

<TimeField
  {value}
  {name}
  showSeconds
  onchange={(nextValue: string | undefined) => dispatch("change", nextValue)}
/>
