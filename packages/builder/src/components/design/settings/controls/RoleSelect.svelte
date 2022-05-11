<script>
  import { Select } from "@budibase/bbui"
  import { roles } from "stores/backend"
  import { RoleUtils } from "@budibase/frontend-core"

  export let value
  export let error
</script>

<Select
  bind:value
  on:change
  options={$roles}
  placeholder={null}
  getOptionLabel={role => role.name}
  getOptionValue={role => role._id}
  getOptionColour={role => RoleUtils.getRoleColour(role._id)}
  {error}
/>
