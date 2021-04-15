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
  $: fieldText = getFieldText(value)
  $: valueLookupMap = getValueLookupMap(value)
  $: isOptionSelected = option => valueLookupMap[option] === true

  const getFieldText = value => {
    if (value?.length) {
      const count = value?.length ?? 0
      return `${count} selected option${count === 1 ? "" : "s"}`
    } else {
      return placeholder || "Choose some options"
    }
  }

  const getValueLookupMap = value => {
    let map = {}
    if (value?.length) {
      value.forEach(option => {
        const optionValue = getOptionValue(option)
        if (optionValue) {
          map[optionValue] = true
        }
      })
    }
    return map
  }

  const toggleOption = option => {
    if (valueLookupMap[option]) {
      const filtered = value.filter(option => option !== id)
      dispatch("change", filtered)
    } else {
      dispatch("change", [...value, option])
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
