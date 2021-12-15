<script>
  import {
    Heading,
    Button,
    Icon,
    ActionMenu,
    MenuItem,
    StatusLight,
  } from "@budibase/bbui"
  import { processStringSync } from "@budibase/string-templates"

  export let app
  export let exportApp
  export let viewApp
  export let editApp
  export let updateApp
  export let deleteApp
  export let unpublishApp
  export let releaseLock
  export let editIcon
</script>

<div class="title">
  <div style="display: flex;">
    <div style="color: {app.icon?.color || ''}">
      <Icon size="XL" name={app.icon?.name || "Apps"} />
    </div>
    <div class="name" on:click={() => editApp(app)}>
      <Heading size="XS">
        {app.name}
      </Heading>
    </div>
  </div>
</div>
<div class="desktop">
  {#if app.updatedAt}
    {processStringSync("Updated {{ duration time 'millisecond' }} ago", {
      time: new Date().getTime() - new Date(app.updatedAt).getTime(),
    })}
  {:else}
    Never updated
  {/if}
</div>
<div class="desktop">
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
<div class="desktop">
  <StatusLight active={app.deployed} neutral={!app.deployed}>
    {#if app.deployed}Published{:else}Unpublished{/if}
  </StatusLight>
</div>
<div>
  <Button
    size="S"
    disabled={app.lockedOther}
    on:click={() => editApp(app)}
    secondary
  >
    Open
  </Button>
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
    <MenuItem on:click={() => editIcon(app)} icon="Brush">Edit icon</MenuItem>
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
