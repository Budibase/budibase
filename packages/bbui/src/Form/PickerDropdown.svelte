<script>
  import Field from "./Field.svelte"
  import PickerDropdown from "./Core/PickerDropdown.svelte"
  import { createEventDispatcher } from "svelte"

  export let primaryValue = null
  export let secondaryValue = null
  export let inputType = "text"
  export let label = null
  export let labelPosition = "above"
  export let secondaryPlaceholder = null
  export let autocomplete
  export let placeholder = null
  export let disabled = false
  export let readonly = false
  export let error = null
  export let getSecondaryOptionLabel = option =>
    extractProperty(option, "label")
  export let getSecondaryOptionValue = option =>
    extractProperty(option, "value")
  export let getSecondaryOptionColour = () => {}
  export let getSecondaryOptionIcon = () => {}
  export let quiet = false
  export let autofocus
  export let primaryOptions = []
  export let secondaryOptions = []
  export let searchTerm
  export let showClearIcon = true
  export let helpText = null

  let primaryLabel
  let secondaryLabel
  const dispatch = createEventDispatcher()

  $: secondaryFieldText = getSecondaryFieldText(
    secondaryValue,
    secondaryOptions,
    secondaryPlaceholder
  )
  $: secondaryFieldIcon = getSecondaryFieldAttribute(
    getSecondaryOptionIcon,
    secondaryValue,
    secondaryOptions
  )
  $: secondaryFieldColour = getSecondaryFieldAttribute(
    getSecondaryOptionColour,
    secondaryValue,
    secondaryOptions
  )

  const getSecondaryFieldAttribute = (getAttribute, value, options) => {
    // Wait for options to load if there is a value but no options

    if (!options?.length) {
      return ""
    }

    const index = options.findIndex(
      (option, idx) => getSecondaryOptionValue(option, idx) === value
    )

    return index !== -1 ? getAttribute(options[index], index) : null
  }

  const getSecondaryFieldText = (value, options, placeholder) => {
    // Always use placeholder if no value
    if (value == null || value === "") {
      return placeholder || "Choose an option"
    }

    return getSecondaryFieldAttribute(getSecondaryOptionLabel, value, options)
  }

  const onPickPrimary = e => {
    primaryLabel = e?.detail?.label || null
    primaryValue = e?.detail?.value || null
    dispatch("pickprimary", e?.detail?.value || {})
  }

  const onPickSecondary = e => {
    secondaryValue = e.detail
    dispatch("picksecondary", e.detail)
  }

  const extractProperty = (value, property) => {
    if (value && typeof value === "object") {
      return value[property]
    }
    return value
  }

  const updateSearchTerm = e => {
    searchTerm = e.detail
  }
</script>

<Field {helpText} {label} {labelPosition} {error}>
  <PickerDropdown
    {searchTerm}
    {autocomplete}
    {error}
    {disabled}
    {readonly}
    {placeholder}
    {inputType}
    {quiet}
    {autofocus}
    {primaryOptions}
    {secondaryOptions}
    {getSecondaryOptionLabel}
    {getSecondaryOptionValue}
    {getSecondaryOptionIcon}
    {getSecondaryOptionColour}
    {secondaryFieldText}
    {secondaryFieldIcon}
    {secondaryFieldColour}
    {primaryValue}
    {secondaryValue}
    {primaryLabel}
    {secondaryLabel}
    {showClearIcon}
    on:pickprimary={onPickPrimary}
    on:picksecondary={onPickSecondary}
    on:search={updateSearchTerm}
    on:click
    on:input
    on:blur
    on:focus
    on:keyup
    on:closed
  />
</Field>
