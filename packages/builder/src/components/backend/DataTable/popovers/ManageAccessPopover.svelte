<script>
  import { roles, permissions as permissionsStore } from "stores/backend"
  import { notifications } from "@budibase/bbui"
  import { Button, Label, Input, Select, Spacer } from "@budibase/bbui"
  import { capitalise } from "../../../../helpers"

  export let resourceId
  export let permissions
  export let onClosed

  async function changePermission(level, role) {
    await permissionsStore.save({
      level,
      role,
      resource: resourceId,
    })

    // Show updated permissions in UI: REMOVE
    permissions = await permissionsStore.forResource(resourceId)
    notifications.success("Updated permissions.")
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
      <Input value={capitalise(level)} disabled />
      <Select
        value={permissions[level]}
        on:change={e => changePermission(level, e.detail)}
        options={$roles}
        getOptionLabel={x => x.name}
        getOptionValue={x => x._id} />
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
    padding: var(--spacing-xl);
  }

  h5 {
    margin: 0;
    font-weight: 500;
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
