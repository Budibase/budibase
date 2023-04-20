<script>
  import { roles } from "stores/backend"
  import { _ } from "../../../../../lang/i18n"

  export let value

  $: role = $roles.find(role => role._id === value)
  $: roleName =
    role?.name ?? $_("components.backend.DataTable.cells.RoleCell.Unknown_role")
</script>

{roleName}
