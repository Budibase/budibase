<script>
  import { DrawerContent } from "@budibase/bbui"
  import DrawerBindableInput from "components/common/bindings/DrawerBindableInput.svelte"
  import ClientBindingPanel from "components/common/bindings/ClientBindingPanel.svelte"

  import { FilterBuilder } from "@budibase/frontend-core"

  import { createEventDispatcher, onMount } from "svelte"

  export let schemaFields
  export let filters = []
  export let bindings = []
  export let panel = ClientBindingPanel
  export let allowBindings = true
  export let datasource

  const dispatch = createEventDispatcher()

  const KeyedFieldRegex = /\d[0-9]*:/g

  let rawFilters

  $: parseFilters(rawFilters)
  $: dispatch("change", enrichFilters(rawFilters))

  // Remove field key prefixes and determine which behaviours to use
  const parseFilters = filters => {
    rawFilters = (filters || []).map(filter => {
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
  const enrichFilters = rawFilters => {
    let count = 1
    return rawFilters
      .filter(filter => filter.field)
      .map(filter => ({
        ...filter,
        field: `${count++}:${filter.field}`,
      }))
      .concat(...rawFilters.filter(filter => !filter.field))
  }
</script>

<DrawerContent padding={false}>
  <FilterBuilder
    bind:filters={rawFilters}
    behaviourFilters={true}
    {schemaFields}
    {datasource}
    {allowBindings}
  >
    <div slot="filteringHeroContent" class="filteringHeroContent" />
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
