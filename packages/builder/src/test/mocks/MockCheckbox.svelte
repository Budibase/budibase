<script lang="ts">
  import { createEventDispatcher } from "svelte"

  export let value = false
  export let text = ""
  export let disabled = false

  const dispatch = createEventDispatcher<{ change: boolean }>()
</script>

<label>
  <input
    type="checkbox"
    checked={value}
    {disabled}
    on:change={event =>
      dispatch("change", (event.currentTarget as HTMLInputElement).checked)}
  />
  {text}
</label>
