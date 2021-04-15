<script>
  import Picker from "./Picker.svelte"
  import { createEventDispatcher } from "svelte"

  export let value = []
  export let fieldId = null
  export let placeholder = null
  export let disabled = false
  export let error = null
  export let options = []
  export let getOptionLabel = option => option
  export let getOptionValue = option => option

  const dispatch = createEventDispatcher()
  $: selectedLookupMap = getSelectedLookupMap(value)
  $: optionLookupMap = getOptionLookupMap(options)
  $: fieldText = getFieldText(value, optionLookupMap, placeholder)
  $: isOptionSelected = optionValue => selectedLookupMap[optionValue] === true
  $: toggleOption = makeToggleOption(selectedLookupMap, value)

  const getFieldText = (value, map, placeholder) => {
    if (value?.length) {
      const vals = value.map(option => map[option] || "").join(", ")
      return `(${value.length}) ${vals}`
    } else {
      return placeholder || "Choose some options"
    }
  }

  const getSelectedLookupMap = value => {
    let map = {}
    if (value?.length) {
      value.forEach(option => {
        if (option) {
          map[option] = true
        }
      })
    }
    return map
  }

  const getOptionLookupMap = options => {
    let map = {}
    if (options) {
      options.forEach(option => {
        const optionValue = getOptionValue(option)
        if (optionValue != null) {
          map[optionValue] = getOptionLabel(option) || ""
        }
      })
    }
    return map
  }

  const makeToggleOption = (map, value) => {
    return optionValue => {
      if (map[optionValue]) {
        const filtered = value.filter(option => option !== optionValue)
        dispatch("change", filtered)
      } else {
        dispatch("change", [...value, optionValue])
      }
    }
  }
</script>

<Picker
  {fieldId}
  {error}
  {disabled}
  {fieldText}
  {options}
  isPlaceholder={!value?.length}
  {isOptionSelected}
  {getOptionLabel}
  {getOptionValue}
  onSelectOption={toggleOption} />
