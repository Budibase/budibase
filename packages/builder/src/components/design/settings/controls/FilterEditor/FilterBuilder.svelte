<script>
  import DrawerBindableInput from "components/common/bindings/DrawerBindableInput.svelte"
  import ClientBindingPanel from "components/common/bindings/ClientBindingPanel.svelte"

  import { dataFilters } from "@budibase/shared-core"
  import { FilterBuilder } from "@budibase/frontend-core"
  import { tables } from "stores/builder"

  import { createEventDispatcher, onMount } from "svelte"

  export let schemaFields
  export let filters = []
  export let bindings = []
  export let panel = ClientBindingPanel
  export let allowBindings = true
  export let datasource

  const dispatch = createEventDispatcher()

  let rawFilters

  $: parseFilters(rawFilters)
  $: dispatch("change", enrichFilters(rawFilters))

  // Remove field key prefixes and determine which behaviours to use
  const parseFilters = filters => {
    rawFilters = (filters || []).map(filter => {
      const { field } = filter
      let newFilter = { ...filter }
      delete newFilter.allOr
      newFilter.field = dataFilters.removeKeyNumbering(field)
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

<FilterBuilder
  bind:filters={rawFilters}
  behaviourFilters={true}
  tables={$tables.list}
  {schemaFields}
  {datasource}
  {allowBindings}
>
  <div slot="filtering-hero-content" />

  <DrawerBindableInput
    let:filter
    slot="binding"
    disabled={filter.noValue}
    title={filter.field}
    value={filter.value}
    placeholder="Value"
    {panel}
    {bindings}
    on:change={event => {
      const indexToUpdate = rawFilters.findIndex(f => f.id === filter.id)
      rawFilters[indexToUpdate] = {
        ...rawFilters[indexToUpdate],
        value: event.detail,
      }
    }}
  />
</FilterBuilder>
