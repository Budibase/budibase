<script>
  import { StatusLight } from "@budibase/bbui"
  import { RoleUtils } from "@budibase/frontend-core"
  import { roles } from "stores/backend"

  export let value

  const getRoleLabel = roleId => {
    const role = $roles.find(x => x._id === roleId)
    return role?.name || "Custom role"
  }
</script>

<StatusLight square color={RoleUtils.getRoleColour(value)}>
  {getRoleLabel(value)}
</StatusLight>
