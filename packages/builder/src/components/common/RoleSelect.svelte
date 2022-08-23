<script>
  import { Select } from "@budibase/bbui"
  import { roles } from "stores/backend"
  import { RoleUtils } from "@budibase/frontend-core"

  export let value
  export let error
  export let placeholder = null
  export let autoWidth = false
  export let quiet = false
</script>

<Select
  {autoWidth}
  {quiet}
  bind:value
  on:change
  options={$roles}
  getOptionLabel={role => role.name}
  getOptionValue={role => role._id}
  getOptionColour={role => RoleUtils.getRoleColour(role._id)}
  {placeholder}
  {error}
/>
