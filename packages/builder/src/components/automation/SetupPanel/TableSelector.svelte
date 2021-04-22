<script>
  import { tables } from "stores/backend"
  import { Select } from "@budibase/bbui"

  export let value
</script>

<Select
  bind:value
  options={$tables.list}
  getOptionLabel={table => table.name}
  getOptionValue={table => table._id} />
