<script>
  import { onMount } from "svelte"
  import { backendUiStore } from "builderStore"
  import { Roles } from "constants/backend"
  import api from "builderStore/api"
  import { notifier } from "builderStore/store/notifications"
  import { Button, Label, Select, Spacer } from "@budibase/bbui"

  export let resourceId
  export let permissions
  export let levels
  export let onClosed

  // Draft level and role for editing
  let level = levels[0]
  let role = Roles.BASIC

  $: permissionKeys = Object.keys(permissions)

  async function addPermission() {
    await backendUiStore.actions.permissions.save({
      level,
      role,
      resource: resourceId,
    })

    // Show updated permissions in UI
    permissions = await backendUiStore.actions.permissions.forResource(
      resourceId
    )
    notifier.success("Access rule saved.")

    // Reset the draft permissions
    level = levels[0]
    role = Roles.BASIC
  }

  async function deletePermission(level, role) {
    await backendUiStore.actions.permissions.delete({ level, role, resourceId })
    delete permissions[role]
    notifier.danger("Removed access rule.")
    permissions = permissions
  }
</script>

<div class="popover">
  <h5>Who Can Access This Data?</h5>
  <Spacer large />
  <div class="row">
    <Label extraSmall grey>Level</Label>
    <Label extraSmall grey>Role</Label>
    <div />
    {#if permissionKeys.length === 0}
      <Label extraSmall>Default Access Rules Applied.</Label>
    {/if}
    {#each permissionKeys as role}
      <Label small>{permissions[role]}</Label>
      <Label small>{role}</Label>
      <i
        class="ri-close-circle-line delete"
        on:click={() => deletePermission(permissions[role], role)} />
    {/each}
  </div>

  <Spacer large />

  <hr />
  <Label small>Add Rule</Label>
  <Spacer small />
  <div class="draft-permission">
    <Select label="Level" secondary thin bind:value={level}>
      {#each levels as level}
        <option value={level}>{level}</option>
      {/each}
    </Select>
    <Select label="Role" secondary thin bind:value={role}>
      {#each $backendUiStore.roles as role}
        <option value={role._id}>{role.name}</option>
      {/each}
    </Select>
  </div>
  <div class="footer">
    <Button secondary on:click={onClosed}>Cancel</Button>
    <Button primary on:click={addPermission}>Edit Rules</Button>
  </div>
</div>

<style>
  .popover {
    display: grid;
    width: 400px;
  }

  h5 {
    margin: 0;
    font-weight: 500;
  }

  hr {
    margin: var(--spacing-s) 0 var(--spacing-m) 0;
  }

  .footer {
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-m);
    margin-top: var(--spacing-l);
  }

  .draft-permission {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: var(--spacing-m);
  }

  .row {
    display: grid;
    grid-template-columns: 1fr 1fr 20px;
    grid-gap: var(--spacing-s);
  }

  .delete {
    cursor: pointer;
  }
</style>
