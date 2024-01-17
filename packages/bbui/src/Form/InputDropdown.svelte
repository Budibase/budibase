<script>
  import Field from "./Field.svelte"
  import InputDropdown from "./Core/InputDropdown.svelte"
  import { createEventDispatcher } from "svelte"

  export let inputValue = null
  export let dropdownValue = null
  export let inputType = "text"
  export let label = null
  export let labelPosition = "above"
  export let placeholder = null
  export let disabled = false
  export let readonly = false
  export let error = null
  export let updateOnChange = true
  export let quiet = false
  export let autofocus
  export let helpText = null
  export let options = []

  const dispatch = createEventDispatcher()

  const onPick = e => {
    dropdownValue = e.detail
    dispatch("pick", e.detail)
  }
  const onChange = e => {
    inputValue = e.detail
    dispatch("change", e.detail)
  }
</script>

<Field {helpText} {label} {labelPosition} {error}>
  <InputDropdown
    {updateOnChange}
    {error}
    {disabled}
    {readonly}
    {inputValue}
    {dropdownValue}
    {placeholder}
    {inputType}
    {quiet}
    {autofocus}
    {options}
    isOptionSelected={option => option === dropdownValue}
    on:change={onChange}
    on:pick={onPick}
    on:click
    on:input
    on:blur
    on:focus
    on:keyup
  />
</Field>
