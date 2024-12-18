<script>
  import { Label, notifications } from "@budibase/bbui"
  import { permissions } from "@/stores/builder"
  import { Constants } from "@budibase/frontend-core"
  import RoleSelect from "@/components/design/settings/controls/RoleSelect.svelte"

  export let query
  export let label

  $: getPermissions(query)

  let roleId, loaded, fetched

  async function updateRole(role, id) {
    try {
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
    } catch (error) {
      notifications.error("Error updating role")
    }
  }

  async function getPermissions(queryToFetch) {
    if (fetched?._id === queryToFetch?._id) {
      loaded = true
      return
    }
    fetched = queryToFetch
    if (!queryToFetch || !queryToFetch._id) {
      roleId = Constants.Roles.BASIC
      loaded = true
      return
    }
    try {
      roleId = (await permissions.forResource(queryToFetch._id))["read"].role
    } catch (err) {
      roleId = Constants.Roles.BASIC
    }
    loaded = true
  }
</script>

{#if loaded}
  {#if label}
    <Label>{label}</Label>
  {/if}
  <RoleSelect value={roleId} on:change={e => updateRole(e.detail)} autoWidth />
{/if}
