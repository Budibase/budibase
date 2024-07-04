<script>
import { Select } from "@budibase/bbui"
import { RoleUtils } from "@budibase/frontend-core"
import { roles } from "stores/builder"

export let value
export let error
export let placeholder = null
</script>

<Select
  bind:value
  on:change
  options={$roles}
  getOptionLabel={role => role.name}
  getOptionValue={role => role._id}
  getOptionColour={role => RoleUtils.getRoleColour(role._id)}
  {placeholder}
  {error}
/>
