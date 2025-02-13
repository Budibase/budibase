<script lang="ts">
  import { CoreSelect, CoreMultiselect } from "@budibase/bbui"
  import { FieldType } from "@budibase/types"
  import { fetchData, Utils } from "@budibase/frontend-core"
  import { getContext } from "svelte"
  import Field from "./Field.svelte"

  const { API } = getContext("sdk")

  export let field: string | undefined = undefined
  export let label: string | undefined = undefined
  export let placeholder: string | undefined = undefined
  export let disabled: boolean = false
  export let readonly: boolean = false
  export let validation: any
  export let autocomplete: boolean = true
  export let defaultValue: string | undefined = undefined
  export let onChange: any
  export let filter:
  export let datasourceType: string = "table"
  export let primaryDisplay: string | undefined = undefined
  export let span: string | undefined = undefined
  export let helpText: string | undefined = undefined
  export let type: FieldType.LINK | FieldType.BB_REFERENCE = FieldType.LINK

  let fieldState
  let fieldApi
  let fieldSchema
  let tableDefinition
  let searchTerm
  let open

  $: multiselect =
    [FieldType.LINK, FieldType.BB_REFERENCE].includes(type) &&
    fieldSchema?.relationshipType !== "one-to-many"
  $: linkedTableId = fieldSchema?.tableId
  $: fetch = fetchData({
    API,
    datasource: {
      type: datasourceType,
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
  $: primaryDisplay = primaryDisplay || tableDefinition?.primaryDisplay

  let optionsObj
  const debouncedFetchRows = Utils.debounce(fetchRows, 250)

  $: {
    if (primaryDisplay && fieldState && !optionsObj) {
      // Persist the initial values as options, allowing them to be present in the dropdown,
      // even if they are not in the inital fetch results
      let valueAsSafeArray = fieldState.value || []
      if (!Array.isArray(valueAsSafeArray)) {
        valueAsSafeArray = [fieldState.value]
      }
      optionsObj = valueAsSafeArray.reduce((accumulator, value) => {
        // fieldState has to be an array of strings to be valid for an update
        // therefore we cannot guarantee value will be an object
        // https://linear.app/budibase/issue/BUDI-7577/refactor-the-relationshipfield-component-to-have-better-support-for
        if (!value._id) {
          return accumulator
        }
        accumulator[value._id] = {
          _id: value._id,
          [primaryDisplay]: value.primaryDisplay,
        }
        return accumulator
      }, {})
    }
  }

  $: enrichedOptions = enrichOptions(optionsObj, $fetch.rows)
  const enrichOptions = (optionsObj, fetchResults) => {
    const result = (fetchResults || [])?.reduce((accumulator, row) => {
      if (!accumulator[row._id]) {
        accumulator[row._id] = row
      }
      return accumulator
    }, optionsObj || {})

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

  $: forceFetchRows(filter, defaultValue)
  $: debouncedFetchRows(searchTerm, primaryDisplay, defaultValue)

  const forceFetchRows = async () => {
    // if the filter has changed, then we need to reset the options, clear the selection, and re-fetch
    optionsObj = {}
    fieldApi?.setValue([])
    selectedValue = []
    debouncedFetchRows(searchTerm, primaryDisplay, defaultValue)
  }
  async function fetchRows(searchTerm, primaryDisplay, defaultVal) {
    const allRowsFetched =
      $fetch.loaded &&
      !Object.keys($fetch.query?.string || {}).length &&
      !$fetch.hasNextPage
    // Don't request until we have the primary display or default value has been fetched
    if (allRowsFetched || !primaryDisplay) {
      return
    }
    // must be an array
    if (defaultVal && !Array.isArray(defaultVal)) {
      defaultVal = defaultVal.split(",")
    }

    const fetchMissing = (missingIds: string[])

    if (defaultVal && optionsObj && defaultVal.some(val => !optionsObj[val])) {
      await fetch.update({
        query: { oneOf: { _id: defaultVal } },
      })
    }

    // Ensure we match all filters, rather than any
    const baseFilter = (filter || []).filter(x => x.operator !== "allOr")
    await fetch.update({
      filter: [
        ...baseFilter,
        {
          // Use a big numeric prefix to avoid clashing with an existing filter
          field: `999:${primaryDisplay}`,
          operator: "string",
          value: searchTerm,
        },
      ],
    })
  }

  const flatten = values => {
    if (!values) {
      return []
    }

    if (!Array.isArray(values)) {
      values = [values]
    }
    values = values.map(value =>
      typeof value === "object" ? value._id : value
    )
    return values
  }

  const getDisplayName = row => {
    return row?.[primaryDisplay] || "-"
  }

  const handleChange = e => {
    let value = e.detail
    if (!multiselect) {
      value = value == null ? [] : [value]
    }

    if (
      type === FieldType.BB_REFERENCE_SINGLE &&
      value &&
      Array.isArray(value)
    ) {
      value = value[0] || null
    }

    const changed = fieldApi.setValue(value)
    if (onChange && changed) {
      onChange({
        value,
      })
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
  {readonly}
  {validation}
  {defaultValue}
  {type}
  {span}
  {helpText}
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
      on:change={handleChange}
      on:loadMore={loadMore}
      id={fieldState.fieldId}
      disabled={fieldState.disabled}
      readonly={fieldState.readonly}
      error={fieldState.error}
      getOptionLabel={getDisplayName}
      getOptionValue={option => option._id}
      {placeholder}
      bind:searchTerm
      loading={$fetch.loading}
      bind:open
    />
  {/if}
</Field>
