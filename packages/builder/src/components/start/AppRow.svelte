<script>
  import { Heading, Button, Icon } from "@budibase/bbui"
  import AppLockModal from "../common/AppLockModal.svelte"
  import { processStringSync } from "@budibase/string-templates"

  export let app
  export let editApp
  export let appOverview
</script>

<div class="title" data-cy={`${app.devId}`}>
  <div>
    <div class="app-icon" style="color: {app.icon?.color || ''}">
      <Icon size="XL" name={app.icon?.name || "Apps"} />
    </div>
    <div class="name" data-cy="app-name-link" on:click={() => editApp(app)}>
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
  <span><AppLockModal {app} buttonSize="M" /></span>
</div>
<div class="desktop">
  <div class="app-status">
    {#if app.deployed}
      <Icon name="Globe" disabled={false} />
      Published
    {:else}
      <Icon name="GlobeStrike" disabled={true} />
      <span class="disabled"> Unpublished </span>
    {/if}
  </div>
</div>
<div data-cy={`row_actions_${app.appId}`}>
  <div class="app-row-actions">
    <Button size="S" secondary newStyles on:click={() => appOverview(app)}>
      Manage
    </Button>
    <Button
      size="S"
      primary
      newStyles
      disabled={app.lockedOther}
      on:click={() => editApp(app)}
    >
      Edit
    </Button>
  </div>
</div>

<style>
  div.title,
  div.title > div {
    display: flex;
    max-width: 100%;
  }
  .app-row-actions {
    grid-gap: var(--spacing-s);
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }
  .app-status {
    display: grid;
    grid-gap: var(--spacing-s);
    grid-template-columns: 24px 100px;
  }
  .app-status span.disabled {
    opacity: 0.3;
  }
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
