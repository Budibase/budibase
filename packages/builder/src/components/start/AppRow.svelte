<script>
  import { Heading, Button, Icon, ActionMenu, MenuItem } from "@budibase/bbui"
  import { apps } from "stores/portal"

  export let app
  export let exportApp
  export let viewApp
  export let editApp
  export let updateApp
  export let deleteApp
  export let unpublishApp
  export let releaseLock
  export let editIcon
  $: color = $apps.filter(filtered_app => app?.appId === filtered_app.appId)[0]
    .icon?.color
  $: name = $apps.filter(filtered_app => app?.appId === filtered_app.appId)[0]
    .icon?.name
</script>

<div class="title">
  <div style="display: flex;">
    <div style="color: {color || ''}">
      <Icon size="XL" name={name || "Apps"} />
    </div>
    <div class="name" on:click={() => editApp(app)}>
      <Heading size="XS">
        {app.name}
      </Heading>
    </div>
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
    <MenuItem on:click={() => editIcon(app)} icon="Edit">Edit Icon</MenuItem>
  </ActionMenu>
</div>

<style>
  .name {
    text-decoration: none;
    overflow: hidden;
  }
  .name :global(.spectrum-Heading) {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-left: calc(1.5 * var(--spacing-xl));
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
