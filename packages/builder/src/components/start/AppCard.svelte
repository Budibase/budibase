<script>
  import {
    Heading,
    Icon,
    Body,
    Layout,
    ActionMenu,
    MenuItem,
    Link,
  } from "@budibase/bbui"
  import { gradient } from "actions"
  import { url } from "@roxi/routify"

  export let app
  export let exportApp

  let appExportLoading = false
</script>

<Layout noPadding gap="XS">
  <div class="preview" use:gradient />
  <div class="title">
    <Link href={$url(`../../app/${app._id}`)}>
      <Heading size="XS">
        {app.name}
      </Heading>
    </Link>
    <ActionMenu>
      <Icon slot="control" name="More" hoverable />
      <MenuItem on:click={() => exportApp(app)} icon="Download">Export</MenuItem
      >
    </ActionMenu>
  </div>
  <div class="status">
    <Body noPadding size="S">
      Edited {Math.floor(1 + Math.random() * 10)} months ago
    </Body>
    {#if Math.random() > 0.5}
      <Icon name="LockClosed" />
    {/if}
  </div>
</Layout>

<style>
  .preview {
    height: 135px;
    border-radius: var(--border-radius-s);
    margin-bottom: var(--spacing-s);
  }

  .title,
  .status {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .title :global(a) {
    text-decoration: none;
  }
  .title :global(h1:hover) {
    color: var(--spectrum-global-color-blue-600);
    cursor: pointer;
    transition: color 130ms ease;
  }
</style>
