<script>
  import Picker from "./Picker.svelte"
  import { createEventDispatcher } from "svelte"

  export let value = []
  export let id = null
  export let placeholder = null
  export let disabled = false
  export let options = []
  export let getOptionLabel = option => option
  export let getOptionValue = option => option
  export let readonly = false
  export let autocomplete = false
  export let sort = false
  export let autoWidth = false
  export let searchTerm = null
  export let customPopoverHeight
  export let open = false
  export let loading
  export let onOptionMouseenter = () => {}
  export let onOptionMouseleave = () => {}

  const dispatch = createEventDispatcher()

  $: arrayValue = Array.isArray(value) ? value : [value].filter(x => !!x)
  $: selectedLookupMap = getSelectedLookupMap(arrayValue)
  $: optionLookupMap = getOptionLookupMap(options)

  $: fieldText = getFieldText(arrayValue, optionLookupMap, placeholder)
  $: isOptionSelected = optionValue => selectedLookupMap[optionValue] === true
  $: toggleOption = makeToggleOption(selectedLookupMap, arrayValue)

  const getFieldText = (value, map, placeholder) => {
    if (Array.isArray(value) && value.length > 0) {
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
    if (Array.isArray(value) && value.length > 0) {
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
  on:loadMore
  {id}
  {disabled}
  {readonly}
  {fieldText}
  {options}
  isPlaceholder={!arrayValue.length}
  {autocomplete}
  bind:searchTerm
  bind:open
  {isOptionSelected}
  {getOptionLabel}
  {getOptionValue}
  onSelectOption={toggleOption}
  {sort}
  {autoWidth}
  {customPopoverHeight}
  {loading}
  {onOptionMouseenter}
  {onOptionMouseleave}
/>
