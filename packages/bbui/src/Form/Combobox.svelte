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
  export let getOptionLabel: (option: O) => string = option =>
    extractProperty(option, "label")
  export let getOptionValue: (option: O) => string = option =>
    extractProperty(option, "value")

  const dispatch = createEventDispatcher<{
    change: string | undefined
  }>()

  const onChange = (event: CustomEvent<string | undefined>) => {
    value = event.detail
    dispatch("change", event.detail)
  }

  const extractProperty = (option: O, property: string): string => {
    if (option && typeof option === "object" && property in option) {
      const record = option as Record<string, unknown>
      const extracted = record[property]
      if (typeof extracted === "string") {
        return extracted
      }
      if (typeof extracted === "number" || typeof extracted === "boolean") {
        return String(extracted)
      }
      return ""
    }

    if (option === null || option === undefined) {
      return ""
    }

    return String(option)
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
