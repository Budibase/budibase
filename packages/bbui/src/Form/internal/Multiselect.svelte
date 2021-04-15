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
  $: isOptionSelected = option => {
    return valueLookupMap[option] === true
  }

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
        if (option) {
          map[option] = true
        }
      })
    }
    return map
  }

  const toggleOption = optionValue => {
    if (valueLookupMap[optionValue]) {
      const filtered = value.filter(option => option !== optionValue)
      dispatch("change", filtered)
    } else {
      dispatch("change", [...value, optionValue])
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
