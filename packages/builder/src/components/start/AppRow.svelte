<script>
  import { gradient } from "actions"
  import {
    Heading,
    Button,
    Icon,
    ActionMenu,
    MenuItem,
    StatusLight,
  } from "@budibase/bbui"
  import { auth } from "stores/portal"

  export let app
  export let exportApp
  export let viewApp
  export let editApp
  export let deleteApp
  export let unpublishApp
  export let releaseLock
  export let last
</script>

<div class="title" class:last>
  <div class="preview" use:gradient={{ seed: app.name }} />
  <div class="name" on:click={() => editApp(app)}>
    <Heading size="XS">
      {app.name}
    </Heading>
  </div>
</div>
<div class:last>
  Updated {Math.round(Math.random() * 10 + 1)} months ago
</div>
<div class:last>
  <StatusLight
    positive={!app.lockedYou && !app.lockedOther}
    notice={app.lockedYou}
    negative={app.lockedOther}
  >
    {#if app.lockedYou}
      Locked by you
    {:else if app.lockedOther}
      Locked by {app.lockedBy.email}
    {:else}
      Open
    {/if}
  </StatusLight>
</div>
<div class:last>
  <StatusLight active={app.deployed} neutral={!app.deployed}>
    {#if app.deployed}Published{:else}Unpublished{/if}
  </StatusLight>
</div>
<div class:last>
  <Button
    disabled={app.lockedOther}
    on:click={() => editApp(app)}
    size="S"
    secondary>Open</Button
  >
  <ActionMenu align="right">
    <Icon hoverable slot="control" name="More" />
    {#if app.deployed}
      <MenuItem on:click={() => viewApp(app)} icon="GlobeOutline">
        View published app
      </MenuItem>
      <MenuItem on:click={() => unpublishApp(app)} icon="GlobeRemove">
        Unpublish
      </MenuItem>
    {/if}
    {#if app.lockedBy && app.lockedBy?.email === $auth.user?.email}
      <MenuItem on:click={() => releaseLock(app)} icon="LockOpen">
        Release lock
      </MenuItem>
    {/if}
    {#if !app.deployed}
      <MenuItem on:click={() => deleteApp(app)} icon="Delete">Delete</MenuItem>
    {/if}
    <MenuItem on:click={() => exportApp(app)} icon="Download">Export</MenuItem>
  </ActionMenu>
</div>

<style>
  .preview {
    height: 40px;
    width: 40px;
    border-radius: var(--border-radius-s);
  }
  .name {
    text-decoration: none;
    overflow: hidden;
  }
  .name :global(.spectrum-Heading) {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .title :global(h1:hover) {
    color: var(--spectrum-global-color-blue-600);
    cursor: pointer;
    transition: color 130ms ease;
  }
</style>
