<script lang="ts">
  import { createEventDispatcher } from "svelte"

  export let value: any = ""
  export let disabled = false
  export let inputType: string | undefined = undefined
  export let placeholder = "Value"

  const dispatch = createEventDispatcher()

  const onInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    value = target.value
    dispatch("change", target.value)
  }

  const onBlur = (event: Event) => {
    const target = event.target as HTMLInputElement
    dispatch("blur", target.value)
  }
</script>

<input
  aria-label="Condition value"
  type={inputType || "text"}
  {disabled}
  {placeholder}
  {value}
  on:input={onInput}
  on:blur={onBlur}
/>
