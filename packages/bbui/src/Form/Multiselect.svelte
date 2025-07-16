<script lang="ts" generics="Option">
  import { createEventDispatcher } from "svelte"
  import Multiselect from "./Core/Multiselect.svelte"
  import Field from "./Field.svelte"
  import type { LabelPosition } from "../types"

  export let value: string[] | string = []
  export let label: string | undefined = undefined
  export let disabled = false
  export let readonly = false
  export let labelPosition: LabelPosition = "above"
  export let error: string | undefined = undefined
  export let placeholder: string | undefined = undefined
  export let options: Option[] = []
  export let getOptionLabel: (_: Option) => Option | string = (
    option: Option
  ) => option
  export let getOptionValue: (_: Option) => Option | string = (
    option: Option
  ) => option
  export let sort = false
  export let autoWidth = false
  export let autocomplete = false
  export let searchTerm: string | undefined = undefined
  export let customPopoverHeight: string | undefined = undefined
  export let helpText: string | undefined = undefined
  export let onOptionMouseenter = () => {}
  export let onOptionMouseleave = () => {}

  $: arrayValue = value && !Array.isArray(value) ? [value] : (value as string[])

  const dispatch = createEventDispatcher()
  const onChange = (e: any) => {
    value = e.detail
    dispatch("change", e.detail)
  }
</script>

<Field {helpText} {label} {labelPosition} {error}>
  <Multiselect
    {disabled}
    {readonly}
    bind:value={arrayValue}
    {options}
    {placeholder}
    {sort}
    {getOptionLabel}
    {getOptionValue}
    {autoWidth}
    {autocomplete}
    {customPopoverHeight}
    {onOptionMouseenter}
    {onOptionMouseleave}
    bind:searchTerm
    on:change={onChange}
    on:click
  />
</Field>
