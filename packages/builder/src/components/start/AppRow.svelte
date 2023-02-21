<script>
  import { Heading, Body, Button, Icon, notifications } from "@budibase/bbui"
  import AppLockModal from "../common/AppLockModal.svelte"
  import { processStringSync } from "@budibase/string-templates"
  import { goto } from "@roxi/routify"

  export let app

  const handleDefaultClick = () => {
    if (window.innerWidth < 640) {
      goToOverview()
    } else {
      goToBuilder()
    }
  }

  const goToBuilder = () => {
    if (app.lockedOther) {
      notifications.error(
        `App locked by ${app.lockedBy.email}. Please allow lock to expire or have them unlock this app.`
      )
      return
    }
    $goto(`../../app/${app.devId}`)
  }

  const goToOverview = () => {
    $goto(`../overview/${app.devId}`)
  }
</script>

<div class="app-row" on:click={handleDefaultClick}>
  <div class="title">
    <div class="app-icon">
      <Icon size="L" name={app.icon?.name || "Apps"} color={app.icon?.color} />
    </div>
    <div class="name">
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

  <div class="title app-status" class:deployed={app.deployed}>
    <Icon size="L" name={app.deployed ? "GlobeCheck" : "GlobeStrike"} />
    <Body size="S">{app.deployed ? "Published" : "Unpublished"}</Body>
  </div>

  <div class="app-row-actions">
    <AppLockModal {app} buttonSize="M" />
    <Button size="S" secondary on:click={goToOverview}>Manage</Button>
    <Button size="S" primary disabled={app.lockedOther} on:click={goToBuilder}>
      Edit
    </Button>
  </div>
</div>

<style>
  .app-row {
    background: var(--background);
    padding: 24px 32px;
    border-radius: 8px;
    display: grid;
    grid-template-columns: 35% 25% 15% auto;
    align-items: center;
    gap: var(--spacing-m);
    transition: border 130ms ease-out;
    border: 1px solid transparent;
  }
  .app-row:hover {
    cursor: pointer;
    border-color: var(--spectrum-global-color-gray-300);
  }

  .updated {
    color: var(--spectrum-global-color-gray-700);
  }

  .title,
  .name {
    flex: 1 1 auto;
  }
  .name {
    width: 0;
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
    color: var(--spectrum-global-color-gray-600);
  }

  .app-row-actions {
    gap: var(--spacing-m);
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
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

  @media (max-width: 1000px) {
    .app-row {
      grid-template-columns: 45% 30% auto;
    }
    .updated {
      display: none;
    }
  }
  @media (max-width: 800px) {
    .app-row {
      grid-template-columns: 1fr auto;
    }
    .app-status {
      display: none;
    }
  }
  @media (max-width: 640px) {
    .app-row {
      padding: 20px;
    }
    .app-row-actions {
      display: none;
    }
  }
</style>
