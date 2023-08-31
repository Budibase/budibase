<script>
  import {
    CoreSelect,
    CoreMultiselect,
    Input,
    ProgressCircle,
  } from "@budibase/bbui"
  import { fetchData, Utils } from "@budibase/frontend-core"
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
  let primaryDisplay
  let options
  let selectedOptions = []
  let isOpen = false

  let searchResults
  let searchString
  let searching = false
  let lastSearchString
  let lastSearchId
  let candidateIndex

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
  $: {
    options = searchResults ? searchResults : $fetch.rows
    // Append initially selected options if there is no filter and it does not already exist
    if (
      !filter?.filter(f => !!f.field)?.length &&
      !options?.some(option =>
        selectedOptions?.map(opt => opt._id).includes(option._id)
      )
    ) {
      options = [...options, ...selectedOptions]
    }
  }
  $: tableDefinition = $fetch.definition
  $: primaryDisplay = tableDefinition?.primaryDisplay || "_id"
  $: singleValue = flatten(fieldState?.value)?.[0]
  $: multiValue = flatten(fieldState?.value) ?? []
  $: component = multiselect ? CoreMultiselect : CoreSelect
  $: expandedDefaultValue = expand(defaultValue)
  $: debouncedSearch(searchString)
  $: {
    if (searching) {
      isOpen = true
    }
  }

  $: {
    if (
      primaryDisplay !== "_id" &&
      fieldState?.value?.length &&
      !selectedOptions?.length
    ) {
      API.searchTable({
        paginate: false,
        tableId: linkedTableId,
        limit: 100,
        query: {
          oneOf: {
            [`1:${primaryDisplay}`]: fieldState?.value?.map(
              value => value.primaryDisplay
            ),
          },
        },
      }).then(response => {
        selectedOptions = response.rows
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
    selectedOptions = value.map(val => ({
      _id: val,
      [`${primaryDisplay}`]: options.find(option => option._id === val)[
        `${primaryDisplay}`
      ],
    }))
    if (onChange && changed) {
      onChange({ value })
    }
  }

  // Search for rows based on the search string
  const search = async searchString => {
    // Reset state if this search is invalid
    if (!linkedTableId || !searchString) {
      lastSearchString = null
      candidateIndex = null
      searchResults = null
      return
    }

    // Search for results, using IDs to track invocations and ensure we're
    // handling the latest update
    lastSearchId = Math.random()
    searching = true
    const thisSearchId = lastSearchId
    const results = await API.searchTable({
      paginate: false,
      tableId: linkedTableId,
      limit: 100,
      query: {
        string: {
          [`1:${primaryDisplay}`]: searchString || "",
        },
      },
    })
    searching = false

    // In case searching takes longer than our debounced update, abandon these
    // results
    if (thisSearchId !== lastSearchId) {
      return
    }

    // Process results
    searchResults = results.rows?.map(row => ({
      ...row,
      primaryDisplay: row[primaryDisplay],
    }))
    candidateIndex = searchResults?.length ? 0 : null
    lastSearchString = searchString
  }

  // Debounced version of searching
  const debouncedSearch = Utils.debounce(search, 250)
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
    {#if autocomplete}
      <div class="search">
        <Input
          autofocus
          quiet
          type="text"
          bind:value={searchString}
          placeholder={primaryDisplay ? `Search by ${primaryDisplay}` : null}
        />
        {#if searching}
          <div class="searching">
            <ProgressCircle size="S" />
          </div>
        {/if}
      </div>
    {/if}
    <svelte:component
      this={component}
      bind:open={isOpen}
      {options}
      autocomplete={false}
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

<style>
  .search {
    flex: 0 0 calc(var(--default-row-height) - 1px);
    display: flex;
    align-items: center;
    margin: 4px var(--cell-padding);
    width: calc(100% - 2 * var(--cell-padding));
  }
  .search :global(.spectrum-Textfield) {
    min-width: 0;
    width: 100%;
  }
  .search :global(.spectrum-Textfield-input) {
    font-size: 13px;
  }
  .search :global(.spectrum-Form-item) {
    flex: 1 1 auto;
  }
</style>
