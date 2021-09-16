<script>
  import { tables } from "stores/backend"
  import { Select } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"

  const dispatch = createEventDispatcher()

  export let value

  const onChange = e => {
    value = e.detail
    dispatch("change", e.detail)
  }
</script>

<Select
  on:change={onChange}
  bind:value
  options={$tables.list}
  getOptionLabel={table => table.name}
  getOptionValue={table => table._id}
/>
