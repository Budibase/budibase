<script>
  import { Heading, Body, Button, Icon } from "@budibase/bbui"
  import AppLockModal from "../common/AppLockModal.svelte"
  import { processStringSync } from "@budibase/string-templates"

  export let app
  export let editApp
  export let appOverview
</script>

<div class="app-row">
  <div class="header">
    <div class="title" data-cy={`${app.devId}`}>
      <div class="app-icon" style="color: {app.icon?.color || ''}">
        <Icon size="L" name={app.icon?.name || "Apps"} />
      </div>
      <div class="name" data-cy="app-name-link" on:click={() => editApp(app)}>
        <Heading size="S">
          {app.name}
        </Heading>
      </div>
    </div>

    <div class="updated">
      {#if app.updatedAt}
        {processStringSync("Updated {{ duration time 'millisecond' }} ago", {
          time: new Date().getTime() - new Date(app.updatedAt).getTime(),
        })}
      {:else}
        Never updated
      {/if}
    </div>
  </div>

  <div class="title app-status" class:deployed={app.deployed}>
    <Icon size="L" name={app.deployed ? "GlobeCheck" : "GlobeStrike"} />
    <Body size="S">{`${window.origin}/app${app.url}`}</Body>
  </div>

  <div data-cy={`row_actions_${app.appId}`}>
    <div class="app-row-actions">
      <Button
        size="S"
        primary
        newStyles
        disabled={app.lockedOther}
        on:click={() => editApp(app)}
      >
        Edit
      </Button>
      <Button size="S" secondary newStyles on:click={() => appOverview(app)}>
        Manage
      </Button>
      <AppLockModal {app} buttonSize="M" />
    </div>
  </div>
</div>

<style>
  .app-row {
    background: var(--background);
    padding: 24px 32px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-m);
  }

  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .updated {
    color: var(--spectrum-global-color-gray-700);
  }

  .title,
  .app-status {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
  }

  .title :global(.spectrum-Heading),
  .title :global(.spectrum-Icon),
  .title :global(.spectrum-Body) {
    color: var(--spectrum-global-color-gray-900);
  }

  .app-status:not(.deployed) :global(.spectrum-Icon),
  .app-status:not(.deployed) :global(.spectrum-Body) {
    color: var(--spectrum-global-color-gray-700);
  }

  .app-row-actions {
    gap: var(--spacing-m);
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-top: var(--spacing-m);
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
