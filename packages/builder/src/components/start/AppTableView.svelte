<script>
  import { apps } from "stores/portal"
  import { gradient } from "actions"
  import {
    Heading,
    Button,
    Icon,
    ActionMenu,
    MenuItem,
    Link,
  } from "@budibase/bbui"
  import { goto, url } from "@roxi/routify"

  export let exportApp

  const openApp = app => {
    $goto(`../../app/${app._id}`)
  }
</script>

{#if $apps.length}
  <div class="appTable">
    {#each $apps as app}
      <div class="title">
        <div class="preview" use:gradient />
        <Link href={$url(`../../app/${app._id}`)}>
          <Heading size="XS">
            {app.name}
          </Heading>
        </Link>
      </div>
      <div>
        Edited {Math.round(Math.random() * 10 + 1)} months ago
      </div>
      <div>
        {#if Math.random() < 0.33}
          <div class="status status--open" />
          Open
        {:else if Math.random() < 0.33}
          <div class="status status--locked-other" />
          Locked by Will Wheaton
        {:else}
          <div class="status status--locked-you" />
          Locked by you
        {/if}
      </div>
      <div>
        <Button on:click={() => openApp(app)} size="S" secondary>Open</Button>
        <ActionMenu align="right">
          <Icon hoverable slot="control" name="More" />
          <MenuItem on:click={() => exportApp(app)} icon="Download">
            Export
          </MenuItem>
        </ActionMenu>
      </div>
    {/each}
  </div>
{/if}

<style>
  .appTable {
    display: grid;
    grid-template-rows: auto;
    grid-template-columns: 1fr 1fr 1fr auto;
    align-items: center;
  }
  .appTable > div {
    border-bottom: var(--border-light);
    height: 70px;
    display: grid;
    align-items: center;
    gap: var(--spacing-xl);
    grid-template-columns: auto 1fr;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 5px;
  }
  .preview {
    height: 40px;
    width: 40px;
    border-radius: var(--border-radius-s);
  }
  .title :global(a) {
    text-decoration: none;
  }
  .title :global(h1:hover) {
    color: var(--spectrum-global-color-blue-600);
    cursor: pointer;
    transition: color 130ms ease;
  }
  .status {
    height: 10px;
    width: 10px;
    border-radius: 50%;
  }
  .status--locked-you {
    background-color: var(--spectrum-global-color-orange-600);
  }
  .status--locked-other {
    background-color: var(--spectrum-global-color-red-600);
  }
  .status--open {
    background-color: var(--spectrum-global-color-green-600);
  }
</style>
