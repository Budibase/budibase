<script>
  import { Heading, Body, Button, Icon } from "@budibase/bbui"
  import { processStringSync } from "@budibase/string-templates"
  import { auth } from "@/stores/portal"
  import { goto } from "@roxi/routify"
  import { UserAvatars } from "@budibase/frontend-core"
  import { sdk } from "@budibase/shared-core"
  import AppContextMenuModals from "./AppContextMenuModals.svelte"
  import getAppContextMenuItems from "./getAppContextMenuItems.js"
  import FavouriteAppButton from "@/pages/builder/portal/apps/FavouriteAppButton.svelte"
  import { contextMenuStore } from "@/stores/builder"

  export let app
  export let lockedAction

  let appContextMenuModals

  $: contextMenuOpen = `${app.appId}-index` === $contextMenuStore.id
  $: editing = app.sessions?.length
  $: isBuilder = sdk.users.isBuilder($auth.user, app?.devId)
  $: unclickable = !isBuilder && !app.deployed

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
    if (app.deployed && app.url) {
      window.open(`/app${app.url}`, "_blank")
    }
  }

  const openContextMenu = e => {
    e.preventDefault()
    e.stopPropagation()

    const items = getAppContextMenuItems({
      app,
      onDuplicate: appContextMenuModals?.showDuplicateModal,
      onExportDev: appContextMenuModals?.showExportDevModal,
      onExportProd: appContextMenuModals?.showExportProdModal,
      onDelete: appContextMenuModals?.showDeleteModal,
    })

    contextMenuStore.open(`${app.appId}-index`, items, {
      x: e.clientX,
      y: e.clientY,
    })
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class:contextMenuOpen
  class="app-row"
  class:unclickable
  class:favourite={app.favourite}
  on:click={lockedAction || handleDefaultClick}
  on:contextmenu={openContextMenu}
>
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

  <div class="actions-wrap">
    <div class="app-row-actions">
      {#if isBuilder}
        <div class="row-action">
          <Button size="S" secondary on:click={lockedAction || goToBuilder}>
            Edit
          </Button>
        </div>
        <div class="row-action">
          <Icon
            on:click={openContextMenu}
            size="S"
            hoverable
            name="MoreSmallList"
          />
        </div>
      {:else}
        <!-- this can happen if an app builder has app user access to an app -->
        <Button size="S" secondary>View</Button>
      {/if}
    </div>

    <div class="favourite-icon">
      <FavouriteAppButton {app} noWrap />
    </div>
  </div>
  <AppContextMenuModals {app} bind:this={appContextMenuModals} />
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
  .app-row:not(.unclickable):hover,
  .contextMenuOpen {
    cursor: pointer;
    border-color: var(--spectrum-global-color-gray-300);
  }

  .app-row .favourite-icon {
    display: none;
  }

  .app-row.contextMenuOpen .favourite-icon,
  .app-row:hover .favourite-icon,
  .app-row.favourite .favourite-icon {
    display: flex;
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
    display: none;
  }

  .app-row.contextMenuOpen .app-row-actions,
  .app-row:hover .app-row-actions {
    gap: var(--spacing-m);
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    display: flex;
  }

  .actions-wrap {
    gap: var(--spacing-m);
    display: flex;
    justify-content: flex-end;
    min-height: var(--spectrum-alias-item-height-s);
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
