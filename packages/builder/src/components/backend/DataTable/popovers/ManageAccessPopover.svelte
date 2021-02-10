<script>
  import { onMount } from "svelte"
  import { backendUiStore } from "builderStore"
  import api from "builderStore/api"
  import { notifier } from "builderStore/store/notifications"
  import { Button, Select } from "@budibase/bbui"

  const FORMATS = [
    {
      name: "CSV",
      key: "csv",
    },
    {
      name: "JSON",
      key: "json",
    },
  ]

  export let resourceId
  export let onClosed

  let permissions = {}
  let levels = []

  async function exportView() {
    onClosed()
  }

  async function changePermission(level, role) {
    console.log({ role, resourceId, level })
    await backendUiStore.actions.permissions.save({
      role,
      resource: resourceId,
      level,
    })
  }

  onMount(async () => {
    // TODO: possibly cleaner
    permissions = await backendUiStore.actions.permissions.forResource(
      resourceId
    )
    levels = await backendUiStore.actions.permissions.fetchLevels()
  })
</script>

<div class="popover">
  <h5>Manage Access</h5>
  {#each levels as level}
    <Select
      label={level}
      secondary
      thin
      value={permissions[level]}
      on:change={e => changePermission(level, e.target.value)}>
      {#each $backendUiStore.roles as role}
        <option value={role._id}>{role.name}</option>
      {/each}
    </Select>
  {/each}
  <div class="footer">
    <Button secondary on:click={onClosed}>Cancel</Button>
    <!-- <Button primary on:click={}>Save</Button> -->
  </div>
</div>

<style>
  .popover {
    display: grid;
    grid-gap: var(--spacing-xl);
  }

  h5 {
    margin: 0;
    font-weight: 500;
  }

  .footer {
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-m);
  }
</style>
