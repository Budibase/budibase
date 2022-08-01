<script>
  import { users } from "stores/portal"
  import { Constants } from "@budibase/frontend-core"

  export let row
  $: value =
    Constants.BbRoles.find(x => x.value === users.getUserRole(row))?.label ||
    "Not Available"
</script>

<div on:click|stopPropagation>
  {value}
</div>

<style>
</style>
