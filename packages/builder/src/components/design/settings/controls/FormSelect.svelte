<script>
  import { Select } from "@budibase/bbui"
  import { selectedScreen } from "@/stores/builder"
  import { getAvailableFormOptions } from "@/helpers/formBlockTracker"
  import { createEventDispatcher } from "svelte"

  export let componentInstance = {}
  export let value = ""
  export let placeholder = "Select a form to track"

  const dispatch = createEventDispatcher()

  $: options = getAvailableFormOptions($selectedScreen)
  $: boundValue = getValidValue(value, options)

  const getValidValue = (value, options) => {
    // Reset value if there aren't any options
    if (!Array.isArray(options) || options.length === 0) {
      return null
    }

    // Reset value if the value isn't found in the options
    if (!options.some(option => option.value === value)) {
      return null
    }

    return value
  }

  const onChange = (event) => {
    const newValue = event.detail
    // Don't validate - just pass through the selected value
    boundValue = newValue
    // Dispatch the change event to update the component's value prop
    dispatch("change", newValue)
  }
</script>

<Select
  {placeholder}
  value={boundValue}
  on:change={onChange}
  {options}
/>