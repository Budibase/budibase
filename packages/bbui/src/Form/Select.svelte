<script>
  import Field from "./Field.svelte"
  import Select from "./Core/Select.svelte"
  import { createEventDispatcher } from "svelte"

  export let value = null
  export let label = undefined
  export let disabled = false
  export let readonly = false
  export let labelPosition = "above"
  export let error = null
  export let placeholder = "Choose an option"
  export let options = []
  export let getOptionLabel = option => extractProperty(option, "label")
  export let getOptionValue = option => extractProperty(option, "value")
  export let getOptionIcon = option => option?.icon
  export let useOptionIconImage = false
  export let getOptionColour = option => option?.colour
  export let isOptionEnabled
  export let quiet = false
  export let autoWidth = false
  export let sort = false
  export let tooltip = ""
  export let autocomplete = false
  export let customPopoverHeight
  export let align
  export let footer = null
  export let tag = null
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

<Field {label} {labelPosition} {error} {tooltip}>
  <Select
    {quiet}
    {error}
    {disabled}
    {readonly}
    {value}
    {options}
    {placeholder}
    {autoWidth}
    {sort}
    {align}
    {footer}
    {getOptionLabel}
    {getOptionValue}
    {getOptionIcon}
    {getOptionColour}
    {useOptionIconImage}
    {isOptionEnabled}
    {autocomplete}
    {customPopoverHeight}
    {tag}
    on:change={onChange}
    on:click
  />
</Field>
