<script>
  import { notifications, ActionButton, Button, Drawer } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import {
    getDatasourceForProvider,
    getSchemaForDatasource,
  } from "builderStore/dataBinding"
  import FilterDrawer from "./FilterDrawer.svelte"
  import { currentAsset } from "builderStore"

  const QUERY_START_REGEX = /\d[0-9]*:/g
  const dispatch = createEventDispatcher()

  export let value = []
  export let componentInstance
  export let bindings = []

  let drawer,
    toSaveFilters = null,
    allOr,
    initialAllOr

  $: initialFilters = correctFilters(value || [])
  $: dataSource = getDatasourceForProvider($currentAsset, componentInstance)
  $: schema = getSchemaForDatasource($currentAsset, dataSource)?.schema
  $: schemaFields = Object.values(schema || {})

  function addNumbering(filters) {
    let count = 1
    for (let value of filters) {
      if (value.field && value.field?.match(QUERY_START_REGEX) == null) {
        value.field = `${count++}:${value.field}`
      }
    }
    return filters
  }

  function correctFilters(filters) {
    const corrected = []
    for (let filter of filters) {
      let field = filter.field
      if (filter.operator === "allOr") {
        initialAllOr = allOr = true
        continue
      }
      if (
        typeof filter.field === "string" &&
        filter.field.match(QUERY_START_REGEX) != null
      ) {
        const parts = field.split(":")
        const number = parts[0]
        // it's the new format, remove number
        if (!isNaN(parseInt(number))) {
          parts.shift()
          field = parts.join(":")
        }
      }
      corrected.push({
        ...filter,
        field,
      })
    }
    return corrected
  }

  async function saveFilter() {
    if (!toSaveFilters && allOr !== initialAllOr) {
      toSaveFilters = initialFilters
    }
    const filters = toSaveFilters?.filter(filter => filter.operator !== "allOr")
    if (allOr && filters) {
      filters.push({ operator: "allOr" })
    }
    // only save if anything was updated
    if (filters) {
      dispatch("change", addNumbering(filters))
    }
    notifications.success("Filters saved.")
    drawer.hide()
  }
</script>

<ActionButton on:click={drawer.show}>Define filters</ActionButton>
<Drawer bind:this={drawer} title="Filtering">
  <Button cta slot="buttons" on:click={saveFilter}>Save</Button>
  <FilterDrawer
    slot="body"
    filters={initialFilters}
    {bindings}
    {schemaFields}
    bind:allOr
    on:change={event => {
      toSaveFilters = event.detail
    }}
  />
</Drawer>
