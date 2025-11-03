<script lang="ts">
  import {
    Context,
    Icon,
    Body,
    Link,
    Divider,
    Modal,
    PopoverAlignment,
    TooltipPosition,
    TooltipType,
    notifications,
    StatusLight,
  } from "@budibase/bbui"
  import { createLocalStorageStore, derivedMemo } from "@budibase/frontend-core"
  import { url, goto, isActive } from "@roxi/routify"
  import BBLogo from "assets/BBLogo.svelte"
  import {
    appStore,
    builderStore,
    workspaceFavouriteStore,
    workspaceAppStore,
    automationStore,
    datasources,
    tables,
    queries,
    viewsV2,
  } from "@/stores/builder"
  import FavouriteResourceButton from "@/pages/builder/_components/FavouriteResourceButton.svelte"
  import {
    appsStore,
    featureFlags,
    licensing,
    enrichedApps,
  } from "@/stores/portal"
  import SideNavLink from "./SideNavLink.svelte"
  import SideNavUserSettings from "./SideNavUserSettings.svelte"
  import { onDestroy, setContext } from "svelte"
  import {
    type Datasource,
    type Query,
    type Table,
    type UIAutomation,
    type UIInternalDatasource,
    type UIWorkspaceApp,
    type ViewV2,
    type WorkspaceFavourite,
    PublishResourceState,
    WorkspaceResource,
  } from "@budibase/types"
  import { derived, get, type Readable } from "svelte/store"
  import { IntegrationTypes } from "@/constants/backend"
  import { bb } from "@/stores/bb"
  import WorkspaceSelect from "@/components/common/WorkspaceSelect.svelte"
  import CreateWorkspaceModal from "../CreateWorkspaceModal.svelte"
  import HelpMenu from "@/components/common/HelpMenu.svelte"
  import { buildLiveUrl } from "@/helpers/urls"
  import { type EnrichedApp } from "@/types"

  export const show = () => {
    pinned.set(true)
  }

  $: automationErrors = getAutomationErrors($enrichedApps || [], appId)
  $: automationErrorCount = Object.keys(automationErrors).length
  $: backupErrors = getBackupErrors($enrichedApps || [], appId)
  $: backupErrorCount = Object.keys(backupErrors).length

  const getAutomationErrors = (apps: EnrichedApp[], appId: string) => {
    const target = apps.find(app => app.devId === appId)
    return target?.automationErrors || {}
  }

  const getBackupErrors = (apps: EnrichedApp[], appId: string) => {
    const target = apps.find(app => app.devId === appId)
    return target?.backupErrors || {}
  }

  type ResourceLinkFn = (_id: string) => string

  interface UIFavouriteResource {
    name: string
    icon: string
    workspaceApp?: UIWorkspaceApp
  }
  interface AllResourceStores {
    automations: UIAutomation[]
    apps: UIWorkspaceApp[]
    datasources: (Datasource | UIInternalDatasource)[]
    tables: Table[]
    queries: Query[]
    views: ViewV2[]
  }

  setContext(Context.PopoverRoot, ".nav .popover-container")

  // Default icon mapping
  const ResourceIcons: Record<WorkspaceResource, string> = {
    [WorkspaceResource.AUTOMATION]: "path",
    [WorkspaceResource.DATASOURCE]: "plugs-connected",
    [WorkspaceResource.TABLE]: "table",
    [WorkspaceResource.WORKSPACE_APP]: "browser",
    [WorkspaceResource.QUERY]: "database", // regular db queries
    [WorkspaceResource.VIEW]: "table",
  }

  const datasourceLookup = datasources.lookup
  const favouriteLookup = workspaceFavouriteStore.lookup
  const pinned = createLocalStorageStore("builder-nav-pinned", true)
  const navLogoSize = 20

  let ignoreFocus = false
  let focused = false
  let timeout: ReturnType<typeof setTimeout> | undefined
  let resourceLookup: Readable<Record<string, UIFavouriteResource>> | null =
    null
  let workspaceSelect: WorkspaceSelect | undefined
  let createWorkspaceModal: Modal | undefined
  let workspaceMenuOpen = false

  $: appId = $appStore.appId
  $: !$pinned && unPin()

  // keep sidebar expanded when workspace selector is open
  $: collapsed = !focused && !$pinned && !workspaceMenuOpen
  // keep sidebar expanded when selector is open, even if mouse leaves
  $: navFocused = focused || workspaceMenuOpen

  // Ensure the workspaceSelect closes if the sidebar is hidden
  $: if (collapsed && workspaceSelect) {
    workspaceSelect.hide()
  }

  // Hide the picker if the user cannot see it
  $: canSelectWorkspace = !$licensing.isFreePlan || $appsStore.apps.length > 1

  $: if (!canSelectWorkspace) {
    workspaceMenuOpen = false
  }

  // Ignore resources without names
  $: favourites = $workspaceFavouriteStore
    .filter(f => $resourceLookup?.[f.resourceId])
    .sort((a, b) => a.resourceId.localeCompare(b.resourceId))

  const initResourceStores = (): Readable<AllResourceStores> =>
    derived(
      [
        automationStore,
        workspaceAppStore,
        datasources,
        tables,
        queries,
        viewsV2,
        workspaceFavouriteStore,
      ],
      ([$automations, $apps, $datasources, $tables, $queries, $views]) => ({
        automations: $automations.automations,
        apps: $apps.workspaceApps,
        datasources: $datasources.list,
        tables: $tables.list,
        queries: $queries.list,
        views: $views.list,
      })
    )

  type ResourceItem = AllResourceStores[keyof AllResourceStores][number]

  const getResourceId = (item: ResourceItem) => {
    if ("_id" in item && typeof item._id === "string") {
      return item._id
    }
    if ("id" in item && typeof item.id === "string") {
      return item.id
    }
  }

  const hasName = (
    item: ResourceItem
  ): item is ResourceItem & { name: string } =>
    "name" in item && typeof item.name === "string"

  const isQueryResource = (item: ResourceItem): item is Query =>
    "datasourceId" in item && typeof item.datasourceId === "string"

  const generateResourceLookup = (
    allResourceStores: Readable<AllResourceStores>
  ) => {
    return derivedMemo(allResourceStores, stores => {
      const lookup: Record<string, UIFavouriteResource> = {}
      const favourites = get(favouriteLookup)
      const datasourceMap = get(datasourceLookup)

      for (const key of Object.keys(stores) as Array<keyof AllResourceStores>) {
        const resources = stores[key] as ResourceItem[]
        for (const resource of resources) {
          const id = getResourceId(resource)
          if (!id) {
            continue
          }

          const favourite = favourites[id]
          if (!favourite || !hasName(resource)) {
            continue
          }

          const isRestQuery =
            favourite.resourceType === WorkspaceResource.QUERY &&
            isQueryResource(resource) &&
            datasourceMap[resource.datasourceId]?.source ===
              IntegrationTypes.REST

          const entry: UIFavouriteResource = {
            name: resource.name,
            icon: isRestQuery ? "globe" : ResourceIcons[favourite.resourceType],
          }

          if (favourite.resourceType === WorkspaceResource.WORKSPACE_APP) {
            const workspaceApp = stores.apps.find(app => app._id === id)
            if (workspaceApp) {
              entry.workspaceApp = workspaceApp
            }
          }

          lookup[id] = entry
        }
      }

      return lookup
    })
  }

  // None of this needs to be done if the side bar is closed
  const initFavourites = () => {
    const stores = initResourceStores()
    resourceLookup = generateResourceLookup(stores)
  }

  const resourceLink = (favourite: WorkspaceFavourite) => {
    const appPrefix = `/builder/workspace/${appId}`
    const link: Record<WorkspaceResource, ResourceLinkFn> = {
      [WorkspaceResource.AUTOMATION]: (id: string) =>
        `${appPrefix}/automation/${id}`,
      [WorkspaceResource.DATASOURCE]: (id: string) =>
        `${appPrefix}/data/datasource/${id}`,
      [WorkspaceResource.TABLE]: (id: string) =>
        `${appPrefix}/data/table/${id}`,
      [WorkspaceResource.WORKSPACE_APP]: (id: string) => {
        const wsa = $workspaceAppStore.workspaceApps.find(
          (app: UIWorkspaceApp) => app._id === id
        )
        if (!wsa) {
          notifications.error("Could not resolve the workspace app URL")
          return ""
        }
        return `${appPrefix}/design/${wsa.screens[0]?._id}`
      },
      [WorkspaceResource.QUERY]: (id: string) =>
        `${appPrefix}/data/query/${id}`,
      [WorkspaceResource.VIEW]: (id: string) => {
        const view = $viewsV2.list.find(v => v.id === id)
        return `${appPrefix}/data/table/${view?.tableId}/${id}`
      },
    }
    if (!link[favourite.resourceType]) return null
    return link[favourite.resourceType]?.(favourite.resourceId)
  }

  const buildLiveWorkspaceAppUrl = (workspaceApp?: UIWorkspaceApp) => {
    if (!workspaceApp) {
      return null
    }

    const liveUrl = buildLiveUrl($appStore, workspaceApp.url ?? "", true)

    return liveUrl || null
  }

  const getFavouriteResourceLookup = (
    favourite: WorkspaceFavourite
  ): UIFavouriteResource => {
    return (
      $resourceLookup?.[favourite.resourceId] ?? {
        name: favourite.resourceId,
        icon:
          ResourceIcons[favourite.resourceType] ??
          ResourceIcons[WorkspaceResource.TABLE],
      }
    )
  }

  const openLiveWorkspaceApp = (liveUrl?: string | null) => {
    if (!liveUrl) {
      notifications.error("Could not resolve live workspace app URL")
      return
    }
    window.open(liveUrl, "_blank")
  }

  const unPin = () => {
    // We need to ignore pointer events for a while since otherwise we would
    // instantly trigger a mouseenter and show it again
    ignoreFocus = true
    focused = false
    timeout = setTimeout(() => {
      ignoreFocus = false
    }, 130)
  }

  const setFocused = (nextFocused: boolean) => {
    if (ignoreFocus) {
      return
    }
    if (!focused && !resourceLookup) {
      initFavourites()
    }
    focused = nextFocused
  }

  const keepCollapsed = () => {
    if (!$pinned) {
      unPin()
    }
  }

  onDestroy(() => {
    clearTimeout(timeout)
  })
</script>

<Modal bind:this={createWorkspaceModal}>
  <CreateWorkspaceModal />
</Modal>

<div class="nav_wrapper" style={`--nav-logo-width: ${navLogoSize}px;`}>
  <div class="nav_spacer" class:pinned={$pinned} />
  <div
    class="nav"
    class:pinned={$pinned}
    class:focused={navFocused}
    role="tooltip"
    on:mouseenter={() => setFocused(true)}
    on:mouseleave={() => setFocused(false)}
  >
    <div class="nav_header">
      <div>
        <BBLogo
          color={"var(--spectrum-global-color-gray-900)"}
          size={navLogoSize}
        />
      </div>

      <div class="nav-title">
        {#if canSelectWorkspace}
          <WorkspaceSelect
            bind:this={workspaceSelect}
            bind:open={workspaceMenuOpen}
            on:create={() => {
              createWorkspaceModal?.show()
              setFocused(false)
            }}
          />
        {:else}
          <h1>{$appStore.name}</h1>
        {/if}
      </div>
      <Icon
        name="sidebar-simple"
        hoverable
        on:click={() => pinned.set(!$pinned)}
      />
    </div>

    <div class="nav_body">
      <div class="links core">
        {#if appId}
          <div>
            <SideNavLink
              icon="browser"
              text="Apps"
              url={$url("./design")}
              {collapsed}
              on:click={keepCollapsed}
            />
            <span class="root-nav" class:selected={$isActive("./automation")}>
              {#if collapsed && automationErrorCount}
                <span class="status-indicator">
                  <StatusLight
                    color="var(--spectrum-global-color-static-red-600)"
                    size="M"
                  />
                </span>
              {/if}
              <SideNavLink
                icon="path"
                text="Automations"
                url={$url("./automation")}
                {collapsed}
                on:click={keepCollapsed}
              >
                <svelte:fragment slot="right">
                  {#if automationErrorCount}
                    <StatusLight
                      color="var(--spectrum-global-color-static-red-600)"
                      size="M"
                    />
                  {/if}
                </svelte:fragment>
              </SideNavLink>
            </span>

            <SideNavLink
              icon="database"
              text="Data"
              url={$url("./data")}
              {collapsed}
              on:click={keepCollapsed}
            />
            <!-- <SideNavLink
          icon="webhooks-logo"
          text="APIs"
          url={$url("./data")}
          {collapsed}
          on:click={keepCollapsed}
        />
        <SideNavLink
          icon="sparkle"
          text="AI"
          url={$url("./data")}
          {collapsed}
          on:click={keepCollapsed}
        />
        <SideNavLink
          icon="paper-plane-tilt"
          text="Email"
          url={$url("./data")}
          {collapsed}
          on:click={keepCollapsed}
        /> -->
            {#if $featureFlags.AI_AGENTS}
              <SideNavLink
                icon="cpu"
                text="Agent"
                url={$url("./agent")}
                {collapsed}
                on:click={keepCollapsed}
              />
            {/if}
          </div>
          <Divider size="S" />
          <div class="favourite-wrapper">
            <div class="favourite-title">
              <Body color="var(--spectrum-global-color-gray-700)" size="XS">
                FAVOURITES
              </Body>
            </div>
            {#if !favourites?.length || !resourceLookup}
              <div class="favourite-empty-state">
                <div>
                  <Icon name="star" size="L" color="#6A9BCC" weight="fill" />
                </div>
                <Body
                  color="var(--spectrum-global-color-gray-700)"
                  size="XS"
                  textAlign="center"
                >
                  You have no favorites yet! Favourite an automation, app, table
                  or API for quicker access.
                </Body>
                <Link
                  href="https://docs.budibase.com/docs/favouriting-in-a-workspace"
                  target="_blank"
                  secondary
                  quiet
                >
                  Learn how
                </Link>
              </div>
            {:else}
              <div class="favourite-links">
                {#each favourites as favourite}
                  {@const lookup = getFavouriteResourceLookup(favourite)}
                  {@const workspaceApp = lookup.workspaceApp}
                  {@const showLiveLink =
                    favourite.resourceType ===
                      WorkspaceResource.WORKSPACE_APP &&
                    workspaceApp &&
                    workspaceApp.publishStatus?.state ===
                      PublishResourceState.PUBLISHED &&
                    !workspaceApp.disabled}
                  {@const liveUrl =
                    showLiveLink && workspaceApp
                      ? buildLiveWorkspaceAppUrl(workspaceApp)
                      : null}
                  <div class="link">
                    <SideNavLink
                      icon={lookup?.icon}
                      text={lookup?.name}
                      {collapsed}
                      on:click={() => {
                        const targetLink = resourceLink(favourite)
                        if (targetLink) $goto(targetLink)
                        keepCollapsed()
                      }}
                    >
                      <div slot="actions">
                        <div class="action-buttons">
                          {#if liveUrl}
                            <button
                              type="button"
                              class="live-app-link"
                              aria-label="View live app"
                              on:click|stopPropagation|preventDefault={() =>
                                openLiveWorkspaceApp(liveUrl)}
                            >
                              <Icon
                                name="globe-simple"
                                size="S"
                                hoverable
                                color="#fff"
                                hoverColor="#fff"
                                tooltip="View live app"
                                tooltipType={TooltipType.Info}
                                tooltipPosition={TooltipPosition.Top}
                              />
                            </button>
                          {/if}
                          <FavouriteResourceButton {favourite} />
                        </div>
                      </div>
                    </SideNavLink>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        {/if}
      </div>

      <div class="links">
        <span class="root-nav" class:error={backupErrorCount}>
          {#if collapsed && backupErrorCount}
            <span class="status-indicator">
              <StatusLight
                color="var(--spectrum-global-color-static-red-600)"
                size="M"
              />
            </span>
          {/if}
          <SideNavLink
            icon="gear"
            text="Settings"
            {collapsed}
            on:click={() => {
              bb.settings()
              keepCollapsed()
            }}
          >
            <svelte:fragment slot="right">
              {#if backupErrorCount}
                <StatusLight
                  color="var(--spectrum-global-color-static-red-600)"
                  size="M"
                />
              {/if}
            </svelte:fragment>
          </SideNavLink>
        </span>
        {#if $appStore.appId}
          <SideNavLink
            icon="user-plus"
            text="Invite member"
            on:click={() => {
              builderStore.showBuilderSidePanel()
              keepCollapsed()
            }}
            {collapsed}
          />
        {/if}
        <HelpMenu align={PopoverAlignment.RightOutside} let:open>
          <SideNavLink
            icon={"question"}
            text={"Help"}
            {collapsed}
            forceActive={open}
          />
        </HelpMenu>
        <SideNavUserSettings {collapsed} />
      </div>
      <div class="popover-container"></div>
    </div>
  </div>
</div>

<style>
  .status-indicator {
    position: absolute;
    top: -10px;
    z-index: 3;
    right: -6px;
  }

  .root-nav.error .status-indicator :global(.spectrum-StatusLight::before) {
    border: unset;
  }

  .root-nav {
    position: relative;
  }
  .root-nav :global(.custom-icon .spectrum-Avatar) {
    line-height: 0.8em;
  }

  .root-nav:not(.selected) .status-indicator {
    top: -5px;
    right: -5px;
  }

  .nav_wrapper {
    display: contents;
    --nav-padding: 12px;
    --nav-collapsed-width: calc(
      var(--nav-logo-width) + var(--nav-padding) * 2 + 2px
    );
    --nav-width: 240px;
    --nav-border: 1px solid var(--spectrum-global-color-gray-200);
  }
  /* Spacer to allow nav to always be absolutely positioned */
  .nav_spacer {
    flex: 0 0 var(--nav-collapsed-width);
  }
  .nav_spacer.pinned {
    display: none;
  }

  .nav {
    background: var(--background-alt);
    position: absolute;
    width: var(--nav-collapsed-width);
    top: 0;
    left: 0;
    z-index: 2;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    border-right: var(--nav-border);
    transition: width 130ms ease-out;
    overflow: hidden;
    padding-bottom: var(--nav-padding);
    container-type: inline-size;
  }
  .nav:not(.pinned).focused {
    width: var(--nav-width);
  }
  .nav.pinned {
    position: relative;
    flex: 0 0 var(--nav-width);
    width: var(--nav-width);
  }

  .nav_header {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex: 0 0 50px;
    padding: 0 var(--nav-padding);
    gap: var(--spacing-m);
    border-bottom: var(--nav-border);
    color: var(--spectrum-global-color-gray-800);
  }
  .nav_header > div :global(> svg) {
    display: grid;
    place-items: center;
    transition: filter 130ms ease-out;
  }
  .nav:not(.pinned):not(.focused) .nav-title {
    opacity: 0;
  }

  .nav-title {
    max-width: 100%;
    min-width: 0;
    width: 0;
    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    transition: opacity 130ms ease-out;
    color: var(--spectrum-global-color-gray-900);
  }

  .nav-title :global(> div) {
    width: 100%;
    min-width: 0;
    overflow: hidden;
  }

  .nav-title h1 {
    font-size: 16px;
    font-weight: 500;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin: 0;
    padding: 0;
    overflow: hidden;
    color: var(--spectrum-global-color-gray-900);
  }

  .nav_body {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: space-between;
    flex: 1 1 auto;
    padding: var(--nav-padding) 0;
    gap: 3px;
    min-height: 0;
  }

  .popover-container {
    position: absolute;
  }

  .links {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding: 0 calc(var(--nav-padding) / 2);
    gap: 4px;
  }

  .links.core {
    flex: 1;
    min-height: 0;
    overflow: hidden;
    flex: 1 1 auto;
  }

  .favourite-links {
    flex: 1;
    overflow: auto;
    min-height: 0;
  }

  .favourite-wrapper {
    display: flex;
    flex-direction: column;
    color: var(--spectrum-global-color-gray-800);
    flex: 1;
    overflow: hidden;
    flex: 1 1 auto;
  }

  .favourite-title {
    padding: 0 calc(var(--nav-padding) / 2);
    margin-bottom: 8px;
  }
  .favourite-empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px dashed var(--spectrum-global-color-gray-200);
    border-radius: 12px;
    padding: 12px;
    gap: 8px;
    transition: all 130ms ease-out;
  }

  .live-app-link {
    border: none;
    background: none;
    padding: 0;
    display: inline-flex;
    align-items: center;
    cursor: pointer;
  }

  .action-buttons {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  @container (max-width: 239px) {
    .favourite-wrapper {
      display: none;
      transition: all 130ms ease-in-out;
    }
    .favourite-title {
      display: all 130ms ease-in-out;
    }
    .favourite-empty-state {
      display: all 130ms ease-in-out;
    }
  }
</style>
