<script lang="ts">
  import {
    Context,
    ActionMenu,
    Icon,
    Body,
    Link,
    MenuItem,
    Modal,
    type ModalAPI,
    PopoverAlignment,
    TooltipPosition,
    TooltipType,
    notifications,
    StatusLight,
    Tag,
  } from "@budibase/bbui"
  import { createLocalStorageStore, derivedMemo } from "@budibase/frontend-core"
  import { url, goto, isActive } from "@roxi/routify"
  import BBLogo from "assets/BBLogo.svelte"
  import {
    appStore,
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
    agentsStore,
  } from "@/stores/portal"
  import SideNavLink from "./SideNavLink.svelte"
  import SideNavUserSettings from "./SideNavUserSettings.svelte"
  import { onDestroy, onMount, setContext } from "svelte"
  import {
    FeatureFlag,
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
  import { DISCORD_URL, DOCUMENTATION_URL, SUPPORT_EMAIL } from "@/constants"
  import { API } from "@/api"
  import { bb } from "@/stores/bb"
  import WorkspaceSelect from "@/components/common/WorkspaceSelect.svelte"
  import CreateWorkspaceModal from "../CreateWorkspaceModal.svelte"
  import { buildLiveUrl } from "@/helpers/urls"
  import { type EnrichedApp } from "@/types"
  import CreateAutomationModal from "@/components/automation/AutomationPanel/CreateAutomationModal.svelte"
  import CreateWebhookModal from "@/components/automation/Shared/CreateWebhookModal.svelte"
  import AgentModal from "@/pages/builder/workspace/[application]/agent/AgentModal.svelte"
  import WorkspaceAppModal from "@/pages/builder/workspace/[application]/design/[workspaceAppId]/[screenId]/_components/WorkspaceApp/WorkspaceAppModal.svelte"
  import CreateTableModal from "@/components/backend/TableNavigator/modals/CreateTableModal.svelte"

  export const show = () => {
    pinned.set(true)
  }

  $: automationErrors = getAutomationErrors($enrichedApps || [], workspaceId)
  $: automationErrorCount = Object.keys(automationErrors).length
  $: backupErrors = getBackupErrors($enrichedApps || [], workspaceId)
  $: backupErrorCount = Object.keys(backupErrors).length

  const getAutomationErrors = (apps: EnrichedApp[], workspaceId: string) => {
    const target = apps.find(app => app.devId === workspaceId)
    return target?.automationErrors || {}
  }

  const getBackupErrors = (apps: EnrichedApp[], workspaceId: string) => {
    const target = apps.find(app => app.devId === workspaceId)
    return target?.backupErrors || {}
  }

  $goto
  $url

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
    [WorkspaceResource.AGENT]: "cpu",
  }

  const datasourceLookup = datasources.lookup
  const favouriteLookup = workspaceFavouriteStore.lookup
  const pinned = createLocalStorageStore("builder-nav-pinned", true)
  const navLogoSize = 18

  let ignoreFocus = false
  let focused = false
  let timeout: ReturnType<typeof setTimeout> | undefined
  let resourceLookup: Readable<Record<string, UIFavouriteResource>> | null =
    null
  let workspaceSelect: WorkspaceSelect | undefined
  let createWorkspaceModal: Modal | undefined
  let workspaceMenuOpen = false
  let createMenuOpen = false

  let createAutomationModal: ModalAPI
  let webhookModal: ModalAPI
  let workspaceAppModal: WorkspaceAppModal
  let agentModal: AgentModal
  let createTableModal: ModalAPI
  let tableName = ""

  let githubStars: number | null = null

  const formatStars = (stars: number) => {
    return new Intl.NumberFormat("en", {
      notation: "compact",
      maximumFractionDigits: 1,
      compactDisplay: "short",
    })
      .format(stars)
      .toLowerCase()
  }

  $: githubStarsText =
    githubStars != null
      ? `${formatStars(githubStars)} GitHub stars`
      : "25k+ GitHub stars"

  onMount(async () => {
    try {
      const response = await API.workspaceHome.getGitHubStars()
      githubStars = response.stars
    } catch (err) {
      console.error("Failed to load GitHub stars", err)
    }
  })

  $: workspaceId = $appStore.appId
  $: !$pinned && unPin()

  // keep sidebar expanded when workspace selector is open
  $: collapsed = !focused && !$pinned && !workspaceMenuOpen && !createMenuOpen
  // keep sidebar expanded when selector is open, even if mouse leaves
  $: navFocused = focused || workspaceMenuOpen || createMenuOpen

  // if sidebar pinned open, initialise without requiring a mouse hover.
  $: if (!collapsed && !resourceLookup) {
    initFavourites()
  }

  const goToCreate = (target: string) => {
    if (!workspaceId) {
      return
    }

    const prefix = `/builder/workspace/${workspaceId}`
    const normalisedTarget = target.startsWith("/")
      ? target
      : `${prefix}/${target.replace(/^\.\//, "")}`

    $goto(normalisedTarget)
    keepCollapsed()
  }

  const openCreateAutomation = () => {
    createAutomationModal?.show()
    keepCollapsed()
  }

  const openCreateApp = () => {
    workspaceAppModal?.show()
    keepCollapsed()
  }

  const openCreateAgent = () => {
    agentModal?.show()
    keepCollapsed()
  }

  const handleTableSave = async (table: Table) => {
    if (!workspaceId) {
      return
    }
    notifications.success("Table created successfully")
    $goto(`/builder/workspace/${workspaceId}/data/table/${table._id}`)
  }

  const openCreateTable = () => {
    tableName = ""
    createTableModal?.show()
    keepCollapsed()
  }

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
        agentsStore,
        workspaceFavouriteStore,
      ],
      ([
        $automations,
        $apps,
        $datasources,
        $tables,
        $queries,
        $views,
        $agents,
      ]) => ({
        automations: $automations.automations,
        apps: $apps.workspaceApps,
        datasources: $datasources.list,
        tables: $tables.list,
        queries: $queries.list,
        views: $views.list,
        agents: $agents.agents,
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
            icon: isRestQuery
              ? "webhooks-logo"
              : ResourceIcons[favourite.resourceType],
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
    const workspacePrefix = `/builder/workspace/${workspaceId}`
    const link: Record<WorkspaceResource, ResourceLinkFn> = {
      [WorkspaceResource.AUTOMATION]: (id: string) =>
        `${workspacePrefix}/automation/${id}`,
      [WorkspaceResource.DATASOURCE]: (id: string) => {
        const datasourceMap = get(datasourceLookup) || {}
        const datasource = datasourceMap[id]
        const basePath =
          datasource?.source === IntegrationTypes.REST ? "apis" : "data"
        return `${workspacePrefix}/${basePath}/datasource/${id}`
      },
      [WorkspaceResource.TABLE]: (id: string) =>
        `${workspacePrefix}/data/table/${id}`,
      [WorkspaceResource.WORKSPACE_APP]: (id: string) => {
        const wsa = $workspaceAppStore.workspaceApps.find(
          (app: UIWorkspaceApp) => app._id === id
        )
        if (!wsa) {
          notifications.error("Could not resolve the workspace app URL")
          return ""
        }
        return `${workspacePrefix}/design/${wsa.screens[0]?._id}`
      },
      [WorkspaceResource.QUERY]: (id: string) => {
        const queriesStore = get(queries)
        const datasourceMap = get(datasourceLookup) || {}
        const query = queriesStore.list?.find(q => q._id === id)
        const datasource = query?.datasourceId
          ? datasourceMap[query.datasourceId]
          : undefined
        const basePath =
          datasource?.source === IntegrationTypes.REST ? "apis" : "data"
        return `${workspacePrefix}/${basePath}/query/${id}`
      },
      [WorkspaceResource.VIEW]: (id: string) => {
        const view = $viewsV2.list.find(v => v.id === id)
        return `${workspacePrefix}/data/table/${view?.tableId}/${id}`
      },
      [WorkspaceResource.AGENT]: (id: string) =>
        `${workspacePrefix}/agent/${id}/config`,
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
    window.open(liveUrl, "_blank", "noopener,noreferrer")
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

{#if workspaceId && $featureFlags[FeatureFlag.WORKSPACE_HOME]}
  <Modal bind:this={createAutomationModal}>
    <CreateAutomationModal {webhookModal} />
  </Modal>
  <Modal bind:this={webhookModal}>
    <CreateWebhookModal />
  </Modal>

  <WorkspaceAppModal bind:this={workspaceAppModal} workspaceApp={null} />

  {#if $featureFlags.AI_AGENTS}
    <AgentModal bind:this={agentModal} />
  {/if}

  <Modal bind:this={createTableModal} closeOnOutsideClick={false}>
    <CreateTableModal bind:name={tableName} afterSave={handleTableSave} />
  </Modal>
{/if}

<div class="nav_wrapper" style={`--nav-logo-width: ${navLogoSize}px;`}>
  <div class="nav_spacer" class:pinned={$pinned}></div>
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
        <a
          class="logo_link"
          href={$url("./")}
          aria-label="Workspace home"
          title="Workspace home"
          on:click={keepCollapsed}
        >
          <BBLogo
            color={"var(--spectrum-global-color-gray-900)"}
            size={navLogoSize}
          />
        </a>
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
        {#if workspaceId}
          <div
            class="core-sections"
            class:workspace_home={$featureFlags[FeatureFlag.WORKSPACE_HOME]}
          >
            <div>
              {#if $featureFlags[FeatureFlag.WORKSPACE_HOME]}
                <SideNavLink
                  icon="house"
                  text="Home"
                  url={$url("./home")}
                  {collapsed}
                  on:click={keepCollapsed}
                />

                <ActionMenu
                  align={PopoverAlignment.RightContextMenu}
                  portalTarget={".nav .create-popover-container"}
                  animate={false}
                  on:open={() => (createMenuOpen = true)}
                  on:close={() => (createMenuOpen = false)}
                >
                  <svelte:fragment slot="control" let:open>
                    <SideNavLink
                      icon="plus"
                      text="Create"
                      {collapsed}
                      forceActive={open}
                      on:click={keepCollapsed}
                    />
                  </svelte:fragment>

                  <MenuItem icon="path" on:click={openCreateAutomation}>
                    Automation
                  </MenuItem>
                  <MenuItem icon="browsers" on:click={openCreateApp}>
                    App
                  </MenuItem>

                  {#if $featureFlags.AI_AGENTS}
                    <MenuItem icon="sparkle" on:click={openCreateAgent}>
                      Agent
                      <div slot="right">
                        <Tag emphasized>Beta</Tag>
                      </div>
                    </MenuItem>
                    <MenuItem
                      icon="chat-circle"
                      on:click={() => goToCreate("chat")}
                    >
                      Chat
                      <div slot="right">
                        <Tag emphasized>Alpha</Tag>
                      </div>
                    </MenuItem>
                  {/if}

                  <MenuItem icon="grid-nine" on:click={openCreateTable}>
                    Table
                  </MenuItem>
                  <MenuItem
                    icon="webhooks-logo"
                    on:click={() => goToCreate("apis/new")}
                  >
                    API request
                  </MenuItem>
                  <MenuItem icon="cube" on:click={() => goToCreate("data/new")}>
                    Connection
                  </MenuItem>
                </ActionMenu>
              {:else}
                <SideNavLink
                  icon="browser"
                  text="Apps"
                  url={$url("./design")}
                  {collapsed}
                  on:click={keepCollapsed}
                />
                <span
                  class="root-nav"
                  class:selected={$isActive("./automation")}
                >
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
                {#if $featureFlags.AI_AGENTS}
                  <SideNavLink
                    icon="memory"
                    text="Agents"
                    url={$url("./agent")}
                    {collapsed}
                    on:click={keepCollapsed}
                  >
                    <svelte:fragment slot="right">
                      <div class="beta-tag-wrapper">
                        <Tag emphasized>Beta</Tag>
                      </div>
                    </svelte:fragment>
                  </SideNavLink>
                  <SideNavLink
                    icon="chat-circle"
                    text="Chat"
                    url={$url("./chat")}
                    {collapsed}
                    on:click={keepCollapsed}
                  >
                    <svelte:fragment slot="right">
                      <div class="beta-tag-wrapper">
                        <Tag emphasized>Alpha</Tag>
                      </div>
                    </svelte:fragment>
                  </SideNavLink>
                {/if}
              {/if}
            </div>

            <div class="core-secondary">
              <SideNavLink
                icon="sparkle"
                text="AI models"
                {collapsed}
                on:click={() => {
                  bb.settings("/ai")
                  keepCollapsed()
                }}
              />
              <SideNavLink
                icon="cube"
                text="APIs"
                url={$url("./apis")}
                {collapsed}
                on:click={keepCollapsed}
              />
              <SideNavLink
                icon="database"
                text="Data"
                url={$url("./data")}
                {collapsed}
                on:click={keepCollapsed}
              />
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
            </div>
          </div>
          <div class="favourite-wrapper">
            <hr />
            {#if !favourites?.length || !resourceLookup}
              <div class="favourite-empty-state">
                <div>
                  <Icon
                    name="star"
                    size="M"
                    color="var(--spectrum-global-color-gray-600)"
                    weight="regular"
                  />
                </div>
                <Body
                  color="var(--spectrum-global-color-gray-700)"
                  size="XS"
                  textAlign="left"
                >
                  You have no favourites yet! Favourite an automation, app,
                  table or API for quicker access.
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
        <SideNavLink
          icon="book"
          text="Docs"
          {collapsed}
          on:click={() => {
            window.open(DOCUMENTATION_URL, "_blank", "noopener,noreferrer")
            keepCollapsed()
          }}
        />
        <SideNavLink
          icon="discord-logo"
          text="Community"
          {collapsed}
          on:click={() => {
            window.open(DISCORD_URL, "_blank", "noopener,noreferrer")
            keepCollapsed()
          }}
        />
        <SideNavLink
          icon="star"
          text={githubStarsText}
          {collapsed}
          on:click={() => {
            window.open(
              "https://github.com/Budibase/budibase",
              "_blank",
              "noopener,noreferrer"
            )
            keepCollapsed()
          }}
        />

        {#if $licensing.isBusinessPlan || $licensing.isEnterprisePlan || $licensing.isEnterpriseTrial}
          <SideNavLink
            icon="paper-plane-tilt"
            text="Email support"
            {collapsed}
            on:click={() => {
              window.open(SUPPORT_EMAIL, "_blank", "noopener,noreferrer")
              keepCollapsed()
            }}
          />
        {:else}
          <SideNavLink
            icon="paper-plane-tilt"
            text="Upgrade for support"
            {collapsed}
            on:click={() => {
              licensing.goToUpgradePage()
              keepCollapsed()
            }}
          >
            <svelte:fragment slot="right">
              <div class="beta-tag-wrapper">
                <Tag emphasized>Paid</Tag>
              </div>
            </svelte:fragment>
          </SideNavLink>
        {/if}
        <SideNavUserSettings {collapsed} />
      </div>
      <div class="popover-container"></div>
      <div class="create-popover-container"></div>
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

  /* Split into two rules to prevent CSS tree-shaking in production builds */
  .nav_wrapper {
    display: contents;
  }
  .nav_wrapper {
    --nav-padding: 12px;
    --nav-collapsed-width: 42px;
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
    color: var(--spectrum-global-color-gray-800);
  }
  .logo_link {
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    border-radius: 6px;
    text-decoration: none;
    color: inherit;
  }
  .logo_link:hover {
    background: var(--spectrum-global-color-gray-200);
    cursor: pointer;
  }
  .logo_link:focus-visible {
    outline: 2px solid var(--spectrum-global-color-gray-400);
    outline-offset: 2px;
  }
  .logo_link :global(svg) {
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

  .create-popover-container {
    position: absolute;
  }

  .create-popover-container :global(.spectrum-Popover) {
    min-width: 245px;
    border-radius: 6px !important;
    background: var(--background) !important;
    border: 1px solid var(--spectrum-global-color-gray-200) !important;
    padding: 4px !important;
    margin-top: 4px;
    margin-left: 2px;
  }

  .create-popover-container :global(.spectrum-Menu) {
    background: transparent;
    padding: 0;
  }

  .create-popover-container :global(.spectrum-Menu-item) {
    border-radius: 4px;
    margin: 0;
  }

  .create-popover-container :global(.spectrum-Menu-item:hover) {
    background: var(--spectrum-global-color-gray-200);
  }

  .create-popover-container
    :global(.spectrum-Menu-item)
    :global(.spectrum-Menu-itemLabel) {
    font-size: 13px;
    line-height: 17px;
    color: var(--spectrum-global-color-gray-700);
  }

  .create-popover-container :global(.spectrum-Menu-divider) {
    margin: 4px 0;
    background: var(--spectrum-global-color-gray-200);
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

  .core-sections {
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }

  .core-sections:not(.workspace_home) .core-secondary {
    margin-top: 4px;
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
    margin-top: 10px;
  }
  .favourite-wrapper hr {
    border: none;
    border-top: 1px solid var(--spectrum-global-color-gray-200);
    margin: 0 0 10px 0;
  }

  .nav-section-title {
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .nav-section-title hr {
    border: none;
    border-top: 1px solid var(--spectrum-global-color-gray-200);
    margin: 0;
  }
  .favourite-empty-state {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
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
    .nav-section-title {
      transition: all 130ms ease-in-out;
    }
    .favourite-wrapper {
      display: none;
      transition: all 130ms ease-in-out;
    }
    .favourite-empty-state {
      display: all 130ms ease-in-out;
    }
  }

  .beta-tag-wrapper :global(.spectrum-Tags-itemLabel) {
    font-size: 12px;
  }
</style>
