<script lang="ts">
  import { createEventDispatcher } from "svelte"

  export let label = ""

  const dispatch = createEventDispatcher<{ change: File[] }>()
  const handleChange = (event: Event) => {
    const input = event.target as HTMLInputElement
    dispatch("change", Array.from(input.files || []))
  }
</script>

<input type="file" aria-label={label} on:change={handleChange} />
