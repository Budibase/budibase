<script>
  import Field from "./Field.svelte"
  import RadioGroup from "./Core/RadioGroup.svelte"
  import { createEventDispatcher } from "svelte"

  export let value = undefined
  export let label = undefined
  export let disabled = false
  export let labelPosition = "above"
  export let error = undefined
  export let options = []
  export let direction = "vertical"
  export let getOptionLabel = option => extractProperty(option, "label")
  export let getOptionValue = option => extractProperty(option, "value")
  export let getOptionTitle = option => extractProperty(option, "label")
  export let helpText = undefined

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
  <RadioGroup
    {error}
    {disabled}
    {value}
    {options}
    {direction}
    {getOptionLabel}
    {getOptionValue}
    {getOptionTitle}
    on:change={onChange}
  />
</Field>
