<script>
  import { CoreSelect, CoreMultiselect } from "@budibase/bbui"
  import { fetchData } from "@budibase/frontend-core"
  import { getContext } from "svelte"
  import Field from "./Field.svelte"
  import { FieldTypes } from "../../../constants"

  const { API } = getContext("sdk")

  export let field
  export let label
  export let placeholder
  export let disabled = false
  export let validation
  export let autocomplete = false
  export let defaultValue
  export let onChange
  export let filter

  let fieldState
  let fieldApi
  let fieldSchema
  let tableDefinition

  $: multiselect = fieldSchema?.relationshipType !== "one-to-many"
  $: linkedTableId = fieldSchema?.tableId
  $: fetch = fetchData({
    API,
    datasource: {
      type: "table",
      tableId: linkedTableId,
    },
    options: {
      filter,
      limit: 100,
    },
  })
  $: fetch.update({ filter })
  $: options = $fetch.rows
  $: tableDefinition = $fetch.definition
  $: singleValue = flatten(fieldState?.value)?.[0]
  $: multiValue = flatten(fieldState?.value) ?? []
  $: component = multiselect ? CoreMultiselect : CoreSelect
  $: expandedDefaultValue = expand(defaultValue)

  const flatten = values => {
    if (!values) {
      return []
    }
    if (!Array.isArray(values)) {
      values = [values]
    }
    return values.map(value => (typeof value === "object" ? value._id : value))
  }

  const getDisplayName = row => {
    return row?.[tableDefinition?.primaryDisplay || "_id"] || "-"
  }

  const singleHandler = e => {
    handleChange(e.detail == null ? [] : [e.detail])
  }

  const multiHandler = e => {
    handleChange(e.detail)
  }

  const expand = values => {
    if (!values) {
      return []
    }
    if (Array.isArray(values)) {
      return values
    }
    return values.split(",").map(value => value.trim())
  }

  const handleChange = value => {
    const changed = fieldApi.setValue(value)
    if (onChange && changed) {
      onChange({ value })
    }
  }
</script>

<Field
  {label}
  {field}
  {disabled}
  {validation}
  defaultValue={expandedDefaultValue}
  type={FieldTypes.LINK}
  bind:fieldState
  bind:fieldApi
  bind:fieldSchema
>
  {#if fieldState}
    <svelte:component
      this={component}
      {options}
      {autocomplete}
      value={multiselect ? multiValue : singleValue}
      on:change={multiselect ? multiHandler : singleHandler}
      id={fieldState.fieldId}
      disabled={fieldState.disabled}
      error={fieldState.error}
      getOptionLabel={getDisplayName}
      getOptionValue={option => option._id}
      {placeholder}
      sort={true}
    />
  {/if}
</Field>
