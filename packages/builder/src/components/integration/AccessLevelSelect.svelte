<script lang="ts">
  import { Label, notifications } from "@budibase/bbui"
  import { datasources, permissions } from "@/stores/builder"
  import { Constants } from "@budibase/frontend-core"
  import RoleSelect from "@/components/design/settings/controls/RoleSelect.svelte"
  import { PermissionLevel, SourceName, type Query } from "@budibase/types"

  export let query: Query
  export let label

  $: getPermissions(query)
  $: isMongo =
    $datasources.list.find(datasource => datasource._id === query?.datasourceId)
      ?.source === SourceName.MONGODB

  let roleId: string, loaded: boolean, fetched: Query | undefined

  async function updateRole(role: string | undefined) {
    try {
      roleId = role || ""
      const queryId = query._id
      if (role && queryId) {
        for (let level of [PermissionLevel.READ, PermissionLevel.WRITE]) {
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

  async function getPermissions(queryToFetch: Query) {
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
  <RoleSelect
    value={isMongo && roleId === Constants.Roles.PUBLIC ? "" : roleId}
    onChange={updateRole}
    allowPublic={!isMongo}
    placeholder={isMongo && roleId === Constants.Roles.PUBLIC
      ? "Public (existing)"
      : undefined}
    autoWidth
  />
{/if}
