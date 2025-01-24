<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import Picker from "./Picker.svelte"
  import { PopoverAlignment } from "../../constants"
  export let value: any = null
  export let id: string | undefined = undefined
  export let placeholder: string | boolean = "Choose an option"
  export let disabled: boolean = false
  export let options: any[] = []
  export let getOptionLabel = (option: any) => option
  export let getOptionValue = (_option: any, _idx: number | undefined) =>
    _option
  export let getOptionIcon: (
    _option: any,
    _idx?: number
  ) => string | undefined = () => undefined
  export let getOptionColour: (
    _option: any,
    _idx?: number
  ) => string | undefined = () => undefined
  export let getOptionSubtitle: (
    _option: any,
    _idx?: number
  ) => string | undefined = () => undefined
  export let compare: any = null
  export let useOptionIconImage = false
  export let isOptionEnabled
  export let readonly: boolean = false
  export let quiet: boolean = false
  export let autoWidth: boolean = false
  export let autocomplete: boolean = false
  export let sort: boolean = false
  export let align: PopoverAlignment | undefined = PopoverAlignment.Left
  export let footer: string | undefined = undefined
  export let open: boolean = false
  export let searchTerm: string | undefined = undefined
  export let loading: boolean | undefined = undefined
  export let onOptionMouseenter = () => {}
  export let onOptionMouseleave = () => {}
  export let customPopoverHeight: string | undefined = undefined

  const dispatch = createEventDispatcher()

  $: fieldText = getFieldText(value, options, placeholder)
  $: fieldIcon = getFieldAttribute(getOptionIcon, value, options)
  $: fieldColour = getFieldAttribute(getOptionColour, value, options)

  function compareOptionAndValue(option: any, value: any) {
    return typeof compare === "function"
      ? compare(option, value)
      : option === value
  }

  const getFieldAttribute = (getAttribute: any, value: any, options: any) => {
    // Wait for options to load if there is a value but no options
    if (!options?.length) {
      return ""
    }
    const index = options.findIndex((option: any, idx: number) =>
      compareOptionAndValue(getOptionValue(option, idx), value)
    )
    return index !== -1 ? getAttribute(options[index], index) : null
  }

  const getFieldText = (
    value: any,
    options: any,
    placeholder: boolean | string
  ) => {
    if (value == null || value === "") {
      // Explicit false means use no placeholder and allow an empty fields
      if (placeholder === false) {
        return ""
      }
      // Otherwise we use the placeholder if possible
      return placeholder || "Choose an option"
    }

    return (
      getFieldAttribute(getOptionLabel, value, options) || "Choose an option"
    )
  }

  const selectOption = (value: any) => {
    dispatch("change", value)
    open = false
  }
</script>

<Picker
  on:click
  bind:open
  bind:searchTerm
  on:loadMore
  {quiet}
  {id}
  {disabled}
  {readonly}
  {fieldText}
  {fieldIcon}
  {fieldColour}
  {options}
  {autoWidth}
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
  {sort}
  {onOptionMouseenter}
  {onOptionMouseleave}
  isPlaceholder={value == null || value === ""}
  placeholderOption={placeholder === false
    ? undefined
    : placeholder || "Choose an option"}
  isOptionSelected={option => compareOptionAndValue(option, value)}
  onSelectOption={selectOption}
  {loading}
  {customPopoverHeight}
/>
