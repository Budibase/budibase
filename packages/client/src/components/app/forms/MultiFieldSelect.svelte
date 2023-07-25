<script>
  import { CoreMultiselect, CoreCheckboxGroup } from "@budibase/bbui"
  import Field from "./Field.svelte"
  import { getOptions } from "./optionsParser"
  export let field
  export let label
  export let placeholder
  export let disabled = false
  export let validation
  export let defaultValue
  export let optionsSource = "schema"
  export let dataProvider
  export let labelColumn
  export let valueColumn
  export let customOptions
  export let autocomplete = false
  export let onChange
  export let optionsType = "select"
  export let direction = "vertical"

  let fieldState
  let fieldApi
  let fieldSchema

  $: flatOptions = optionsSource == null || optionsSource === "schema"
  $: expandedDefaultValue = expand(defaultValue)
  $: options = getOptions(
    optionsSource,
    fieldSchema,
    dataProvider,
    labelColumn,
    valueColumn,
    customOptions
  )

  const expand = values => {
    if (!values) {
      return []
    }
    if (Array.isArray(values)) {
      return values.slice()
    }
    return values.split(",").map(value => value.trim())
  }

  const handleChange = e => {
    const changed = fieldApi.setValue(e.detail)
    if (onChange && changed) {
      onChange({ value: e.detail })
    }
  }
</script>

<Field
  {field}
  {label}
  {disabled}
  {validation}
  defaultValue={expandedDefaultValue}
  type="array"
  bind:fieldState
  bind:fieldApi
  bind:fieldSchema
>
  {#if fieldState}
    {#if !optionsType || optionsType === "select"}
      <CoreMultiselect
        value={fieldState.value || []}
        error={fieldState.error}
        getOptionLabel={flatOptions ? x => x : x => x.label}
        getOptionValue={flatOptions ? x => x : x => x.value}
        id={fieldState.fieldId}
        disabled={fieldState.disabled}
        on:change={handleChange}
        {placeholder}
        {options}
        {autocomplete}
      />
    {:else if optionsType === "checkbox"}
      <CoreCheckboxGroup
        value={fieldState.value || []}
        id={fieldState.fieldId}
        disabled={fieldState.disabled}
        error={fieldState.error}
        {options}
        {direction}
        on:change={handleChange}
        getOptionLabel={flatOptions ? x => x : x => x.label}
        getOptionValue={flatOptions ? x => x : x => x.value}
      />
    {/if}
  {/if}
</Field>
