<script>
  import { Select } from "@budibase/bbui"
  import { roles } from "stores/builder"

  export let value
  export let error
  export let placeholder = null
</script>

<Select
  bind:value
  on:change
  options={$roles}
  getOptionLabel={role => role.displayName}
  getOptionValue={role => role._id}
  getOptionColour={role => role.color}
  {placeholder}
  {error}
/>
