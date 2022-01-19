<script>
  import { CoreMultiselect } from "@budibase/bbui"
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
      return values
    }

    return values.split(",").map(value => value.trim())
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
    <CoreMultiselect
      value={fieldState.value || []}
      error={fieldState.error}
      getOptionLabel={flatOptions ? x => x : x => x.label}
      getOptionValue={flatOptions ? x => x : x => x.value}
      id={fieldState.fieldId}
      disabled={fieldState.disabled}
      on:change={e => fieldApi.setValue(e.detail)}
      {placeholder}
      {options}
      {autocomplete}
    />
  {/if}
</Field>
