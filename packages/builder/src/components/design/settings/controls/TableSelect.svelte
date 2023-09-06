<script>
  import { Select } from "@budibase/bbui"
  import { createEventDispatcher, onMount } from "svelte"
  import { tables as tablesStore, viewsV2 } from "stores/backend"

  export let value

  const dispatch = createEventDispatcher()

  $: tables = $tablesStore.list.map(table => ({
    type: "table",
    label: table.name,
    tableId: table._id,
    resourceId: table._id,
  }))
  $: views = $viewsV2.list.map(view => ({
    type: "viewV2",
    id: view.id,
    label: view.name,
    tableId: view.tableId,
    resourceId: view.id,
  }))
  $: options = [...(tables || []), ...(views || [])]

  const onChange = e => {
    dispatch(
      "change",
      options.find(x => x.resourceId === e.detail)
    )
  }

  onMount(() => {
    // Migrate old values before "resourceId" existed
    if (value && !value.resourceId) {
      const view = views.find(x => x.resourceId === value.id)
      const table = tables.find(x => x.resourceId === value.tableId)
      dispatch("change", view || table)
    }
  })
</script>

<Select
  on:change={onChange}
  value={value?.resourceId}
  {options}
  getOptionValue={x => x.resourceId}
  getOptionLabel={x => x.label}
/>
