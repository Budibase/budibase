<script>
  import { createEventDispatcher } from "svelte"
  import Picker from "./Picker.svelte"

  export let value = null
  export let id = null
  export let placeholder = "Choose an option"
  export let disabled = false
  export let error = null
  export let options = []
  export let getOptionLabel = option => option
  export let getOptionValue = option => option
  export let readonly = false
  export let quiet = false

  const dispatch = createEventDispatcher()
  let open = false
  $: fieldText = getFieldText(value, options, placeholder)

  const getFieldText = (value, options, placeholder) => {
    // Always use placeholder if no value
    if (value == null || value === "") {
      return placeholder || "Choose an option"
    }

    // Wait for options to load if there is a value but no options
    if (!options?.length) {
      return ""
    }

    // Render the label if the selected option is found, otherwide raw value
    const index = options.findIndex(
      (option, idx) => getOptionValue(option, idx) === value
    )
    return index !== -1 ? getOptionLabel(options[index], index) : value
  }

  const selectOption = value => {
    dispatch("change", value)
    open = false
  }
</script>

<Picker
  on:click
  bind:open
  {quiet}
  {id}
  {error}
  {disabled}
  {readonly}
  {fieldText}
  {options}
  {getOptionLabel}
  {getOptionValue}
  isPlaceholder={value == null || value === ""}
  placeholderOption={placeholder}
  isOptionSelected={option => option === value}
  onSelectOption={selectOption}
/>
