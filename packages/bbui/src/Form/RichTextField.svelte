<script>
  import Field from "./Field.svelte"
  import RichTextField from "./Core/RichTextField.svelte"
  import { createEventDispatcher } from "svelte"

  export let value = null
  export let label = null
  export let labelPosition = "above"
  export let placeholder = null
  export let disabled = false
  export let error = null
  export let height = null
  export let id = null
  export let fullScreenOffset = null
  export let easyMDEOptions = null
  export let helpText = null

  const dispatch = createEventDispatcher()
  const onChange = e => {
    value = e.detail
    dispatch("change", e.detail)
  }
</script>

<Field {helpText} {label} {labelPosition} {error}>
  <RichTextField
    {error}
    {disabled}
    {value}
    {placeholder}
    {height}
    {id}
    {fullScreenOffset}
    {easyMDEOptions}
    on:change={onChange}
  />
</Field>
