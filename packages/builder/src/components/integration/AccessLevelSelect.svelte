<script>
  import { Label, Select } from "@budibase/bbui"
  import { permissions, roles } from "stores/backend"
  import { onMount } from "svelte"
  import { Roles } from "constants/backend"

  export let query
  export let saveId
  export let label

  $: updateRole(roleId, saveId)

  let roleId, loaded

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

  onMount(async () => {
    if (!query || !query._id) {
      roleId = Roles.BASIC
      loaded = true
      return
    }
    try {
      roleId = (await permissions.forResource(query._id))["read"]
    } catch (err) {
      roleId = Roles.BASIC
    }
    loaded = true
  })
</script>

{#if loaded}
  {#if label}
    <Label>{label}</Label>
  {/if}
  <Select
    value={roleId}
    on:change={e => updateRole(e.detail)}
    options={$roles}
    getOptionLabel={x => x.name}
    getOptionValue={x => x._id}
    autoWidth
  />
{/if}
