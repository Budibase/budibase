<script>
  import { Heading, Body, Button, Icon } from "@budibase/bbui"
  import { processStringSync } from "@budibase/string-templates"
  import { auth } from "stores/portal"
  import { goto } from "@roxi/routify"
  import { UserAvatars } from "@budibase/frontend-core"
  import { sdk } from "@budibase/shared-core"

  export let app
  export let lockedAction

  $: editing = app.sessions?.length
  $: isBuilder = sdk.users.isBuilder($auth.user, app?.devId)

  const handleDefaultClick = () => {
    if (!isBuilder) {
      goToApp()
    } else if (window.innerWidth < 640) {
      goToOverview()
    } else {
      goToBuilder()
    }
  }

  const goToBuilder = () => {
    $goto(`../../app/${app.devId}`)
  }

  const goToOverview = () => {
    $goto(`../../app/${app.devId}/settings`)
  }

  const goToApp = () => {
    window.open(`/app/${app.name}`, "_blank")
  }
</script>

<div class="app-row" on:click={lockedAction || handleDefaultClick}>
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
    {#if editing && isBuilder}
      Currently editing
      <UserAvatars users={app.sessions} />
    {:else if app.updatedAt}
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

  {#if isBuilder}
    <div class="app-row-actions">
      <Button size="S" secondary on:click={lockedAction || goToOverview}>
        Manage
      </Button>
      <Button size="S" primary on:click={lockedAction || goToBuilder}>
        Edit
      </Button>
    </div>
  {:else}
    <!-- this can happen if an app builder has app user access to an app -->
    <div class="app-row-actions">
      <Button size="S" secondary>View</Button>
    </div>
  {/if}
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
    display: flex;
    align-items: center;
    gap: 8px;
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
