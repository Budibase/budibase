<script>
  import { users } from "stores/portal"
  import { Constants } from "@budibase/frontend-core"

  import { _ } from "../../../../../../../lang/i18n"

  export let row

  const TooltipMap = {
    appUser: $_(
      "pages.builder.portal.users.users._components.RoleTableRenderer.has_access"
    ),
    developer: $_(
      "pages.builder.portal.users.users._components.RoleTableRenderer.Access_app"
    ),
    admin: $_(
      "pages.builder.portal.users.users._components.RoleTableRenderer.Full_access"
    ),
  }

  $: role = Constants.BudibaseRoleOptions.find(
    x => x.value === users.getUserRole(row)
  )
  $: value =
    role?.label ||
    $_(
      "pages.builder.portal.users.users._components.RoleTableRenderer.Not_available"
    )
  $: tooltip = TooltipMap[role?.value] || ""
</script>

<div on:click|stopPropagation title={tooltip}>
  {value}
</div>
