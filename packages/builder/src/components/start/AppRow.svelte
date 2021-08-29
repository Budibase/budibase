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
  import { processStringSync } from "@budibase/string-templates"
  import { _ as t } from "svelte-i18n"

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
<div>
  {#if app.updatedAt}
    {processStringSync(
      $t("updated") + " {{ duration time 'millisecond' }} " + $t("ago"),
      {
        time: new Date().getTime() - new Date(app.updatedAt).getTime(),
      }
    )}
  {:else}
    {$t("never-updated")}
  {/if}
</div>
<div>
  <StatusLight
    positive={!app.lockedYou && !app.lockedOther}
    notice={app.lockedYou}
    negative={app.lockedOther}
  >
    {#if app.lockedYou}
      {$t("locked-by-you")}
    {:else if app.lockedOther}
      {$t("locked-by")} {app.lockedBy.email}
    {:else}
      {$t("open")}
    {/if}
  </StatusLight>
</div>
<div>
  <StatusLight active={app.deployed} neutral={!app.deployed}>
    {#if app.deployed}{$t("published")}{:else}{$t("unpublished")}{/if}
  </StatusLight>
</div>
<div>
  <Button
    disabled={app.lockedOther}
    on:click={() => editApp(app)}
    size="S"
    secondary>{$t("open")}</Button
  >
  <ActionMenu align="right">
    <Icon hoverable slot="control" name="More" />
    {#if app.deployed}
      <MenuItem on:click={() => viewApp(app)} icon="GlobeOutline">
        {$t("view-published-app")}
      </MenuItem>
    {/if}
    {#if app.lockedYou}
      <MenuItem on:click={() => releaseLock(app)} icon="LockOpen">
        {$t("release-lock")}
      </MenuItem>
    {/if}
    <MenuItem on:click={() => exportApp(app)} icon="Download"
      >{$t("export")}</MenuItem
    >
    {#if app.deployed}
      <MenuItem on:click={() => unpublishApp(app)} icon="GlobeRemove">
        {$t("unpublish")}
      </MenuItem>
    {/if}
    {#if !app.deployed}
      <MenuItem on:click={() => updateApp(app)} icon="Edit"
        >{$t("edit")}</MenuItem
      >
      <MenuItem on:click={() => deleteApp(app)} icon="Delete"
        >{$t("delete")}</MenuItem
      >
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
</style>
