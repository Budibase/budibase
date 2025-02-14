<script lang="ts">
  import { CoreSelect, CoreMultiselect } from "@budibase/bbui"
  import { FieldType } from "@budibase/types"
  import { fetchData, Utils } from "@budibase/frontend-core"
  import { getContext } from "svelte"
  import Field from "./Field.svelte"
  import type {
    SearchFilter,
    RelationshipFieldMetadata,
    Table,
    Row,
  } from "@budibase/types"

  const { API } = getContext("sdk")

  export let field: string | undefined = undefined
  export let label: string | undefined = undefined
  export let placeholder: any = undefined
  export let disabled: boolean = false
  export let readonly: boolean = false
  export let validation: any
  export let autocomplete: boolean = true
  export let defaultValue: string | undefined = undefined
  export let onChange: any
  export let filter: SearchFilter[]
  // not really obvious how to type this - some components pass other things here
  // but it looks like the component data fetch should only work with tables
  export let datasourceType: "table" = "table"
  export let primaryDisplay: string | undefined = undefined
  export let span: number | undefined = undefined
  export let helpText: string | undefined = undefined
  export let type:
    | FieldType.LINK
    | FieldType.BB_REFERENCE
    | FieldType.BB_REFERENCE_SINGLE = FieldType.LINK

  type RelationshipValue = { _id: string; [key: string]: any }
  type OptionObj = Record<string, RelationshipValue>
  type OptionsObjType = Record<string, OptionObj>

  let fieldState: any
  let fieldApi: any
  let fieldSchema: RelationshipFieldMetadata | undefined
  let tableDefinition: Table | null | undefined
  let searchTerm: any
  let open: boolean
  let selectedValue: string[] | string

  $: multiselect =
    [FieldType.LINK, FieldType.BB_REFERENCE].includes(type) &&
    fieldSchema?.relationshipType !== "one-to-many"
  $: linkedTableId = fieldSchema?.tableId!
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

  let optionsObj: OptionsObjType = {}
  const debouncedFetchRows = Utils.debounce(fetchRows, 250)

  $: {
    if (primaryDisplay && fieldState && !optionsObj) {
      // Persist the initial values as options, allowing them to be present in the dropdown,
      // even if they are not in the inital fetch results
      let valueAsSafeArray = fieldState.value || []
      if (!Array.isArray(valueAsSafeArray)) {
        valueAsSafeArray = [fieldState.value]
      }
      optionsObj = valueAsSafeArray.reduce(
        (
          accumulator: OptionObj,
          value: { _id: string; primaryDisplay: any }
        ) => {
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
        },
        {}
      )
    }
  }

  $: enrichedOptions = enrichOptions(optionsObj, $fetch.rows)
  const enrichOptions = (optionsObj: OptionsObjType, fetchResults: Row[]) => {
    const result = (fetchResults || [])?.reduce((accumulator, row) => {
      if (!accumulator[row._id!]) {
        accumulator[row._id!] = row
      }
      return accumulator
    }, optionsObj || {})

    return Object.values(result)
  }
  $: {
    // We don't want to reorder while the dropdown is open, to avoid UX jumps
    if (!open && primaryDisplay) {
      enrichedOptions = enrichedOptions.sort((a: OptionObj, b: OptionObj) => {
        const selectedValues = flatten(fieldState?.value) || []

        const aIsSelected = selectedValues.find(
          (v: RelationshipValue) => v === a._id
        )
        const bIsSelected = selectedValues.find(
          (v: RelationshipValue) => v === b._id
        )
        if (aIsSelected && !bIsSelected) {
          return -1
        } else if (!aIsSelected && bIsSelected) {
          return 1
        }

        return (a[primaryDisplay] > b[primaryDisplay]) as unknown as number
      })
    }
  }

  $: {
    if (filter || defaultValue) {
      forceFetchRows()
    }
  }
  $: debouncedFetchRows(searchTerm, primaryDisplay, defaultValue)

  const forceFetchRows = async () => {
    // if the filter has changed, then we need to reset the options, clear the selection, and re-fetch
    optionsObj = {}
    fieldApi?.setValue([])
    selectedValue = []
    debouncedFetchRows(searchTerm, primaryDisplay, defaultValue)
  }
  async function fetchRows(
    searchTerm: any,
    primaryDisplay: string,
    defaultVal: string | string[]
  ) {
    const allRowsFetched =
      $fetch.loaded &&
      !Object.keys($fetch.query?.string || {}).length &&
      !$fetch.hasNextPage
    // Don't request until we have the primary display or default value has been fetched
    if (allRowsFetched || !primaryDisplay) {
      return
    }
    // must be an array
    const defaultValArray: string[] = !defaultVal
      ? []
      : !Array.isArray(defaultVal)
      ? defaultVal.split(",")
      : defaultVal

    if (
      defaultVal &&
      optionsObj &&
      defaultValArray.some(val => !optionsObj[val])
    ) {
      await fetch.update({
        query: { oneOf: { _id: defaultValArray } },
      })
    }

    if (
      (Array.isArray(selectedValue) &&
        selectedValue.some(val => !optionsObj[val])) ||
      (selectedValue && !optionsObj[selectedValue as string])
    ) {
      await fetch.update({
        query: {
          oneOf: {
            _id: Array.isArray(selectedValue) ? selectedValue : [selectedValue],
          },
        },
      })
    }

    // Ensure we match all filters, rather than any
    // @ts-expect-error this doesn't fit types, but don't want to change it yet
    const baseFilter: any = (filter || []).filter(x => x.operator !== "allOr")
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

  const flatten = (values: any | any[]) => {
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

  const getDisplayName = (row: Row) => {
    return row?.[primaryDisplay!] || "-"
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

  const loadMore = () => {
    if (!$fetch.loading) {
      fetch.nextPage()
    }
  }

  const componentValue = () => {
    return selectedValue as any
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
      value={componentValue()}
      on:change={handleChange}
      on:loadMore={loadMore}
      id={fieldState.fieldId}
      disabled={fieldState.disabled}
      readonly={fieldState.readonly}
      getOptionLabel={getDisplayName}
      getOptionValue={option => option._id}
      {placeholder}
      bind:searchTerm
      loading={$fetch.loading}
      bind:open
    />
  {/if}
</Field>
