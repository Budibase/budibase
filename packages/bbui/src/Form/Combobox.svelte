<script>
  import Field from "./Field.svelte"
  import Combobox from "./Core/Combobox.svelte"
  import { createEventDispatcher } from "svelte"

  export let value = null
  export let label = undefined
  export let disabled = false
  export let readonly = false
  export let labelPosition = "above"
  export let error = null
  export let placeholder = "Choose an option or type"
  export let options = []
  export let helpText = null
  export let getOptionLabel = option => extractProperty(option, "label")
  export let getOptionValue = option => extractProperty(option, "value")

  const dispatch = createEventDispatcher()
  const onChange = e => {
    value = e.detail
    dispatch("change", e.detail)
  }
  const extractProperty = (value, property) => {
    if (value && typeof value === "object") {
      return value[property]
    }
    return value
  }
</script>

<Field {helpText} {label} {labelPosition} {error}>
  <Combobox
    {error}
    {disabled}
    {value}
    {options}
    {placeholder}
    {readonly}
    {getOptionLabel}
    {getOptionValue}
    on:change={onChange}
    on:pick
    on:type
    on:blur
  />
</Field>
