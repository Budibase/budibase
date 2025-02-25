<script lang="ts">
  import { CoreSelect, CoreMultiselect } from "@budibase/bbui"
  import {
    FieldType,
    GroupUserDatasource,
    InternalTable,
    TableDatasource,
    UserDatasource,
  } from "@budibase/types"
  import { fetchData, Utils } from "@budibase/frontend-core"
  import { getContext } from "svelte"
  import Field from "./Field.svelte"
  import type {
    SearchFilter,
    RelationshipFieldMetadata,
    Row,
  } from "@budibase/types"
  import TableFetch from "@budibase/frontend-core/src/fetch/TableFetch"
  import UserFetch from "@budibase/frontend-core/src/fetch/UserFetch.js"
  import GroupUserFetch from "@budibase/frontend-core/src/fetch/GroupUserFetch.js"

  export let field: string | undefined = undefined
  export let label: string | undefined = undefined
  export let placeholder: any = undefined
  export let disabled: boolean = false
  export let readonly: boolean = false
  export let validation: any
  export let autocomplete: boolean = true
  export let defaultValue: string | string[] | undefined = undefined
  export let onChange: any
  export let filter: SearchFilter[]
  export let datasourceType: "table" | "user" | "groupUser" = "table"
  export let primaryDisplay: string | undefined = undefined
  export let span: number | undefined = undefined
  export let helpText: string | undefined = undefined
  export let type:
    | FieldType.LINK
    | FieldType.BB_REFERENCE
    | FieldType.BB_REFERENCE_SINGLE = FieldType.LINK

  type BasicRelatedRow = { _id: string; primaryDisplay: string }
  type OptionsMap = Record<string, BasicRelatedRow>

  const { API } = getContext("sdk")

  // Field state
  let fieldState: any
  let fieldApi: any
  let fieldSchema: RelationshipFieldMetadata | undefined

  // Local UI state
  let searchTerm: any
  let open: boolean = false

  // Options state
  let options: BasicRelatedRow[] = []
  let optionsMap: OptionsMap = {}
  let loadingMissingOptions: boolean = false

  // Determine if we can select multiple rows or not
  $: multiselect =
    [FieldType.LINK, FieldType.BB_REFERENCE].includes(type) &&
    fieldSchema?.relationshipType !== "one-to-many"

  // Get the proper string representation of the value
  $: realValue = fieldState?.value
  $: selectedValue = parseSelectedValue(realValue, multiselect)
  $: selectedIDs = getSelectedIDs(selectedValue)

  // If writable, we use a fetch to load options
  $: linkedTableId = fieldSchema?.tableId
  $: writable = !disabled && !readonly
  $: fetch = createFetch(writable, datasourceType, filter, linkedTableId)

  // Attempt to determine the primary display field to use
  $: tableDefinition = $fetch?.definition
  $: primaryDisplayField = primaryDisplay || tableDefinition?.primaryDisplay

  // Build our options map
  $: rows = $fetch?.rows || []
  $: processOptions(realValue, rows, primaryDisplayField)

  // If we ever have a value selected for which we don't have an option, we must
  // fetch those rows to ensure we can render them as options
  $: missingIDs = selectedIDs.filter(id => !optionsMap[id])
  $: loadMissingOptions(missingIDs, linkedTableId, primaryDisplayField)

  // Convert our options map into an array for display
  $: updateOptions(optionsMap)
  $: !open && sortOptions()

  // Search for new options when search term changes
  $: debouncedSearchOptions(searchTerm || "", primaryDisplayField)

  // Ensure backwards compatibility
  $: enrichedDefaultValue = enrichDefaultValue(defaultValue)

  // We need to cast value to pass it down, as those components aren't typed
  $: emptyValue = multiselect ? [] : null
  $: displayValue = missingIDs.length ? emptyValue : (selectedValue as any)

  // Ensures that we flatten any objects so that only the IDs of the selected
  // rows are passed down. Not sure how this can be an object to begin with?
  const parseSelectedValue = (
    value: any,
    multiselect: boolean
  ): undefined | string | string[] => {
    return multiselect ? flatten(value) : flatten(value)[0]
  }

  // Where applicable, creates the fetch instance to load row options
  const createFetch = (
    writable: boolean,
    dsType: typeof datasourceType,
    filter: SearchFilter[],
    linkedTableId?: string
  ): TableFetch | UserFetch | GroupUserFetch | undefined => {
    if (!linkedTableId) {
      return undefined
    }
    let datasource: TableDatasource | UserDatasource | GroupUserDatasource
    if (dsType === "table") {
      datasource = {
        type: "table",
        tableId: linkedTableId,
      }
    } else {
      datasource = {
        type: dsType,
        tableId: InternalTable.USER_METADATA,
      }
    }
    return fetchData({
      API,
      datasource,
      options: {
        filter,
        limit: writable ? 100 : 1,
      },
    })
  }

  // Small helper to represent the selected value as an array
  const getSelectedIDs = (
    selectedValue: undefined | string | string[]
  ): string[] => {
    if (!selectedValue) {
      return []
    }
    return Array.isArray(selectedValue) ? selectedValue : [selectedValue]
  }

  // Builds a map of all available options, in a consistent structure
  const processOptions = (
    realValue: any | any[],
    rows: Row[],
    primaryDisplay?: string
  ) => {
    // First ensure that all options included in the value are present as valid
    // options. These can be basic related row shapes which already include
    // a value for primary display
    if (realValue) {
      const valueArray = Array.isArray(realValue) ? realValue : [realValue]
      for (let val of valueArray) {
        const option = parseOption(val, primaryDisplay)
        if (option) {
          optionsMap[option._id] = option
        }
      }
    }

    // Process all rows loaded from our fetch
    for (let row of rows) {
      const option = parseOption(row, primaryDisplay)
      if (option) {
        optionsMap[option._id] = option
      }
    }

    // Reassign to trigger reactivity
    optionsMap = optionsMap
  }

  // Parses a row-like structure into a properly shaped option
  const parseOption = (
    option: any | BasicRelatedRow | Row,
    primaryDisplay?: string
  ): BasicRelatedRow | null => {
    if (!option || typeof option !== "object" || !option?._id) {
      return null
    }
    // If this is a basic related row shape (_id and PD only) then just use
    // that
    if (Object.keys(option).length === 2 && "primaryDisplay" in option) {
      return {
        _id: option._id,
        primaryDisplay: ensureString(option.primaryDisplay),
      }
    }
    // Otherwise use the primary display field specified
    if (primaryDisplay) {
      return {
        _id: option._id,
        primaryDisplay: ensureString(
          option[primaryDisplay as keyof typeof option]
        ),
      }
    } else {
      return {
        _id: option._id,
        primaryDisplay: option._id,
      }
    }
  }

  // Loads any rows which are selected and aren't present in the currently
  // available option set. This is typically only IDs specified as default
  // values.
  const loadMissingOptions = async (
    missingIDs: string[],
    linkedTableId?: string,
    primaryDisplay?: string
  ) => {
    if (
      loadingMissingOptions ||
      !missingIDs.length ||
      !linkedTableId ||
      !primaryDisplay
    ) {
      return
    }
    loadingMissingOptions = true
    try {
      const res = await API.searchTable(linkedTableId, {
        query: {
          oneOf: {
            _id: missingIDs,
          },
        },
      })
      for (let row of res.rows) {
        const option = parseOption(row, primaryDisplay)
        if (option) {
          optionsMap[option._id] = option
        }
      }

      // Reassign to trigger reactivity
      optionsMap = optionsMap
      updateOptions(optionsMap)
    } catch (error) {
      console.error("Error loading missing row IDs", error)
    } finally {
      // Ensure we have some sort of option for all IDs
      for (let id of missingIDs) {
        if (!optionsMap[id]) {
          optionsMap[id] = {
            _id: id,
            primaryDisplay: id,
          }
        }
      }
      loadingMissingOptions = false
    }
  }

  // Updates the options list to reflect the currently available options
  const updateOptions = (optionsMap: OptionsMap) => {
    let newOptions = Object.values(optionsMap)

    // Only override options if the quantity of options changes
    if (newOptions.length !== options.length) {
      options = newOptions
      sortOptions()
    }
  }

  // Sorts the options list by selected state, then by primary display
  const sortOptions = () => {
    // Create a quick lookup map so we can test whether options are selected
    const selectedMap: Record<string, boolean> = selectedIDs.reduce(
      (map, id) => ({ ...map, [id]: true }),
      {}
    )
    options.sort((a, b) => {
      const aSelected = !!selectedMap[a._id]
      const bSelected = !!selectedMap[b._id]
      if (aSelected === bSelected) {
        return a.primaryDisplay < b.primaryDisplay ? -1 : 1
      } else {
        return aSelected ? -1 : 1
      }
    })
  }

  // Util to ensure a value is stringified
  const ensureString = (val: any): string => {
    return typeof val === "string" ? val : JSON.stringify(val)
  }

  // We previously included logic to manually process default value, which
  // should not be done as it is handled by the core form logic.
  // This logic included handling a comma separated list of IDs, so for
  // backwards compatibility we must now unfortunately continue to handle that
  // at this level.
  const enrichDefaultValue = (val: any) => {
    if (!val || typeof val !== "string") {
      return val
    }
    return val.includes(",") ? val.split(",") : val
  }

  // Searches for new options matching the given term
  async function searchOptions(searchTerm: string, primaryDisplay?: string) {
    if (!primaryDisplay) {
      return
    }

    // Ensure we match all filters, rather than any
    let newFilter: any = filter
    if (searchTerm) {
      // @ts-expect-error this doesn't fit types, but don't want to change it yet
      newFilter = (newFilter || []).filter(x => x.operator !== "allOr")
      newFilter.push({
        // Use a big numeric prefix to avoid clashing with an existing filter
        field: `999:${primaryDisplay}`,
        operator: "string",
        value: searchTerm,
      })
    }
    await fetch?.update({
      filter: newFilter,
    })
  }
  const debouncedSearchOptions = Utils.debounce(searchOptions, 250)

  // Flattens an array of row-like objects into a simple array of row IDs
  const flatten = (values: any | any[]): string[] => {
    if (!values) {
      return []
    }
    if (!Array.isArray(values)) {
      values = [values]
    }
    values = values.map((value: any) =>
      typeof value === "object" ? value._id : value
    )
    return values
  }

  const handleChange = (e: any) => {
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
</script>

<Field
  {label}
  {field}
  {disabled}
  {readonly}
  {validation}
  {type}
  {span}
  {helpText}
  defaultValue={enrichedDefaultValue}
  bind:fieldState
  bind:fieldApi
  bind:fieldSchema
>
  {#if fieldState}
    <svelte:component
      this={multiselect ? CoreMultiselect : CoreSelect}
      value={displayValue}
      id={fieldState?.fieldId}
      disabled={fieldState?.disabled}
      readonly={fieldState?.readonly}
      loading={!!$fetch?.loading}
      getOptionLabel={option => option.primaryDisplay}
      getOptionValue={option => option._id}
      {options}
      {placeholder}
      {autocomplete}
      bind:searchTerm
      bind:open
      on:change={handleChange}
      on:loadMore={() => fetch?.nextPage()}
    />
  {/if}
</Field>
