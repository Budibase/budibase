<script>
  import { tables } from "stores/backend"
  import { Select } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import { TableNames } from "constants"

  const dispatch = createEventDispatcher()

  export let value
  export let isTrigger

  $: filteredTables = $tables.list.filter(table => {
    return !isTrigger || table._id !== TableNames.USERS
  })

  const onChange = e => {
    value = e.detail
    dispatch("change", e.detail)
  }
</script>

<Select
  on:change={onChange}
  bind:value
  options={filteredTables}
  getOptionLabel={table => table.name}
  getOptionValue={table => table._id}
/>
