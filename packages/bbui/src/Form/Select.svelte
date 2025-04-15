<script lang="ts" generics="O extends any,V">
  import Field from "./Field.svelte"
  import Select from "./Core/Select.svelte"
  import { createEventDispatcher } from "svelte"
  import { PopoverAlignment } from "../constants"

  export let value: V | undefined = undefined
  export let label: string | undefined = undefined
  export let disabled: boolean = false
  export let readonly: boolean = false
  export let labelPosition: string = "above"
  export let error: string | undefined = undefined
  export let placeholder: string | boolean = "Choose an option"
  export let options: O[] = []
  export let getOptionLabel = (option: O, _index?: number) =>
    extractProperty(option, "label")
  export let getOptionValue = (option: O, _index?: number) =>
    extractProperty(option, "value")
  export let getOptionSubtitle = (option: O, _index?: number) =>
    (option as any)?.subtitle
  export let getOptionIcon = (option: O, _index?: number) =>
    (option as any)?.icon
  export let getOptionColour = (option: O, _index?: number) =>
    (option as any)?.colour
  export let useOptionIconImage = false
  export let isOptionEnabled:
    | ((_option: O, _index?: number) => boolean)
    | undefined = undefined
  export let quiet: boolean = false
  export let autoWidth: boolean = false
  export let sort: boolean = false
  export let tooltip: string | undefined = undefined
  export let autocomplete: boolean = false
  export let customPopoverHeight: string | undefined = undefined
  export let align: PopoverAlignment | undefined = PopoverAlignment.Left
  export let footer: string | undefined = undefined
  export let helpText: string | undefined = undefined
  export let compare: any = undefined
  export let onOptionMouseenter = () => {}
  export let onOptionMouseleave = () => {}
  export let loading: boolean | undefined = false

  const dispatch = createEventDispatcher()
  const onChange = (e: CustomEvent<any>) => {
    value = e.detail
    dispatch("change", e.detail)
  }

  const extractProperty = (value: any, property: any) => {
    if (value && typeof value === "object") {
      return value[property]
    }
    return value
  }
</script>

<Field {helpText} {label} {labelPosition} {error} {tooltip}>
  <Select
    {quiet}
    {loading}
    {disabled}
    {readonly}
    {value}
    {options}
    {placeholder}
    {autoWidth}
    {sort}
    {align}
    {footer}
    {getOptionLabel}
    {getOptionValue}
    {getOptionIcon}
    {getOptionColour}
    {getOptionSubtitle}
    {useOptionIconImage}
    {isOptionEnabled}
    {autocomplete}
    {customPopoverHeight}
    {compare}
    {onOptionMouseenter}
    {onOptionMouseleave}
    on:change={onChange}
    on:click
  />
</Field>
