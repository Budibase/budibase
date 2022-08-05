<script>
  import { Select } from "@budibase/bbui"
  import { roles } from "stores/backend"
  import { Constants, RoleUtils } from "@budibase/frontend-core"

  export let value
  export let error
  export let placeholder = null
  export let autoWidth = false
  export let quiet = false
  export let allowPublic = true

  $: options = getOptions($roles, allowPublic)

  const getOptions = (roles, allowPublic) => {
    if (allowPublic) {
      return roles
    }
    return roles.filter(role => role._id !== Constants.Roles.PUBLIC)
  }
</script>

<Select
  {autoWidth}
  {quiet}
  bind:value
  on:change
  {options}
  getOptionLabel={role => role.name}
  getOptionValue={role => role._id}
  getOptionColour={role => RoleUtils.getRoleColour(role._id)}
  {placeholder}
  {error}
/>
