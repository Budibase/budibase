<script>
  import { onMount } from "svelte"
  import { backendUiStore } from "builderStore"
  import { Roles } from "constants/backend"
  import api from "builderStore/api"
  import { notifier } from "builderStore/store/notifications"
  import { Button, Label, Input, Select, Spacer } from "@budibase/bbui"

  export let resourceId
  export let permissions
  export let onClosed

  async function changePermission(level, role) {
    await backendUiStore.actions.permissions.save({
      level,
      role,
      resource: resourceId,
    })

    // Show updated permissions in UI: REMOVE
    permissions = await backendUiStore.actions.permissions.forResource(
      resourceId
    )
    notifier.success("Updated permissions.")
    // TODO: update permissions
    // permissions[]
  }
</script>

<div class="popover">
  <h5>Who Can Access This Data?</h5>
  <div class="note">
    <Label extraSmall grey>
      Specify the minimum access level role for this data.
    </Label>
  </div>
  <Spacer large />
  <div class="row">
    <Label extraSmall grey>Level</Label>
    <Label extraSmall grey>Role</Label>
    {#each Object.keys(permissions) as level}
      <Input secondary thin value={level} disabled={true} />
      <Select
        secondary
        thin
        value={permissions[level]}
        on:change={e => changePermission(level, e.target.value)}>
        {#each $backendUiStore.roles as role}
          <option value={role._id}>{role.name}</option>
        {/each}
      </Select>
    {/each}
  </div>

  <Spacer large />

  <div class="footer">
    <Button secondary on:click={onClosed}>Cancel</Button>
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

  .row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: var(--spacing-m);
  }

  .note {
    margin-top: 10px;
    margin-bottom: 0;
  }
</style>
