<script>
  import { Select } from "@budibase/bbui"
  import { roles } from "stores/backend"

  export let value
</script>

<Select
  bind:value
  on:change
  options={$roles}
  getOptionLabel={role => role.name}
  getOptionValue={role => role._id}
/>
