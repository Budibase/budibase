<script>
  import { auth } from "@/stores/portal"
  import { params, goto } from "@roxi/routify"
  import NavItem from "@/components/common/NavItem.svelte"
  import AppContextMenuModals from "@/components/start/AppContextMenuModals.svelte"
  import getAppContextMenuItems from "@/components/start/getAppContextMenuItems.js"
  import FavouriteAppButton from "../FavouriteAppButton.svelte"
  import { sdk } from "@budibase/shared-core"
  import { Icon } from "@budibase/bbui"
  import { contextMenuStore } from "@/stores/builder"

  export let app

  let opened
  let appContextMenuModals

  $: contextMenuOpen = `${app.appId}-sideBar` === $contextMenuStore.id

  const openContextMenu = (e, app) => {
    e.preventDefault()
    e.stopPropagation()

    const items = getAppContextMenuItems({
      app,
      onDuplicate: appContextMenuModals.showDuplicateModal,
      onExportDev: appContextMenuModals.showExportDevModal,
      onExportProd: appContextMenuModals.showExportProdModal,
      onDelete: appContextMenuModals.showDeleteModal,
    })

    contextMenuStore.open(`${app.appId}-sideBar`, items, {
      x: e.clientX,
      y: e.clientY,
    })
  }
</script>

<span
  class="side-bar-app-entry"
  class:favourite={app.favourite}
  class:actionsOpen={opened == app.appId || contextMenuOpen}
>
  <NavItem
    on:contextmenu={e => openContextMenu(e, app)}
    text={app.name}
    icon={app.icon?.name || "Apps"}
    iconColor={app.icon?.color}
    selected={$params.appId === app.appId}
    hovering={contextMenuOpen}
    highlighted={opened == app.appId}
    on:click={() => $goto(`./${app.appId}`)}
    withActions
    showActions
  >
    <div class="app-entry-actions">
      {#if sdk.users.isBuilder($auth.user, app?.devId)}
        <Icon
          on:click={e => openContextMenu(e, app)}
          size="S"
          hoverable
          name="MoreSmallList"
        />
      {/if}
    </div>
    <div class="favourite-icon">
      <FavouriteAppButton {app} size="XS" />
    </div>
  </NavItem>
</span>
<AppContextMenuModals {app} bind:this={appContextMenuModals} />

<style>
  .side-bar-app-entry :global(.nav-item-content .actions) {
    width: auto;
    display: flex;
    gap: var(--spacing-s);
  }

  .side-bar-app-entry:hover .app-entry-actions,
  .side-bar-app-entry:hover .favourite-icon,
  .side-bar-app-entry.favourite .favourite-icon,
  .side-bar-app-entry.actionsOpen .app-entry-actions,
  .side-bar-app-entry.actionsOpen .favourite-icon {
    opacity: 1;
  }

  .side-bar-app-entry .app-entry-actions,
  .side-bar-app-entry .favourite-icon {
    opacity: 0;
  }
</style>
