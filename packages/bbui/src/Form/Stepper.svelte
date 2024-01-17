<script>
  import Field from "./Field.svelte"
  import Stepper from "./Core/Stepper.svelte"
  import { createEventDispatcher } from "svelte"

  export let value = null
  export let label = null
  export let labelPosition = "above"
  export let placeholder = null
  export let disabled = false
  export let readonly = false
  export let error = null
  export let updateOnChange = true
  export let quiet = false
  export let min = null
  export let max = null
  export let step = 1
  export let helpText = null

  const dispatch = createEventDispatcher()
  const onChange = e => {
    value = e.detail
    dispatch("change", e.detail)
  }
</script>

<Field {helpText} {label} {labelPosition} {error}>
  <Stepper
    {updateOnChange}
    {error}
    {disabled}
    {readonly}
    {value}
    {placeholder}
    {quiet}
    {min}
    {max}
    {step}
    on:change={onChange}
    on:click
    on:input
    on:blur
    on:focus
    on:keyup
  />
</Field>
