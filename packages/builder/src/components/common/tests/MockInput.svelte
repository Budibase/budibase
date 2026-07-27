<script lang="ts">
  import { createEventDispatcher } from "svelte"

  export let value: any = ""
  export let type: string | undefined = "text"
  export let readonly = false
  export let disabled = false
  export let placeholder: string | undefined = undefined
  export let label: string | undefined = undefined

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

<label>
  {label || placeholder || "Input"}
  <input
    {value}
    {type}
    {readonly}
    {disabled}
    {placeholder}
    on:input={onInput}
    on:blur={onBlur}
  />
</label>
<slot />
