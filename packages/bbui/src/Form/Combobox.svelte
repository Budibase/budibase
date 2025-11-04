<script lang="ts" generics="O">
  import { createEventDispatcher } from "svelte"

  import Combobox from "./Core/Combobox.svelte"
  import Field from "./Field.svelte"
  import type { LabelPosition } from "../types"

  export let value: string | undefined = undefined
  export let label: string | undefined = undefined
  export let disabled = false
  export let readonly = false
  export let labelPosition: LabelPosition = "above"
  export let error: string | undefined | false = undefined
  export let placeholder = "Choose an option or type"
  export let options: O[] = []
  export let helpText: string | undefined = undefined
  const extractProperty = (item: O, property: string): string => {
    if (item && typeof item === "object" && property in item) {
      const record = item as Record<string, unknown>
      const extracted = record[property]
      if (typeof extracted === "string") {
        return extracted
      }
      if (typeof extracted === "number" || typeof extracted === "boolean") {
        return String(extracted)
      }
      return ""
    }

    if (item === null || item === undefined) {
      return ""
    }

    return String(item)
  }

  const defaultGetOptionLabel = (item: O) => extractProperty(item, "label")
  const defaultGetOptionValue = (item: O) => extractProperty(item, "value")

  type OptionFormatter = (_option: O) => string

  export let getOptionLabel: OptionFormatter = defaultGetOptionLabel
  export let getOptionValue: OptionFormatter = defaultGetOptionValue

  const dispatch = createEventDispatcher<{
    change: string | undefined
  }>()

  const onChange = (event: CustomEvent<string | undefined>) => {
    value = event.detail
    dispatch("change", event.detail)
  }
</script>

<Field {helpText} {label} {labelPosition} {error}>
  <Combobox
    {disabled}
    {value}
    {options}
    {placeholder}
    {readonly}
    {getOptionLabel}
    {getOptionValue}
    on:change={onChange}
    on:pick
    on:type
    on:blur
  />
</Field>
