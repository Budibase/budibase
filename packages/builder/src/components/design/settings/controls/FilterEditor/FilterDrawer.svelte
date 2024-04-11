<script>
  import { DrawerContent, Select } from "@budibase/bbui"
  import DrawerBindableInput from "components/common/bindings/DrawerBindableInput.svelte"
  import ClientBindingPanel from "components/common/bindings/ClientBindingPanel.svelte"

  import { FilterBuilder } from "@budibase/frontend-core"

  import { createEventDispatcher, onMount } from "svelte"
  // import FilterUsers from "./FilterUsers.svelte"

  export let schemaFields
  export let filters = []
  export let bindings = []
  export let panel = ClientBindingPanel
  export let allowBindings = true
  export let datasource

  const dispatch = createEventDispatcher()

  const KeyedFieldRegex = /\d[0-9]*:/g
  const behaviourOptions = [
    { value: "and", label: "Match all filters" },
    { value: "or", label: "Match any filter" },
  ]
  const onEmptyOptions = [
    { value: "all", label: "Return all table rows" },
    { value: "none", label: "Return no rows" },
  ]

  let rawFilters
  let matchAny = false
  let onEmptyFilter = "all"

  $: parseFilters(filters)
  $: dispatch("change", enrichFilters(rawFilters, matchAny, onEmptyFilter))

  // Remove field key prefixes and determine which behaviours to use
  const parseFilters = filters => {
    matchAny = filters?.find(filter => filter.operator === "allOr") != null
    onEmptyFilter =
      filters?.find(filter => filter.onEmptyFilter)?.onEmptyFilter ?? "all"
    rawFilters = (filters || [])
      .filter(filter => filter.operator !== "allOr" && !filter.onEmptyFilter)
      .map(filter => {
        const { field } = filter
        let newFilter = { ...filter }
        delete newFilter.allOr
        if (typeof field === "string" && field.match(KeyedFieldRegex) != null) {
          const parts = field.split(":")
          parts.shift()
          newFilter.field = parts.join(":")
        }
        return newFilter
      })
  }

  onMount(() => {
    parseFilters(filters)
    rawFilters.forEach(filter => {
      filter.type =
        schemaFields.find(field => field.name === filter.field)?.type ||
        filter.type
    })
  })

  // Add field key prefixes and a special metadata filter object to indicate
  // how to handle filter behaviour
  const enrichFilters = (rawFilters, matchAny, onEmptyFilter) => {
    let count = 1
    return rawFilters
      .filter(filter => filter.field)
      .map(filter => ({
        ...filter,
        field: `${count++}:${filter.field}`,
      }))
      .concat(matchAny ? [{ operator: "allOr" }] : [])
      .concat([{ onEmptyFilter }])
  }
</script>

<DrawerContent padding={false}>
  <FilterBuilder bind:filters {schemaFields} {datasource} {allowBindings}>
    <div slot="filteringHeroContent" class="filteringHeroContent">
      <Select
        label="Behaviour"
        value={matchAny ? "or" : "and"}
        options={behaviourOptions}
        getOptionLabel={opt => opt.label}
        getOptionValue={opt => opt.value}
        on:change={e => (matchAny = e.detail === "or")}
        placeholder={null}
      />
      {#if datasource?.type === "table"}
        <Select
          label="When filter empty"
          value={onEmptyFilter}
          options={onEmptyOptions}
          getOptionLabel={opt => opt.label}
          getOptionValue={opt => opt.value}
          on:change={e => (onEmptyFilter = e.detail)}
          placeholder={null}
        />
      {/if}
    </div>
    <div slot="binding" let:filter>
      <DrawerBindableInput
        disabled={filter.noValue}
        title={filter.field}
        value={filter.value}
        placeholder="Value"
        {panel}
        {bindings}
        on:change={event => (filter.value = event.detail)}
      />
    </div>
  </FilterBuilder>
</DrawerContent>

<style>
  .filteringHeroContent {
    display: grid;
    column-gap: var(--spacing-l);
    row-gap: var(--spacing-s);
    align-items: center;
    grid-template-columns: minmax(150px, 1fr) 170px 120px minmax(150px, 1fr) 16px 16px;
  }
</style>
