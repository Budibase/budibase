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
  let open

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

  let optionsObj = {}
  let initialValuesProcessed

  $: {
    if (!initialValuesProcessed && primaryDisplay) {
      // Persist the initial values as options, allowing them to be present in the dropdown,
      // even if they are not in the inital fetch results
      initialValuesProcessed = true
      optionsObj = {
        ...optionsObj,
        ...fieldState?.value?.reduce((accumulator, value) => {
          accumulator[value._id] = {
            _id: value._id,
            [primaryDisplay]: value.primaryDisplay,
          }
          return accumulator
        }, {}),
      }
    }
  }

  $: enrichedOptions = enrichOptions(optionsObj, $fetch.rows)
  const enrichOptions = (optionsObj, fetchResults) => {
    const result = {
      ...optionsObj,
      ...(fetchResults || [])?.reduce((accumulator, row) => {
        accumulator[row._id] = row
        return accumulator
      }, {}),
    }
    return Object.values(result)
  }
  $: {
    // We don't want to reorder while the dropdown is open, to avoid UX jumps
    if (!open) {
      enrichedOptions = enrichedOptions.sort((a, b) => {
        const selectedValues = flatten(fieldState?.value) || []

        const aIsSelected = selectedValues.find(v => v === a._id)
        const bIsSelected = selectedValues.find(v => v === b._id)
        if (aIsSelected && !bIsSelected) {
          return -1
        } else if (!aIsSelected && bIsSelected) {
          return 1
        }

        return a[primaryDisplay] > b[primaryDisplay]
      })
    }
  }

  $: fetchRows(searchTerm, primaryDisplay)

  const fetchRows = (searchTerm, primaryDisplay) => {
    const allRowsFetched =
      $fetch.loaded &&
      !Object.keys($fetch.query?.string || {}).length &&
      !$fetch.hasNextPage
    // Don't request until we have the primary display
    if (!allRowsFetched && primaryDisplay) {
      fetch.update({
        query: { string: { [primaryDisplay]: searchTerm } },
      })
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
      options={enrichedOptions}
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
      bind:searchTerm
      loading={$fetch.loading}
      bind:open
      customPopoverMaxHeight={400}
    />
  {/if}
</Field>
