<script lang="ts">
  import { createEventDispatcher } from "svelte"
  export let value: any = ""
  const dispatch = createEventDispatcher()
</script>

<input
  aria-label="Binding panel value"
  {value}
  on:input={e => dispatch("change", e.currentTarget.value)}
/>
