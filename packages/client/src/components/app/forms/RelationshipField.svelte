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
  export let autocomplete = true
  export let defaultValue
  export let onChange
  export let filter

  let fieldState
  let fieldApi
  let fieldSchema
  let tableDefinition
  let searchTerm

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

  $: tableDefinition = $fetch.definition
  $: selectedValue = multiselect
    ? flatten(fieldState?.value) ?? []
    : flatten(fieldState?.value)?.[0]
  $: component = multiselect ? CoreMultiselect : CoreSelect
  $: expandedDefaultValue = expand(defaultValue)
  $: primaryDisplay = tableDefinition?.primaryDisplay

  $: initialValues =
    initialValues ||
    (primaryDisplay &&
      fieldState?.value?.map(x => ({
        _id: x._id,
        [primaryDisplay]: x.primaryDisplay,
      })))

  $: allOptions = {
    ...(allOptions || {}),
    ...[...($fetch.rows || []), ...(initialValues || [])]?.reduce((p, c) => {
      p[c._id] = c
      return p
    }, {}),
  }

  $: options = Object.values(allOptions)

  $: fetchRows(searchTerm, primaryDisplay)

  const fetchRows = (searchTerm, primaryDisplay) => {
    const allRowsFetched =
      $fetch.loaded &&
      !Object.keys($fetch.query.string).length &&
      !$fetch.hasNextPage
    if (!allRowsFetched) {
      // Don't request until we have the primary display
      if (primaryDisplay) {
        fetch.update({
          query: { string: { [primaryDisplay]: searchTerm } },
        })
      }
    }
  }

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
    return row?.[primaryDisplay] || "-"
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

  const loadMore = () => {
    if (!$fetch.loading) {
      fetch.nextPage()
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
      value={selectedValue}
      on:change={multiselect ? multiHandler : singleHandler}
      on:loadMore={loadMore}
      id={fieldState.fieldId}
      disabled={fieldState.disabled}
      error={fieldState.error}
      getOptionLabel={getDisplayName}
      getOptionValue={option => option._id}
      {placeholder}
      sort
      useFetch={false}
      bind:searchTerm
    />
  {/if}
</Field>
