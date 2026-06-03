<script lang="ts">
  import { createEventDispatcher } from "svelte"

  export let value: any = ""
  export let disabled = false
  export let placeholder = "Value"

  const dispatch = createEventDispatcher()

  const onInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    value = target.value
    dispatch("change", target.value)
  }
</script>

<input
  aria-label="Date value"
  {disabled}
  {placeholder}
  {value}
  on:input={onInput}
/>
