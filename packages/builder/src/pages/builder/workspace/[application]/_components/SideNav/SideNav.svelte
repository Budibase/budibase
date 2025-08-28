<script lang="ts">
  import { Context, Icon, Body, Link, Divider } from "@budibase/bbui"
  import { createLocalStorageStore, derivedMemo } from "@budibase/frontend-core"
  import { url, goto } from "@roxi/routify"
  import BBLogo from "assets/bb-emblem.svg"
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
  import FavouriteResourceButton from "@/pages/builder/portal/_components/FavouriteResourceButton.svelte"
  import { featureFlags } from "@/stores/portal"
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
    WorkspaceResource,
  } from "@budibase/types"
  import { derived, type Readable } from "svelte/store"
  import { IntegrationTypes } from "@/constants/backend"

  type ResourceLinkFn = (_id: string) => string

  interface UIFavouriteResource {
    name: string
    icon: string
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

  const datasourceLookup = datasources.lookup
  const favouriteLookup = workspaceFavouriteStore.lookup
  const pinned = createLocalStorageStore("builder-nav-pinned", true)

  let allResourceStores: Readable<AllResourceStores> | null = null
  let resourceLookup: Readable<Record<string, UIFavouriteResource>> | null =
    null

  // Default icon mapping
  const ResourceIcons: Record<WorkspaceResource, string> = {
    [WorkspaceResource.AUTOMATION]: "path",
    [WorkspaceResource.DATASOURCE]: "plugs-connected",
    [WorkspaceResource.TABLE]: "table",
    [WorkspaceResource.WORKSPACE_APP]: "browser",
    [WorkspaceResource.QUERY]: "database", // regular db queries
    [WorkspaceResource.VIEW]: "table",
  }

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

  const generateResourceLookup = (
    allResourceStores: Readable<AllResourceStores>
  ) => {
    return derivedMemo(allResourceStores, stores => {
      const lookup: Record<string, UIFavouriteResource> = {}

      Object.values(stores)
        .flat()
        .forEach(item => {
          const id = (item as any)._id ?? (item as any).id
          const favourite = $favouriteLookup[id]

          // The only exception for the icons is the REST query icon
          let isRestQuery = false
          if (
            "datasourceId" in item &&
            favourite?.resourceType === WorkspaceResource.QUERY
          ) {
            const dataSource = $datasourceLookup[item.datasourceId]
            isRestQuery =
              dataSource && dataSource.source === IntegrationTypes.REST
          }

          if (id && item.name) {
            lookup[id] = {
              name: item.name,
              icon: isRestQuery
                ? "globe"
                : ResourceIcons[favourite?.resourceType],
            }
          }
        })

      return lookup
    })
  }

  // None of this needs to be done if the side bar is closed
  const initFavourites = () => {
    allResourceStores = initResourceStores()
    resourceLookup = generateResourceLookup(allResourceStores)
  }

  let ignoreFocus = false
  let focused = false
  let timeout: ReturnType<typeof setTimeout> | undefined

  $: appId = $appStore.appId
  $: collapsed = !focused && !$pinned
  $: !$pinned && unPin()

  // Ignore resources without names
  $: favourites = $workspaceFavouriteStore
    .filter(f => $resourceLookup?.[f.resourceId])
    .sort((a, b) => a.resourceId.localeCompare(b.resourceId))

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
          console.error("Could not resolve the workspace app URL")
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

<div class="nav_wrapper">
  <div class="nav_spacer" class:pinned={$pinned} />
  <div
    class="nav"
    class:pinned={$pinned}
    class:focused
    role="tooltip"
    on:mouseenter={() => setFocused(true)}
    on:mouseleave={() => setFocused(false)}
  >
    <div class="nav_header">
      <a href={$url("/builder/portal/workspaces")}>
        <img src={BBLogo} alt="Budibase logo" />
      </a>
      <div class="nav_title">
        <h1>{$appStore.name}</h1>
      </div>
      <Icon
        name="sidebar-simple"
        hoverable
        on:click={() => pinned.set(!$pinned)}
      />
    </div>

    <div class="nav_body">
      <div class="links core">
        <div>
          <SideNavLink
            icon="browser"
            text="Apps"
            url={$url("./design")}
            {collapsed}
            on:click={keepCollapsed}
          />
          <SideNavLink
            icon="path"
            text="Automations"
            url={$url("./automation")}
            {collapsed}
            on:click={keepCollapsed}
          />
          <!-- <Divider size="S" /> -->
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
          <SideNavLink
            icon="gear"
            text="Settings"
            url={$url("./settings")}
            {collapsed}
            on:click={keepCollapsed}
          />
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
                quiet>Learn how</Link
              >
            </div>
          {:else}
            <div class="favourite-links">
              {#each favourites as favourite}
                {@const lookup = $resourceLookup?.[favourite.resourceId] ?? {
                  name: favourite.resourceId,
                  icon: undefined,
                }}
                <div class="link" title={lookup?.name}>
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
                      <FavouriteResourceButton {favourite} />
                    </div>
                  </SideNavLink>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </div>
      <div class="links">
        <SideNavLink
          icon="user-plus"
          text="Invite member"
          on:click={() => {
            builderStore.showBuilderSidePanel()
            keepCollapsed()
          }}
          {collapsed}
        />
        <SideNavLink
          icon="book"
          text="Documentation"
          url="https://docs.budibase.com"
          target="_blank"
          on:click={() => {
            keepCollapsed()
          }}
          {collapsed}
        />
        <SideNavUserSettings {collapsed} />
      </div>
      <div class="popover-container"></div>
    </div>
  </div>
</div>

<style>
  .nav_wrapper {
    display: contents;
    --nav-logo-width: 20px;
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

  /* Main nav*/
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
  /* Header */
  .nav_header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex: 0 0 50px;
    padding: 0 var(--nav-padding);
    gap: var(--spacing-m);
    border-bottom: var(--nav-border);
    color: var(--spectrum-global-color-gray-800);
  }
  .nav_header a {
    display: grid;
    place-items: center;
    transition: filter 130ms ease-out;
  }
  .nav_header a:hover {
    cursor: pointer;
    filter: brightness(1.2);
  }
  .nav_header img {
    width: var(--nav-logo-width);
  }
  .nav_title {
    width: 0;
    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 4px;
    transition: color 130ms ease-out;
    color: var(--spectrum-global-color-gray-800);
  }
  .nav_title h1 {
    font-size: 16px;
    font-weight: 500;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin: 0;
    padding: 0;
    overflow: hidden;
    color: var(--spectrum-global-color-gray-900);
  }

  /* Body */
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

  /* Popover container */
  .popover-container {
    position: absolute;
  }

  /*  Links */
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

  /*  favourite section */
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
