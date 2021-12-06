<script>
  import { gradient } from "actions"
  import { Heading, Button, Icon, ActionMenu, MenuItem } from "@budibase/bbui"

  export let app
  export let exportApp
  export let viewApp
  export let editApp
  export let updateApp
  export let deleteApp
  export let unpublishApp
  export let releaseLock
</script>

<div class="title">
  <div class="preview" use:gradient={{ seed: app.name }} />
  <div class="name" on:click={() => editApp(app)}>
    <Heading size="XS">
      {app.name}
    </Heading>
  </div>
</div>
<div class="desktop" />
<div class="desktop" />
<div class="desktop" />
<div>
  <Button
    disabled={app.lockedOther}
    on:click={() => editApp(app)}
    size="S"
    quiet
    secondary>Open</Button
  >
  <ActionMenu align="right">
    <Icon hoverable slot="control" name="More" />
    {#if app.deployed}
      <MenuItem on:click={() => viewApp(app)} icon="GlobeOutline">
        View published app
      </MenuItem>
    {/if}
    {#if app.lockedYou}
      <MenuItem on:click={() => releaseLock(app)} icon="LockOpen">
        Release lock
      </MenuItem>
    {/if}
    <MenuItem on:click={() => exportApp(app)} icon="Download">Export</MenuItem>
    {#if app.deployed}
      <MenuItem on:click={() => unpublishApp(app)} icon="GlobeRemove">
        Unpublish
      </MenuItem>
    {/if}
    {#if !app.deployed}
      <MenuItem on:click={() => updateApp(app)} icon="Edit">Edit</MenuItem>
      <MenuItem on:click={() => deleteApp(app)} icon="Delete">Delete</MenuItem>
    {/if}
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

  @media (max-width: 640px) {
    .desktop {
      display: none !important;
    }
  }
</style>
