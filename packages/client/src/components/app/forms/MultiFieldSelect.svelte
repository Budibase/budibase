<script lang="ts">
  import { CoreMultiselect, CoreCheckboxGroup } from "@budibase/bbui"
  import {
    type UIFieldValidationRule,
    type UIFieldDataProviderContext,
    type UIFieldOnChange,
    type FieldSchema,
    FieldType,
  } from "@budibase/types"
  import type { FieldApi, FieldState } from "@/types"
  import Field from "./Field.svelte"
  import { getOptions } from "./optionsParser"

  export let field: string
  export let label: string | undefined = undefined
  export let placeholder: string | undefined = undefined
  export let disabled: boolean = false
  export let readonly: boolean = false
  export let validation: UIFieldValidationRule[] | undefined = undefined
  export let defaultValue: string | undefined = undefined
  export let optionsSource: string = "schema"
  export let dataProvider: UIFieldDataProviderContext | undefined = undefined
  export let labelColumn: string | undefined = undefined
  export let valueColumn: string | undefined = undefined
  export let customOptions
  export let autocomplete: boolean = false
  export let onChange: UIFieldOnChange | undefined = undefined
  export let optionsType: "select" | "checkbox" = "select"
  export let direction: "horizontal" | "vertical" = "vertical"
  export let span: number | undefined = undefined
  export let helpText: string | undefined = undefined

  let fieldState: FieldState | undefined
  let fieldApi: FieldApi | undefined
  let fieldSchema: FieldSchema | undefined

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

  const expand = (values?: string[] | string): string[] => {
    if (!values) {
      return []
    }
    if (Array.isArray(values)) {
      return values.slice()
    }
    return values.split(",").map(value => value.trim())
  }

  const getProp = (prop: "label" | "value", x: any) => {
    return x[prop]
  }

  const handleChange = (e: any) => {
    const changed = fieldApi?.setValue(e.detail)
    if (onChange && changed) {
      onChange({ value: e.detail })
    }
  }
</script>

<Field
  {field}
  {label}
  {disabled}
  {readonly}
  {validation}
  {span}
  {helpText}
  defaultValue={expandedDefaultValue}
  type={FieldType.ARRAY}
  bind:fieldState
  bind:fieldApi
  bind:fieldSchema
>
  {#if fieldState}
    {#if !optionsType || optionsType === "select"}
      <CoreMultiselect
        value={fieldState.value || []}
        getOptionLabel={flatOptions ? x => x : x => x.label}
        getOptionValue={flatOptions ? x => x : x => x.value}
        id={fieldState.fieldId}
        disabled={fieldState.disabled}
        readonly={fieldState.readonly}
        on:change={handleChange}
        {placeholder}
        {options}
        {autocomplete}
      />
    {:else if optionsType === "checkbox"}
      <CoreCheckboxGroup
        value={fieldState.value || []}
        disabled={fieldState.disabled}
        readonly={fieldState.readonly}
        {options}
        {direction}
        on:change={handleChange}
        getOptionLabel={flatOptions ? x => x : x => getProp("label", x)}
        getOptionValue={flatOptions ? x => x : x => getProp("value", x)}
      />
    {/if}
  {/if}
</Field>
