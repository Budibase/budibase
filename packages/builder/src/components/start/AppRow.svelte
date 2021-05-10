<script>
  import { gradient } from "actions"
  import {
    Heading,
    Button,
    Icon,
    ActionMenu,
    MenuItem,
    Link,
  } from "@budibase/bbui"
  import { url } from "@roxi/routify"

  export let app
  export let openApp
  export let exportApp
  export let deleteApp
  export let last
</script>

<div class="title" class:last>
  <div class="preview" use:gradient={{ seed: app.name }} />
  <Link href={$url(`../../app/${app._id}`)}>
    <Heading size="XS">
      {app.name}
    </Heading>
  </Link>
</div>
<div class:last>
  Edited {Math.round(Math.random() * 10 + 1)} months ago
</div>
<div class:last>
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
<div class:last>
  <Button on:click={() => openApp(app)} size="S" secondary>Open</Button>
  <ActionMenu align="right">
    <Icon hoverable slot="control" name="More" />
    <MenuItem on:click={() => exportApp(app)} icon="Download">Export</MenuItem>
    <MenuItem on:click={() => deleteApp(app)} icon="Delete">Delete</MenuItem>
  </ActionMenu>
</div>

<style>
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
