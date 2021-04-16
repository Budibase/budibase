<script>
  import { createEventDispatcher } from "svelte"
  import Picker from "./Picker.svelte"

  export let value = null
  export let fieldId = null
  export let placeholder = "Choose an option"
  export let disabled = false
  export let error = null
  export let options = []
  export let getOptionLabel = option => option
  export let getOptionValue = option => option

  const dispatch = createEventDispatcher()
  let open = false
  $: isNull = value == null || value === ""
  $: placeholderText = placeholder || "Choose an option"
  $: selectedOption = options.find(option => getOptionValue(option) === value)
  $: selectedLabel = selectedOption
    ? getOptionLabel(selectedOption)
    : placeholderText
  $: fieldText = isNull ? placeholderText : selectedLabel

  const selectOption = value => {
    dispatch("change", value)
    open = false
  }
</script>

<Picker
  bind:open
  {fieldId}
  {error}
  {disabled}
  {fieldText}
  {options}
  {getOptionLabel}
  {getOptionValue}
  isPlaceholder={isNull}
  placeholderOption={placeholder}
  isOptionSelected={option => option === value}
  onSelectOption={selectOption} />
