<script>
  import { roles, permissions as permissionsStore } from "stores/backend"
  import {
    Label,
    Input,
    Select,
    notifications,
    Body,
    ModalContent,
  } from "@budibase/bbui"
  import { capitalise } from "helpers"

  export let resourceId
  export let permissions

  async function changePermission(level, role) {
    try {
      await permissionsStore.save({
        level,
        role,
        resource: resourceId,
      })

      // Show updated permissions in UI: REMOVE
      permissions = await permissionsStore.forResource(resourceId)
      notifications.success("Updated permissions")
    } catch (error) {
      notifications.error("Error updating permissions")
    }
  }
</script>

<ModalContent title="Manage Access" showCancelButton={false} confirmText="Done">
  <Body size="S">Specify the minimum access level role for this data.</Body>
  <div class="row">
    <Label extraSmall grey>Level</Label>
    <Label extraSmall grey>Role</Label>
    {#each Object.keys(permissions) as level}
      <Input value={capitalise(level)} disabled />
      <Select
        value={permissions[level]}
        on:change={e => changePermission(level, e.detail)}
        options={$roles}
        getOptionLabel={x => x.name}
        getOptionValue={x => x._id}
      />
    {/each}
  </div>
</ModalContent>

<style>
  .row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: var(--spacing-s);
  }
</style>
