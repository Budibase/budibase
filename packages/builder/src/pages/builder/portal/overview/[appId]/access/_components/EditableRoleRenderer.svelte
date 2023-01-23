<script>
  import RoleSelect from "components/common/RoleSelect.svelte"
  import { getContext } from "svelte"

  const rolesContext = getContext("roles")

  export let value
  export let row
</script>

<div>
  <RoleSelect
    {value}
    quiet
    allowRemove
    allowPublic={false}
    on:change={e => rolesContext.updateRole(e.detail, row._id)}
    on:remove={() => rolesContext.removeRole(row._id)}
  />
</div>

<style>
  div {
    width: 100%;
  }
</style>
