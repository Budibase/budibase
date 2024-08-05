<script>
  import { RoleUtils } from "@budibase/frontend-core"
  import { StatusLight } from "@budibase/bbui"

  export let id
  export let size = "M"
  export let disabled = false

  $: color = RoleUtils.getRoleColour(id)
</script>

<StatusLight square {disabled} {size} {color} />
