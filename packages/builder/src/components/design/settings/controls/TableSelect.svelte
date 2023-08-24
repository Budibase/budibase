<script>
  import { Select } from "@budibase/bbui"
  import { createEventDispatcher, onMount } from "svelte"
  import { tables as tablesStore } from "stores/backend"

  export let value

  const dispatch = createEventDispatcher()

  $: tables = $tablesStore.list.map(table => ({
    ...table,
    type: "table",
    label: table.name,
    key: table._id,
  }))
  $: views = $tablesStore.list.reduce(
    (acc, table) => [
      ...acc,
      ...Object.values(table.views || {})
        .filter(view => view.version === 2)
        .map(view => ({
          ...view,
          type: "viewV2",
          label: view.name,
          key: view.id,
        })),
    ],
    []
  )
  $: options = [...(tables || []), ...(views || [])]

  const onChange = e => {
    dispatch(
      "change",
      options.find(x => x.key === e.detail)
    )
  }

  onMount(() => {
    // Migrate old values before "key" existed
    if (value && !value.key) {
      const view = views.find(x => x.key === value.id)
      const table = tables.find(x => x.key === value._id)
      dispatch("change", view || table)
    }
  })
</script>

<Select
  on:change={onChange}
  value={value?.key}
  {options}
  getOptionValue={x => x.key}
  getOptionLabel={x => x.label}
/>
