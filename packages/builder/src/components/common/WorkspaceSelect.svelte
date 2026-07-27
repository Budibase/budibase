<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte"
  import { goto } from "@roxi/routify"
  import { ActionMenu, MenuItem, Icon, StatusLight } from "@budibase/bbui"
  import { sdk } from "@budibase/shared-core"
  import { processStringSync } from "@budibase/string-templates"
  import AppContextMenuModals from "@/components/start/AppContextMenuModals.svelte"
  import getAppContextMenuItems from "@/components/start/getAppContextMenuItems"
  import { appStore } from "@/stores/builder"
  import { contextMenuStore } from "@/stores/builder/contextMenu"
  import { bb } from "@/stores/bb"
  import { enrichedApps, auth, licensing } from "@/stores/portal"
  import { appsStore, sortBy } from "@/stores/portal/apps"
  import WorkspaceSortMenu from "./WorkspaceSortMenu.svelte"
  import type { EnrichedApp } from "@/types"

  // Manually subscribe - https://github.com/roxiness/routify/issues/563
  $goto

  const SORT_OPTIONS = [
    { key: "name", label: "Alphabetical" },
    { key: "updated", label: "Last edited" },
    { key: "status", label: "Status" },
  ]
  const SORT_STORAGE_KEY = "budibase:workspaceSort"

  export const hide = () => {
    workspaceMenu?.hide()
  }

  const dispatch = createEventDispatcher<{ create: void }>()

  export let open = false
  let sortOpen = false
  let workspaceMenu: ActionMenu | undefined
  let filter = ""
  let filterInput: HTMLInputElement | null = null
  let activeIndex = -1
  let itemEls: (HTMLElement | null)[] = []
  let selectedWorkspaceForMenu: EnrichedApp | null = null
  let appContextMenuModals:
    | {
        showDuplicateModal: () => void
        showExportDevModal: () => void
        showExportProdModal: () => void
        showDeleteModal: () => void
      }
    | undefined

  $: apps = $enrichedApps
  $: appId = $appStore.appId
  $: currentSort = $sortBy
  $: canManageWorkspaceCreation =
    !!$auth.user && sdk.users.canCreateApps($auth.user)
  $: showCreateWorkspace = canManageWorkspaceCreation && !$licensing.isFreePlan
  $: showUpgradeWorkspace = canManageWorkspaceCreation && $licensing.isFreePlan

  $: filtered = apps?.filter(app => matchesFilter(app.name, filter)) || []
  $: favourites = filtered.filter(app => app.favourite)
  $: nonFavourites = filtered.filter(app => !app.favourite)
  $: displayApps = [...favourites, ...nonFavourites]
  $: activeIndex = displayApps.findIndex(a => a.devId === appId)

  $: if (open && activeIndex >= 0) {
    itemEls[activeIndex]?.scrollIntoView({ block: "nearest" })
  }

  const navigateToWorkspace = (ws: EnrichedApp) => {
    contextMenuStore.close()
    const wsUrl = getWorkspaceUrl(ws)
    if (!ws.editable) {
      window.open(wsUrl, "_blank")
      return
    }
    if (appId === ws.devId) return
    bb.clearSettings()
    $goto(wsUrl)
  }

  const onFilterKeydown = (e: KeyboardEvent) => {
    const key = e.key
    const totalApps = displayApps.length
    if (!totalApps) return

    if (key === "ArrowDown") {
      e.preventDefault()
      activeIndex = (activeIndex + 1) % totalApps
    } else if (key === "ArrowUp") {
      e.preventDefault()
      activeIndex = (activeIndex - 1 + totalApps) % totalApps
    } else if (key === "Enter") {
      e.preventDefault()
      const app = displayApps[activeIndex]
      if (app) {
        navigateToWorkspace(app)
      }
    }
  }

  const getWorkspaceUrl = (app: EnrichedApp) => {
    return app.editable
      ? `/builder/workspace/${app.devId}/home`
      : `/app${app.url}`
  }

  const openWorkspaceContextMenu = (
    ws: EnrichedApp,
    position: { x: number; y: number }
  ) => {
    if (!ws.editable) {
      return
    }
    selectedWorkspaceForMenu = ws

    const items = getAppContextMenuItems({
      app: ws,
      onDuplicate: () => appContextMenuModals?.showDuplicateModal(),
      onExportDev: () => appContextMenuModals?.showExportDevModal(),
      onExportProd: () => appContextMenuModals?.showExportProdModal(),
      onDelete: () => appContextMenuModals?.showDeleteModal(),
    })

    contextMenuStore.open(`workspace-select-${ws.appId}`, items, {
      x: position.x,
      y: position.y,
    })
  }

  const openWorkspaceContextMenuFromMouse = (
    e: MouseEvent,
    ws: EnrichedApp
  ) => {
    if (!ws.editable) {
      return
    }
    e.preventDefault()
    e.stopPropagation()
    openWorkspaceContextMenu(ws, {
      x: e.clientX,
      y: e.clientY,
    })
  }

  const onWorkspaceItemKeydown = (
    e: KeyboardEvent,
    ws: EnrichedApp,
    itemEl: HTMLElement | null
  ) => {
    const isContextMenuKey = e.key === "ContextMenu"

    if (!isContextMenuKey || !itemEl || !ws.editable) {
      return
    }

    e.preventDefault()
    e.stopPropagation()
    const rect = itemEl.getBoundingClientRect()
    openWorkspaceContextMenu(ws, {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    })
  }

  const matchesFilter = (name: string, term: string) =>
    !term || name?.toLowerCase().includes(term.trim().toLowerCase())

  const onMenuOpen = () => {
    open = true
    setTimeout(() => filterInput?.focus(), 0)
  }

  const onMenuClose = () => {
    contextMenuStore.close()
    open = false
    sortOpen = false
  }

  const onSortSelect = async (key: string) => {
    try {
      localStorage.setItem(SORT_STORAGE_KEY, key)
    } catch (error) {
      console.error("Failed to save sort preference", error)
    }
    await appsStore.updateSort(key)
    setTimeout(() => filterInput?.focus(), 0)
  }

  const toggleFavourite = async (appId: string, isFavourite: boolean) => {
    const favourites = new Set($auth.user?.appFavourites || [])
    isFavourite ? favourites.add(appId) : favourites.delete(appId)

    try {
      await auth.updateSelf({ appFavourites: Array.from(favourites) })
    } catch (error) {
      console.error("Failed to update favourites", error)
    }
  }

  const formatLastEdited = (updatedAt?: string) => {
    if (!updatedAt) return "Updated just now"
    const elapsed = Date.now() - new Date(updatedAt).getTime()
    return processStringSync("Updated {{ duration time 'millisecond' }} ago", {
      time: elapsed,
    })
  }

  const getStatus = (app: EnrichedApp) => {
    return app.prodId ? "Published" : "Unpublished"
  }

  const getTitleText = (app: EnrichedApp) => {
    return `${app.name}\n${getStatus(app)}\n${formatLastEdited(app.updatedAt)}`
  }

  onMount(() => {
    try {
      const saved = localStorage.getItem(SORT_STORAGE_KEY)
      if (saved && saved !== currentSort) {
        appsStore.updateSort(saved)
      }
    } catch (error) {
      console.error("Failed to load sort preference", error)
    }
  })
</script>

<ActionMenu
  bind:this={workspaceMenu}
  disabled={false}
  roundedPopover
  on:open={onMenuOpen}
  on:close={onMenuClose}
>
  <svelte:fragment slot="control">
    <div class="workspace-menu" class:disabled={false}>
      <div
        role="button"
        tabindex="0"
        class="workspace-menu-text"
        title={$appStore.name}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span>{$appStore.name}</span>
        <Icon size="M" name={!open ? "caret-down" : "caret-up"} />
      </div>
    </div>
  </svelte:fragment>

  <div class="menu-item-header">
    <input
      bind:this={filterInput}
      class="filter"
      type="text"
      placeholder="Workspaces"
      bind:value={filter}
      aria-label="Filter workspaces"
      on:keydown={onFilterKeydown}
    />
    <div class="header-actions">
      {#if showCreateWorkspace}
        <Icon
          name="plus"
          size="M"
          hoverable
          tooltip="Create workspace"
          on:click={() => {
            dispatch("create")
            workspaceMenu?.hide()
          }}
        />
      {:else if showUpgradeWorkspace}
        <Icon
          name="plus"
          size="M"
          hoverable
          tooltip="Upgrade to unlock multiple workspaces"
          on:click={licensing.goToUpgradePage}
        />
      {:else}
        <div class="header-actions-spacer" aria-hidden="true"></div>
      {/if}
      <WorkspaceSortMenu
        {currentSort}
        options={SORT_OPTIONS}
        on:select={e => onSortSelect(e.detail)}
        bind:open={sortOpen}
      />
    </div>
  </div>

  <div class="app-items">
    {#each displayApps as ws, i (ws.devId)}
      {@const selected = appId === ws.devId}
      <span
        class="menu-item"
        class:selected
        class:favourite={ws.favourite}
        class:active={i === activeIndex}
        title={getTitleText(ws)}
        bind:this={itemEls[i]}
      >
        <MenuItem
          icon={selected ? "check" : undefined}
          on:click={() => {
            navigateToWorkspace(ws)
          }}
          on:contextmenu={e => openWorkspaceContextMenuFromMouse(e, ws)}
          on:keydown={e => onWorkspaceItemKeydown(e, ws, itemEls[i])}
          on:auxclick={e => {
            if (e.button !== 1) {
              return
            }
            window.open(getWorkspaceUrl(ws), "_blank")
          }}
        >
          {ws.name}
          <div slot="right" class="fav-slot">
            <div class="menu-item-error-status">
              {#if Object.keys(ws.automationErrors || {}).length}
                <StatusLight
                  color="var(--spectrum-global-color-static-red-600)"
                  size="M"
                />
              {/if}
            </div>
            <button
              type="button"
              class="fav-icon-button fav-icon"
              aria-label={ws.favourite
                ? "Remove from favourites"
                : "Add to favourites"}
              on:click={e => {
                e.stopPropagation()
                e.preventDefault()
                toggleFavourite(ws.appId, !ws.favourite)
              }}
            >
              <Icon
                name="star"
                size="XS"
                weight={ws.favourite ? "fill" : "regular"}
                color={ws.favourite
                  ? "var(--spectrum-global-color-yellow-1000)"
                  : "var(--spectrum-global-color-gray-700)"}
                hoverColor={ws.favourite
                  ? "var(--spectrum-global-color-yellow-700)"
                  : "var(--spectrum-global-color-gray-900)"}
                hoverable
              />
            </button>
          </div>
        </MenuItem>
      </span>
    {/each}
  </div>
</ActionMenu>

{#if selectedWorkspaceForMenu}
  <AppContextMenuModals
    app={selectedWorkspaceForMenu}
    bind:this={appContextMenuModals}
  />
{/if}

<style>
  .app-items {
    max-height: 500px;
    width: 280px;
    overflow: auto;
  }
  .menu-item :global(.spectrum-Menu-item) {
    width: 100%;
  }
  .menu-item.active :global(.spectrum-Menu-item) {
    background: var(--spectrum-global-color-gray-200);
    border-radius: var(--border-radius-s);
  }
  .menu-item :global(.spectrum-Menu-itemLabel) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .menu-item :global(.spectrum-Menu-item .icon),
  .menu-item :global(.spectrum-Menu-item .keys) {
    flex: 0 0 24px;
    margin: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .menu-item :global(.spectrum-Menu-item .icon) {
    order: 1;
  }
  .menu-item :global(.spectrum-Menu-item .keys) {
    order: 2;
  }

  .fav-slot {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
  }
  .fav-icon-button {
    background: transparent;
    border: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 0;
  }

  .menu-item :global(.fav-icon) {
    opacity: 0;
    transition: opacity 130ms ease-in-out;
  }
  .menu-item.selected :global(.fav-icon),
  .menu-item:hover :global(.fav-icon),
  .menu-item.favourite :global(.fav-icon) {
    opacity: 1;
  }

  .workspace-menu {
    font-size: var(--font-size-l);
    display: flex;
    align-items: center;
    background: var(--spectrum-global-color-gray-200);
    border-radius: 6px;
    justify-content: space-between;
    cursor: pointer;
    transition: background-color 130ms ease-in-out;
  }
  .workspace-menu.disabled {
    background: var(--spectrum-global-color-gray-400);
    color: var(--spectrum-global-color-gray-600);
    cursor: default;
    opacity: 0.8;
  }
  .workspace-menu-text {
    padding: var(--spacing-s) var(--spacing-m);
    display: flex;
    gap: var(--spacing-s);
    align-items: center;
    font-size: 13px;
    flex: 1 1 0;
    min-width: 0;
    overflow: hidden;
    box-sizing: border-box;
    justify-content: space-between;
  }
  .workspace-menu-text span {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .workspace-menu-text :global(i) {
    font-size: 14px;
    width: 14px;
    height: 14px;
  }
  .workspace-menu-text:hover {
    border-radius: 6px 0 0 6px;
  }
  .workspace-menu.disabled .workspace-menu-text:hover {
    border-radius: 0;
  }

  .menu-item-header {
    display: flex;
    justify-content: space-between;
    padding: var(--spectrum-listitem-padding-y)
      var(--spectrum-listitem-padding-right) var(--spectrum-listitem-padding-y)
      var(--spectrum-listitem-padding-left);
  }
  .menu-item-header div {
    color: var(--spectrum-global-color-gray-700);
  }
  .menu-item-header .filter {
    flex: 1 1 auto;
    margin-right: var(--spacing-s);
    border: none;
    outline: none;
    background: transparent;
    color: var(--spectrum-global-color-gray-900);
    width: 100px;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
  }
  .header-actions > :global(*),
  .header-actions-spacer {
    width: 24px;
    height: 24px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }

  .menu-item-error-status {
    width: 16px !important;
    height: 18px;
  }
</style>
