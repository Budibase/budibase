<script>
  import { users } from "stores/portal"
  import { Constants } from "@budibase/frontend-core"

  export let row

  $: role = Constants.BudibaseRoleOptions.find(
    x => x.value === users.getUserRole(row)
  )
  $: value = role?.label || "Not available"
  $: tooltip = role?.subtitle || ""
</script>

<div on:click|stopPropagation title={tooltip}>
  {value}
</div>
