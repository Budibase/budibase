<script lang="ts">
  import Field from "./Field.svelte"
  import Combobox from "./Core/Combobox.svelte"
  import { createEventDispatcher } from "svelte"

  export let value: string | null = null
  export let label: string | undefined = undefined
  export let disabled: boolean = false
  export let readonly: boolean = false
  export let labelPosition: string = "above"
  export let error: string | null = null
  export let placeholder: string = "Choose an option or type"
  export let options: any[] = []
  export let helpText: string | null = null
  export let getOptionLabel = option => extractProperty(option, "label")
  export let getOptionValue = option => extractProperty(option, "value")

  const dispatch = createEventDispatcher()
  const onChange = e => {
    value = e.detail
    dispatch("change", e.detail)
  }
  const extractProperty = (value, property) => {
    if (value && typeof value === "object") {
      return value[property]
    }
    return value
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
