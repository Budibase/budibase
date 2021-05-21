<script>
  import {
    Heading,
    Icon,
    Body,
    Layout,
    ActionMenu,
    MenuItem,
    StatusLight,
  } from "@budibase/bbui"
  import { gradient } from "actions"
  import { auth } from "stores/portal"
  import { AppStatus } from "constants"

  export let app
  export let exportApp
  export let viewApp
  export let editApp
  export let deleteApp
  export let unpublishApp
  export let releaseLock
</script>

<div class="wrapper">
  <Layout noPadding gap="XS" alignContent="start">
    <div class="preview" use:gradient={{ seed: app.name }} />
    <div class="title">
      {#if app.lockedBy}
        <Icon name="LockClosed" />
      {/if}
      <div class="name" on:click={() => editApp(app)}>
        <Heading size="XS">
          {app.name}
        </Heading>
      </div>
      <ActionMenu align="right">
        <Icon slot="control" name="More" hoverable />
        {#if app.deployed}
          <MenuItem on:click={() => viewApp(app)} icon="GlobeOutline">
            View published app
          </MenuItem>
        {/if}
        {#if app.lockedBy && app.lockedBy?.email === $auth.user?.email}
          <MenuItem on:click={() => releaseLock(app)} icon="LockOpen">
            Release lock
          </MenuItem>
        {/if}
        <MenuItem on:click={() => exportApp(app)} icon="Download">
          Export
        </MenuItem>
        {#if app.deployed}
          <MenuItem on:click={() => unpublishApp(app)} icon="GlobeRemove">
            Unpublish
          </MenuItem>
        {/if}
        {#if !app.deployed}
          <MenuItem on:click={() => deleteApp(app)} icon="Delete">
            Delete
          </MenuItem>
        {/if}
      </ActionMenu>
    </div>
    <div class="status">
      <Body size="S">
        Updated {Math.floor(1 + Math.random() * 10)} months ago
      </Body>
      <StatusLight active={app.deployed} neutral={!app.deployed}>
        {#if app.deployed}Published{:else}Unpublished{/if}
      </StatusLight>
    </div>
  </Layout>
</div>

<style>
  .wrapper {
    overflow: hidden;
  }
  .wrapper :global(.spectrum-StatusLight) {
    padding: 0;
    min-height: 0;
  }

  .preview {
    height: 135px;
    border-radius: var(--border-radius-s);
    margin-bottom: var(--spacing-m);
  }

  .status {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .name {
    flex: 1 1 auto;
  }

  .title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--spacing-m);
  }
  .title :global(.spectrum-Icon) {
    flex: 0 0 auto;
  }
  .title :global(h1) {
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .title :global(h1:hover) {
    color: var(--spectrum-global-color-blue-600);
    cursor: pointer;
    transition: color 130ms ease;
  }
</style>
