<script>
  import { StatusLight } from "@budibase/bbui"
  import { RoleUtils } from "@budibase/frontend-core"
  import { roles } from "stores/backend"

  import { _ } from "../../../../../../../lang/i18n"

  export let value

  const getRoleLabel = roleId => {
    const role = $roles.find(x => x._id === roleId)
    return (
      role?.name ||
      $_("pages.builder.portal.users.users._components.AppRoleRenderer.Custom")
    )
  }
</script>

<StatusLight square color={RoleUtils.getRoleColour(value)}>
  {getRoleLabel(value)}
</StatusLight>
