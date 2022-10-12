<script>
  import { Select } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import { tables as tablesStore } from "stores/backend"

  export let value

  const dispatch = createEventDispatcher()

  $: tables = $tablesStore.list.map(m => ({
    label: m.name,
    tableId: m._id,
    type: "table",
  }))

  const onChange = e => {
    const dataSource = tables?.find(x => x.tableId === e.detail)
    dispatch("change", dataSource)
  }
</script>

<Select
  on:change={onChange}
  value={value?.tableId}
  options={tables}
  getOptionValue={x => x.tableId}
  getOptionLabel={x => x.label}
/>
