<script lang="ts">
  import Field from "./Field.svelte"
  import EnvDropdown from "./Core/EnvDropdown.svelte"
  import { createEventDispatcher } from "svelte"

  export let value: string | undefined = undefined
  export let label: string | undefined = undefined
  export let labelPosition = "above"
  export let placeholder = null
  export let type: "text" | "number" = "text"
  export let disabled = false
  export let readonly = false
  export let error: string | undefined = undefined
  export let updateOnChange = true
  export let autofocus
  export let variables
  export let showModal
  export let helpText: string | undefined = undefined
  export let environmentVariablesEnabled
  export let handleUpgradePanel
  const dispatch = createEventDispatcher()
  const onChange = (e: any) => {
    value = e.detail
    dispatch("change", e.detail)
  }
</script>

<Field {helpText} {label} {labelPosition} {error}>
  <EnvDropdown
    {updateOnChange}
    {disabled}
    {readonly}
    {value}
    {placeholder}
    {type}
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
