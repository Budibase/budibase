<script>
  import { createEventDispatcher } from "svelte"
  import Picker from "./Picker.svelte"

  export let value = null
  export let fieldId = null
  export let placeholder = null
  export let disabled = false
  export let error = null
  export let options = []
  export let getOptionLabel = option => option
  export let getOptionValue = option => option

  const dispatch = createEventDispatcher()
  let open = false
  $: placeholderText = placeholder || "Choose an option"
  $: isNull = value == null || value === ""
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
  placeholderOption={placeholderText}
  isOptionSelected={option => option === value}
  onSelectOption={selectOption} />
