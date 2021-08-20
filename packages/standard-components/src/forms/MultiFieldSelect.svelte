<script>
  import { Multiselect } from "@budibase/bbui"
  import Field from "./Field.svelte"

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
  console.log(defaultValue)
  let fieldState
  let fieldApi
  let fieldSchema
  $: options = getOptions(
    optionsSource,
    fieldSchema,
    dataProvider,
    labelColumn,
    valueColumn
  )
  const getOptions = (
    optionsSource,
    fieldSchema,
    dataProvider,
    labelColumn,
    valueColumn
  ) => {
    // Take options from schema
    if (optionsSource == null || optionsSource === "schema") {
      return fieldSchema?.constraints?.inclusion ?? []
    }

    // Extract options from data provider
    if (optionsSource === "provider" && valueColumn) {
      let optionsSet = {}
      dataProvider?.rows?.forEach(row => {
        const value = row?.[valueColumn]
        if (value) {
          const label = row[labelColumn] || value
          optionsSet[value] = { value, label }
        }
      })
      return Object.values(optionsSet)
    }

    // Extract custom options
    if (optionsSource === "custom" && customOptions) {
      return customOptions
    }

    return []
  }
</script>

<Field
  {field}
  {label}
  {disabled}
  {validation}
  {defaultValue}
  type="array"
  bind:fieldState
  bind:fieldApi
  bind:fieldSchema
>
  <Multiselect {placeholder} options={options[0]} />
</Field>
