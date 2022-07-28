<script>
  import Picker from "./Picker.svelte"
  import { createEventDispatcher } from "svelte"

  export let value = []
  export let id = null
  export let placeholder = null
  export let disabled = false
  export let error = null
  export let options = []
  export let getOptionLabel = option => option
  export let getOptionValue = option => option
  export let readonly = false
  export let autocomplete = false
  export let sort = false
  export let autoWidth = false

  const dispatch = createEventDispatcher()
  $: selectedLookupMap = getSelectedLookupMap(value)
  $: optionLookupMap = getOptionLookupMap(options)
  $: fieldText = getFieldText(value, optionLookupMap, placeholder)
  $: isOptionSelected = optionValue => selectedLookupMap[optionValue] === true
  $: toggleOption = makeToggleOption(selectedLookupMap, value)

  const getFieldText = (value, map, placeholder) => {
    if (value?.length) {
      if (!map) {
        return ""
      }
      const vals = value.map(option => map[option] || option).join(", ")
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
    let map = null
    if (options?.length) {
      map = {}
      options.forEach((option, idx) => {
        const optionValue = getOptionValue(option, idx)
        if (optionValue != null) {
          map[optionValue] = getOptionLabel(option, idx) || ""
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
  {id}
  {error}
  {disabled}
  {readonly}
  {fieldText}
  {options}
  isPlaceholder={!value?.length}
  {autocomplete}
  {isOptionSelected}
  {getOptionLabel}
  {getOptionValue}
  onSelectOption={toggleOption}
  {sort}
  {autoWidth}
/>
