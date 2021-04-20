<script>
  import Field from "./Field.svelte"
  import TextField from "./Core/TextField.svelte"
  import { createEventDispatcher } from "svelte"

  export let value = null
  export let label = null
  export let labelPosition = "above"
  export let placeholder = null
  export let type = "text"
  export let disabled = false
  export let readonly = false
  export let error = null

  const dispatch = createEventDispatcher()
  const onChange = e => {
    dispatch("change", e.detail)
    value = e.detail
  }
</script>

<Field {label} {labelPosition} {disabled} {error}>
  <TextField
    {error}
    {disabled}
    {readonly}
    {value}
    {placeholder}
    {type}
    on:change={onChange}
    on:click
    on:input />
</Field>
