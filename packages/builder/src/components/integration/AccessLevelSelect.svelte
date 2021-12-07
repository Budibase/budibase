<script>
  import { Label, Select } from "@budibase/bbui"
  import { permissions, roles } from "stores/backend"

  export let query
  export let saveId
  export let label

  $: updateRole(roleId, saveId)

  let roleId

  async function updateRole(role, id) {
    roleId = role
    const queryId = query?._id || id
    if (roleId && queryId) {
      for (let level of ["read", "write"]) {
        await permissions.save({
          level,
          role,
          resource: queryId,
        })
      }
    }
  }
</script>

{#if label}
  <Label>{label}</Label>
{/if}
<Select
  value={roleId}
  on:change={e => updateRole(e.detail)}
  options={$roles}
  getOptionLabel={x => x.name}
  getOptionValue={x => x._id}
/>
