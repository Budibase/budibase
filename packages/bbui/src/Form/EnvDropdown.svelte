<script lang="ts">
  import Field from "./Field.svelte"
  import EnvDropdown from "./Core/EnvDropdown.svelte"
  import { createEventDispatcher } from "svelte"
  import type { EnvDropdownType, LabelPosition } from "../types"

  export let value: string | undefined = undefined
  export let label: string | undefined = undefined
  export let labelPosition: LabelPosition = "above"
  export let placeholder: string | undefined = undefined
  export let type: EnvDropdownType = "text"
  export let disabled = false
  export let readonly = false
  export let error: string | undefined = undefined
  export let updateOnChange = true
  export let autofocus: boolean = false
  export let variables: { name: string }[] = []
  export let showModal: () => void
  export let helpText: string | undefined = undefined
  export let environmentVariablesEnabled: boolean = false
  export let handleUpgradePanel: () => void = () => {}
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
