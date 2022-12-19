<script>
  import { createEventDispatcher } from "svelte"
  import Multiselect from "./Core/Multiselect.svelte"
  import Field from "./Field.svelte"

  export let value = []
  export let label = null
  export let disabled = false
  export let readonly = false
  export let labelPosition = "above"
  export let error = null
  export let placeholder = null
  export let options = []
  export let getOptionLabel = option => option
  export let getOptionValue = option => option
  export let sort = false
  export let autoWidth = false
  const dispatch = createEventDispatcher()
  const onChange = e => {
    value = e.detail
    dispatch("change", e.detail)
  }
</script>

<Field {label} {labelPosition} {error}>
  <Multiselect
    {error}
    {disabled}
    {readonly}
    {value}
    {options}
    {placeholder}
    {sort}
    {getOptionLabel}
    {getOptionValue}
    {autoWidth}
    on:change={onChange}
    on:click
  />
</Field>
