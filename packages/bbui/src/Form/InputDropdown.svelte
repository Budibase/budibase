<script lang="ts">
  import Field from "./Field.svelte"
  import InputDropdown from "./Core/InputDropdown.svelte"
  import { createEventDispatcher } from "svelte"
  import type { LabelPosition } from "../types"

  interface Option {
    label?: string
    value?: string
    subtitle?: string
  }

  export let inputValue: string | null = null
  export let dropdownValue: string | null = null
  export let inputType = "text"
  export let label: string | undefined = undefined
  export let labelPosition: LabelPosition = "above"
  export let placeholder: string | undefined = undefined
  export let disabled = false
  export let readonly = false
  export let error: string | undefined = undefined
  export let updateOnChange = true
  export let helpText: string | undefined = undefined
  export let options: Option[] = []

  const dispatch = createEventDispatcher<{
    pick: string | null
    change: string
  }>()

  const onPick = (e: CustomEvent<string | null>) => {
    dropdownValue = e.detail
    dispatch("pick", e.detail)
  }
  const onChange = (e: CustomEvent<string>) => {
    inputValue = e.detail
    dispatch("change", e.detail)
  }
</script>

<Field {helpText} {label} {labelPosition} {error}>
  <InputDropdown
    {updateOnChange}
    {disabled}
    {readonly}
    {inputValue}
    {dropdownValue}
    {placeholder}
    {inputType}
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
