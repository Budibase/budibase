<script lang="ts" context="module">
  type Option = any
</script>

<script lang="ts">
  import Picker from "./Picker.svelte"
  import type { Primitive } from "@budibase/types"
  import { createEventDispatcher } from "svelte"

  export let value: Primitive[] = []
  export let id: string | undefined = undefined
  export let placeholder: string | null = null
  export let disabled: boolean = false
  export let options: Option[] = []
  export let getOptionLabel = (option: Option, _index?: number) => option
  export let getOptionValue = (option: Option, _index?: number) => option
  export let readonly: boolean = false
  export let autocomplete: boolean = false
  export let sort: boolean = false
  export let autoWidth: boolean = false
  export let searchTerm: string | null = null
  export let customPopoverHeight: string | undefined = undefined
  export let open: boolean = false
  export let loading: boolean = false
  export let onOptionMouseenter = () => {}
  export let onOptionMouseleave = () => {}

  const dispatch = createEventDispatcher()

  $: arrayValue = Array.isArray(value) ? value : [value].filter(x => !!x)
  $: selectedLookupMap = getSelectedLookupMap(arrayValue)
  $: optionLookupMap = getOptionLookupMap(options)

  $: fieldText = getFieldText(arrayValue, optionLookupMap, placeholder)
  $: isOptionSelected = (optionValue: string) =>
    selectedLookupMap[optionValue] === true
  $: toggleOption = makeToggleOption(selectedLookupMap, arrayValue)

  const getFieldText = (
    value: Primitive[],
    map: Record<string, any> | null,
    placeholder: string | null
  ) => {
    if (Array.isArray(value) && value.length > 0) {
      if (!map) {
        return ""
      }
      const vals = value
        .map(v => {
          const str = typeof v === "string" ? v : v.toString()
          return map[str] || v
        })
        .join(", ")
      return `(${value.length}) ${vals}`
    } else {
      return placeholder || "Choose some options"
    }
  }

  const getSelectedLookupMap = (value: Primitive[]) => {
    const map: Record<string, boolean> = {}
    if (Array.isArray(value) && value.length > 0) {
      value.forEach(v => {
        if (v) {
          const str = typeof v === "string" ? v : v.toString()
          map[str] = true
        }
      })
    }
    return map
  }

  const getOptionLookupMap = (options: Option[]) => {
    if (!options?.length) {
      return null
    }

    const map: Record<string, any> = {}
    options.forEach((option, idx) => {
      const optionValue = getOptionValue(option, idx)
      if (optionValue != null) {
        map[optionValue] = getOptionLabel(option, idx) || ""
      }
    })
    return map
  }

  const makeToggleOption = (
    map: Record<string, boolean>,
    value: Primitive[]
  ) => {
    return (optionValue: string) => {
      if (map[optionValue]) {
        // comparison needs to take into account different types, always compare them as strings
        const filtered = value.filter(
          option => option.toString() !== optionValue.toString()
        )
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
