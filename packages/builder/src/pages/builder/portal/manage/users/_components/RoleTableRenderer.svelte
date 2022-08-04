<script>
  import { users } from "stores/portal"
  import { Constants } from "@budibase/frontend-core"

  export let row

  const TooltipMap = {
    appUser: "Only has access to published apps",
    developer: "Access to the app builder",
    admin: "Full access",
  }

  $: role = Constants.BudibaseRoleOptions.find(
    x => x.value === users.getUserRole(row)
  )
  $: value = role?.label || "Not available"
  $: tooltip = TooltipMap[role?.value] || ""
</script>

<div on:click|stopPropagation title={tooltip}>
  {value}
</div>
