<script>
  import { createEventDispatcher } from "svelte"
  import { ActionButton, Button } from "@budibase/bbui"
  import FilterBuilder from "@/components/design/settings/controls/FilterEditor/FilterBuilder.svelte"
  import { getUserBindings } from "@/dataBinding"
  import { makePropSafe } from "@budibase/string-templates"
  import { search, Utils } from "@budibase/frontend-core"
  import { tables } from "@/stores/builder"
  import DetailPopover from "@/components/common/DetailPopover.svelte"

  export let schema
  export let filters
  export let disabled = false
  export let tableId

  const dispatch = createEventDispatcher()

  let popover

  $: localFilters = filters
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

  const openPopover = () => {
    localFilters = filters
    popover.show()
  }
</script>

<DetailPopover bind:this={popover} title="Configure filters" width={800}>
  <svelte:fragment slot="anchor" let:open>
    <ActionButton
      icon="Filter"
      quiet
      {disabled}
      on:click={openPopover}
      selected={open || filterCount > 0}
      accentColor="#004EA6"
    >
      {filterCount ? `Filter: ${filterCount}` : "Filter"}
    </ActionButton>
  </svelte:fragment>

  <FilterBuilder
    filters={localFilters}
    {schemaFields}
    datasource={{ type: "table", tableId }}
    on:change={e => (localFilters = e.detail)}
    {bindings}
  />
  <div>
    <Button
      cta
      slot="buttons"
      on:click={() => {
        dispatch("change", Utils.parseFilter(localFilters))
        popover.hide()
      }}
    >
      Save
    </Button>
  </div>
</DetailPopover>
