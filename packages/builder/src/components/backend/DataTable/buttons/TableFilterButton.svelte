<script>
  import { createEventDispatcher } from "svelte"
  import { ActionButton, Drawer, DrawerContent, Button } from "@budibase/bbui"
  import FilterBuilder from "components/design/settings/controls/FilterEditor/FilterBuilder.svelte"
  import { getUserBindings } from "dataBinding"
  import { makePropSafe } from "@budibase/string-templates"
  import { search } from "@budibase/frontend-core"
  import { utils } from "@budibase/shared-core"
  import { tables } from "stores/builder"

  export let schema
  export let filters
  export let disabled = false
  export let tableId

  const dispatch = createEventDispatcher()

  let drawer

  $: localFilters = utils.processSearchFilters(filters)

  $: schemaFields = search.getFields(
    $tables.list,
    Object.values(schema || {}),
    { allowLinks: true }
  )

  $: filterCount =
    localFilters?.groups?.reduce((acc, group) => {
      return (acc += group.filters.filter(filter => filter.field).length)
    }, 0) || 0

  $: bindings = [
    {
      type: "context",
      runtimeBinding: `${makePropSafe("now")}`,
      readableBinding: `Date`,
      category: "Date",
      icon: "Date",
      display: {
        name: "Server date",
      },
    },
    ...getUserBindings(),
  ]
</script>

<ActionButton
  icon="Filter"
  quiet
  {disabled}
  on:click={drawer.show}
  selected={filterCount > 0}
  accentColor="#004EA6"
>
  {filterCount ? `Filter: ${filterCount}` : "Filter"}
</ActionButton>

<Drawer
  bind:this={drawer}
  title="Filtering"
  on:drawerHide
  on:drawerShow={() => {
    localFilters = utils.processSearchFilters(filters)
  }}
  forceModal
>
  <Button
    cta
    slot="buttons"
    on:click={() => {
      dispatch("change", localFilters)
      drawer.hide()
    }}
  >
    Save
  </Button>
  <DrawerContent slot="body">
    <FilterBuilder
      filters={localFilters}
      {schemaFields}
      datasource={{ type: "table", tableId }}
      on:change={e => (localFilters = e.detail)}
      {bindings}
    />
  </DrawerContent>
</Drawer>
