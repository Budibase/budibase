<script>
  import Field from "./Field.svelte"
  import Select from "./Core/Select.svelte"
  import { createEventDispatcher } from "svelte"

  export let value = null
  export let label = undefined
  export let disabled = false
  export let labelPosition = "above"
  export let error = null
  export let placeholder = "Choose an option"
  export let options = []
  export let getOptionLabel = option => option
  export let getOptionValue = option => option

  const dispatch = createEventDispatcher()
  const onChange = e => {
    dispatch("change", e.detail)
    value = e.detail
  }
</script>

<Field {label} {labelPosition} {disabled} {error}>
  <Select
    {error}
    {disabled}
    {value}
    {options}
    {placeholder}
    {getOptionLabel}
    {getOptionValue}
    on:change={onChange} />
</Field>
