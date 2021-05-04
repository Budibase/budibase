<script>
  import { tables } from "stores/backend"
  import { Select } from "@budibase/bbui"

  export let value
</script>

<Select
  bind:value
  options={$tables.list}
<<<<<<< HEAD
  getOptionLabel={(table) => table.name}
  getOptionValue={(table) => table._id}
=======
  getOptionLabel={table => table.name}
  getOptionValue={table => table._id}
>>>>>>> 900637c221e4034babd21d69dcaa71b360a2adb2
/>
