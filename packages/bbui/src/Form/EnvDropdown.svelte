<script>
  import Field from "./Field.svelte"
  import EnvDropdown from "./Core/EnvDropdown.svelte"
  import { createEventDispatcher } from "svelte"

  export let value = null
  export let label = null
  export let labelPosition = "above"
  export let placeholder = null
  export let type = "text"
  export let disabled = false
  export let readonly = false
  export let error = null
  export let updateOnChange = true
  export let quiet = false
  export let autofocus
  export let variables
  export let showModal
  export let helpText = null
  export let environmentVariablesEnabled
  export let handleUpgradePanel
  const dispatch = createEventDispatcher()
  const onChange = e => {
    value = e.detail
    dispatch("change", e.detail)
  }
</script>

<Field {helpText} {label} {labelPosition} {error}>
  <EnvDropdown
    {updateOnChange}
    {error}
    {disabled}
    {readonly}
    {value}
    {placeholder}
    {type}
    {quiet}
    {autofocus}
    {variables}
    {showModal}
    {environmentVariablesEnabled}
    {handleUpgradePanel}
    on:change={onChange}
    on:click
    on:input
    on:blur
    on:focus
    on:keyup
  />
</Field>
