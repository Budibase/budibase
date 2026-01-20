<script lang="ts">
  import DashCard from "@/components/common/DashCard.svelte"
  import PublishStatusBadge from "@/components/common/PublishStatusBadge.svelte"
  import FavouriteResourceButton from "@/pages/builder/_components/FavouriteResourceButton.svelte"
  import WorkspaceAppModal from "@/pages/builder/workspace/[application]/design/[workspaceAppId]/[screenId]/_components/WorkspaceApp/WorkspaceAppModal.svelte"
  import AgentModal from "@/pages/builder/workspace/[application]/agent/AgentModal.svelte"
  import CreateAutomationModal from "@/components/automation/AutomationPanel/CreateAutomationModal.svelte"
  import CreateWebhookModal from "@/components/automation/Shared/CreateWebhookModal.svelte"
  import {
    appStore,
    automationStore,
    workspaceAppStore,
    workspaceFavouriteStore,
  } from "@/stores/builder"
  import { API } from "@/api"
  import { agentsStore, auth, featureFlags } from "@/stores/portal"
  import {
    Body,
    Helpers,
    Modal,
    type ModalAPI,
    Icon,
  } from "@budibase/bbui"
  import {
    FeatureFlag,
    type GetWorkspaceHomeMetricsResponse,
    type PublishResourceState,
    WorkspaceResource,
    type Agent,
    type UIAutomation,
    type UIWorkspaceApp,
    type WorkspaceFavourite,
  } from "@budibase/types"
  import { goto, url } from "@roxi/routify"
  import { onMount } from "svelte"

  $goto
  $url

  type HomeType = "all" | "app" | "automation" | "agent" | "chat"

  type HomeRowType = "app" | "automation" | "agent" | "chat"

  interface HomeRowBase {
    id: string
    name: string
    type: HomeRowType
    updatedAt?: string
    createdAt?: string
    favourite: WorkspaceFavourite
  }

  interface AppRow extends HomeRowBase {
    type: "app"
    resource: UIWorkspaceApp
    status: PublishResourceState
  }

  interface AutomationRow extends HomeRowBase {
    type: "automation"
    resource: UIAutomation
    status: PublishResourceState
  }

  interface AgentRow extends HomeRowBase {
    type: "agent"
    resource: Agent
    live: boolean
  }

  interface ChatRow extends HomeRowBase {
    type: "chat"
    live: boolean
  }

  type HomeRow = AppRow | AutomationRow | AgentRow | ChatRow

  let workspaceAppModal: WorkspaceAppModal
  let selectedWorkspaceApp: UIWorkspaceApp | undefined

  let createAutomationModal: ModalAPI
  let webhookModal: ModalAPI

  let agentModal: AgentModal

  let typeFilter: HomeType = "all"
  let searchTerm = ""
  let metrics: GetWorkspaceHomeMetricsResponse | null = null
  let metricsError = false

  $: favourites = workspaceFavouriteStore.lookup
  $: currentUserId = $auth.user?._id || ""

  const storageKey = (workspaceId: string) =>
    `budibase:workspaceHome:type:${workspaceId}`

  const readTypeFromUrl = (): HomeType | null => {
    if (typeof window === "undefined") {
      return null
    }
    const params = new URLSearchParams(window.location.search)
    const type = params.get("type")

    if (type === "all" || type === "app" || type === "automation") {
      return type
    }
    if (type === "agent" && $featureFlags.AI_AGENTS) {
      return type
    }

    return null
  }

  const readTypeFromStorage = (workspaceId: string): HomeType | null => {
    if (typeof window === "undefined") {
      return null
    }
    const value = window.localStorage.getItem(storageKey(workspaceId))

    if (value === "all" || value === "app" || value === "automation") {
      return value
    }
    if (value === "agent" && $featureFlags.AI_AGENTS) {
      return value
    }

    return null
  }

  const persistType = (workspaceId: string, value: HomeType) => {
    if (typeof window === "undefined") {
      return
    }
    window.localStorage.setItem(storageKey(workspaceId), value)
  }

  const setTypeFilter = (value: HomeType) => {
    const workspaceId = $appStore.appId
    if (!workspaceId) {
      typeFilter = value
      return
    }
    typeFilter = value
    persistType(workspaceId, value)
  }

  const getFavourite = (
    resourceType: WorkspaceResource,
    resourceId: string
  ): WorkspaceFavourite => {
    const existing = $favourites?.[resourceId]
    if (existing) {
      return existing
    }
    return {
      resourceType,
      resourceId,
      createdBy: currentUserId,
    }
  }

  const createApp = () => {
    selectedWorkspaceApp = undefined
    workspaceAppModal.show()
  }

  const openApp = (app: UIWorkspaceApp) => {
    selectedWorkspaceApp = app
    workspaceAppModal.show()
  }

  const createAutomation = () => {
    createAutomationModal?.show()
  }

  const createAgent = () => {
    agentModal?.show()
  }

  const openRow = (row: HomeRow) => {
    if (row.type === "app") {
      $goto($url(`../design/${row.id}`))
      return
    }
    if (row.type === "automation") {
      $goto($url(`../automation/${row.id}`))
      return
    }
    if (row.type === "agent") {
      $goto($url(`../agent/${row.id}/config`))
      return
    }
  }

  const loadMetrics = async () => {
    metricsError = false
    try {
      metrics = await API.workspaceHome.getMetrics()
    } catch (err) {
      console.error(err)
      metricsError = true
      metrics = null
    }
  }

  const mapApps = (apps: UIWorkspaceApp[]): AppRow[] =>
    apps.map(app => ({
      id: app._id as string,
      name: app.name,
      type: "app",
      status: app.publishStatus.state,
      updatedAt: app.updatedAt,
      createdAt: app.createdAt ? String(app.createdAt) : undefined,
      resource: app,
      favourite: getFavourite(
        WorkspaceResource.WORKSPACE_APP,
        app._id as string
      ),
    }))

  const mapAutomations = (automations: UIAutomation[]): AutomationRow[] =>
    automations.map(automation => ({
      id: automation._id as string,
      name: automation.name,
      type: "automation",
      status: automation.publishStatus.state,
      updatedAt: automation.updatedAt,
      createdAt: automation.createdAt ? String(automation.createdAt) : undefined,
      resource: automation,
      favourite: getFavourite(
        WorkspaceResource.AUTOMATION,
        automation._id as string
      ),
    }))

  const mapAgents = (agents: Agent[]): AgentRow[] =>
    agents.map(agent => ({
      id: agent._id as string,
      name: agent.name,
      type: "agent",
      live: agent.live === true,
      updatedAt: agent.updatedAt,
      createdAt: agent.createdAt ? String(agent.createdAt) : undefined,
      resource: agent,
      favourite: getFavourite(WorkspaceResource.AGENT, agent._id as string),
    }))

  const sortRows = (rows: HomeRow[]) =>
    rows.sort((a, b) => {
      const aIsFav = !!a.favourite._id
      const bIsFav = !!b.favourite._id

      if (aIsFav !== bIsFav) {
        return bIsFav ? 1 : -1
      }

      if (a.updatedAt && b.updatedAt) {
        return b.updatedAt.localeCompare(a.updatedAt)
      }

      return a.name.localeCompare(b.name)
    })

  $: allRows = sortRows([
    ...mapApps($workspaceAppStore.workspaceApps),
    ...mapAutomations($automationStore.automations),
    ...($featureFlags.AI_AGENTS ? mapAgents($agentsStore.agents) : []),
  ])

  $: filteredRows = allRows.filter(row => {
    if (typeFilter !== "all" && row.type !== typeFilter) {
      return false
    }
    if (searchTerm && !row.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }
    return true
  })

  const filterOptions = (agentsEnabled: boolean) => {
    const options: { label: string; value: HomeType }[] = [
      { label: "All", value: "all" },
      { label: "Apps", value: "app" },
      { label: "Automations", value: "automation" },
    ]

    if (agentsEnabled) {
      options.push({ label: "Agents", value: "agent" })
      options.push({ label: "Chat", value: "chat" })
    }

    return options
  }

  const getRowIcon = (row: HomeRow) => {
    switch (row.type) {
      case "automation":
        return "path"
      case "app":
        return "browsers"
      case "agent":
        return "sparkle"
      case "chat":
        return "chat-circle"
      default:
        return "cube"
    }
  }

  const getRowIconColor = (row: HomeRow) => {
    switch (row.type) {
      case "automation":
        return "#89B5E2"
      case "app":
        return "#D4A27F"
      case "agent":
        return "#BDB0F5"
      case "chat":
        return "#8CA171"
      default:
        return "var(--spectrum-global-color-gray-700)"
    }
  }

  onMount(async () => {
    const workspaceId = $appStore.appId
    if (!workspaceId) {
      return
    }

    if (!$featureFlags[FeatureFlag.WORKSPACE_HOME]) {
      $goto($url("../design"))
      return
    }

    const typeFromUrl = readTypeFromUrl()
    if (typeFromUrl) {
      setTypeFilter(typeFromUrl)
    }

    if ($featureFlags.AI_AGENTS) {
      await agentsStore.fetchAgents()
    } else if (typeFilter === "agent" || typeFilter === "chat") {
      typeFilter = "all"
      persistType(workspaceId, "all")
    }

    await loadMetrics()
  })
</script>

<div class="workspace-home">
  <div class="content">
    <div class="header">
      <div class="title">
        <Body size="M">{$appStore.name || "Workspace"}</Body>
      </div>

      <div class="header-actions">
        <a href={"/builder/apps"} class="header-link">
          <Body size="XS">Portal</Body>
        </a>
      </div>
    </div>

    <div class="metrics">
      <div class="metric-card">
        <Body size="XL" weight="600">{metrics ? metrics.totalUsers : "—"}</Body>
        <Body size="XS" color="var(--spectrum-global-color-gray-600)">
          Total users
        </Body>
      </div>

      <div class="metric-card">
        <Body size="XL" weight="600">
          {metrics ? metrics.automationRunsThisMonth : "—"}
        </Body>
        <Body size="XS" color="var(--spectrum-global-color-gray-600)">
          Automation runs this month
        </Body>
      </div>

      <div class="metric-card">
        <Body size="XL" weight="600">
          {metrics ? metrics.agentActionsThisMonth : "—"}
        </Body>
        <Body size="XS" color="var(--spectrum-global-color-gray-600)">
          Agent actions this month
        </Body>
      </div>

      <div class="metric-card">
        <Body size="XL" weight="600">—</Body>
        <Body size="XS" color="var(--spectrum-global-color-gray-600)">
          Chat conversations this month
        </Body>
      </div>
    </div>

    {#if metricsError}
      <div class="metrics-error">
        <Body size="S" color="var(--spectrum-global-color-static-red-600)">
          Failed to load workspace metrics.
        </Body>
      </div>
    {/if}

    <div class="controls">
      <div class="controls-left">
        <div class="filter-wrapper">
          <select class="filter-select" bind:value={typeFilter} on:change={() => setTypeFilter(typeFilter)}>
            {#each filterOptions($featureFlags.AI_AGENTS) as option}
              <option value={option.value}>{option.label}</option>
            {/each}
          </select>
          <Icon name="ChevronDown" size="XS" />
        </div>

        <div class="search-wrapper">
          <Icon name="magnifying-glass" size="S" />
          <input
            class="search-input"
            type="text"
            placeholder="Search..."
            bind:value={searchTerm}
          />
        </div>
      </div>

      <div class="controls-right">
        <button class="create-button" type="button" on:click={createAutomation}>
          <Icon name="path" size="S" color="#89B5E2" />
          <Body size="XS">Automation</Body>
        </button>

        <button class="create-button" type="button" on:click={createApp}>
          <Icon name="browsers" size="S" color="#D4A27F" />
          <Body size="XS">App</Body>
        </button>

        {#if $featureFlags.AI_AGENTS}
          <button class="create-button" type="button" on:click={createAgent}>
            <Icon name="sparkle" size="S" color="#BDB0F5" />
            <Body size="XS">Agent</Body>
            <span class="badge">Beta</span>
          </button>

          <button class="create-button" type="button">
            <Icon name="chat-circle" size="S" color="#8CA171" />
            <Body size="XS">Chat</Body>
            <span class="badge">Alpha</span>
          </button>
        {/if}
      </div>
    </div>

    <div class="table">
      <div class="table-header">
        <div class="cell name-cell">
          <Body size="XS" color="var(--spectrum-global-color-gray-700)">
            Name
          </Body>
        </div>
        <div class="cell type-cell">
          <Icon name="circle-half-tilt" size="S" />
          <Body size="XS" color="var(--spectrum-global-color-gray-700)">
            Type
          </Body>
        </div>
        <div class="cell status-cell">
          <Icon name="circle-half-tilt" size="S" />
          <Body size="XS" color="var(--spectrum-global-color-gray-700)">
            Status
          </Body>
        </div>
        <div class="cell date-cell">
          <Icon name="Calendar" size="S" />
          <Body size="XS" color="var(--spectrum-global-color-gray-700)">
            Created
          </Body>
        </div>
        <div class="cell actions-cell"></div>
      </div>

      <div class="table-body" class:empty={!filteredRows.length}>
        {#each filteredRows as row (row.id)}
          <button
            class="row"
            type="button"
            class:favourite={row.favourite?._id}
            on:click={() => openRow(row)}
          >
            <div class="cell name-cell">
              <Icon
                name={getRowIcon(row)}
                size="S"
                color={getRowIconColor(row)}
              />
              <Body size="XS">{row.name}</Body>
            </div>

            <div class="cell type-cell">
              <Body size="XS" color="var(--spectrum-global-color-gray-700)">
                {#if row.type === "app"}
                  App
                {:else if row.type === "automation"}
                  Automation
                {:else if row.type === "agent"}
                  Agent
                {:else}
                  Chat
                {/if}
              </Body>
            </div>

            <div class="cell status-cell">
              {#if row.type === "app" || row.type === "automation"}
                <PublishStatusBadge status={row.status} />
              {:else}
                <Body
                  size="XS"
                  color={row.live
                    ? "#8CA171"
                    : "var(--spectrum-global-color-gray-700)"}
                >
                  {row.live ? "Live" : "Draft"}
                </Body>
              {/if}
            </div>

            <div class="cell date-cell">
              <Body size="XS" color="var(--spectrum-global-color-gray-700)">
                {#if row.createdAt || row.updatedAt}
                  {Helpers.getDateDisplayValue(row.createdAt || row.updatedAt)}
                {:else}
                  —
                {/if}
              </Body>
            </div>

            <div class="cell actions-cell">
              <Icon name="dots-three" size="M" hoverable />
            </div>
          </button>
        {/each}

        {#if !filteredRows.length}
          <div class="empty">
            <Body size="M" color="var(--spectrum-global-color-gray-700)">
              Nothing here yet.
            </Body>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

<WorkspaceAppModal
  bind:this={workspaceAppModal}
  workspaceApp={selectedWorkspaceApp}
  on:hide={() => (selectedWorkspaceApp = undefined)}
/>

<Modal bind:this={createAutomationModal}>
  <CreateAutomationModal {webhookModal} />
</Modal>
<Modal bind:this={webhookModal}>
  <CreateWebhookModal />
</Modal>

{#if $featureFlags.AI_AGENTS}
  <AgentModal bind:this={agentModal} />
{/if}

<style>
  .workspace-home {
    background: var(--background);
    flex: 1 1 auto;
    display: flex;
    justify-content: center;
    overflow-y: auto;
    padding: 0 var(--spacing-l);
    box-sizing: border-box;
  }

  .content {
    width: 100%;
    max-width: 1200px;
    padding: var(--spacing-xl) 0;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-l);
  }

  .header-actions {
    display: flex;
    gap: var(--spacing-l);
    align-items: center;
  }

  .header-link {
    text-decoration: none;
    color: var(--spectrum-global-color-gray-800);
    transition: color 130ms ease-out;
  }

  .header-link:hover {
    color: var(--spectrum-global-color-gray-900);
  }

  .metrics {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: var(--spacing-m);
  }

  .metric-card {
    background: var(--spectrum-global-color-gray-100);
    border-radius: 4px;
    padding: var(--spacing-m);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }

  .metrics-error {
    padding: var(--spacing-s) var(--spacing-m);
    border-radius: 4px;
    background: var(--spectrum-global-color-gray-100);
  }

  .controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-m);
  }

  .controls-left {
    display: flex;
    gap: var(--spacing-m);
    align-items: center;
  }

  .filter-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 6px;
    padding: 3px 8px;
    min-width: 120px;
    transition: border-color 130ms ease-out;
  }

  .filter-wrapper:hover {
    border-color: var(--spectrum-global-color-gray-400);
  }

  .filter-wrapper :global(i) {
    pointer-events: none;
    position: absolute;
    right: 8px;
  }

  .filter-select {
    background: transparent;
    border: none;
    outline: none;
    flex: 1;
    font-family: var(--font-sans);
    font-size: 13px;
    color: var(--spectrum-global-color-gray-900);
    cursor: pointer;
    padding-right: 20px;
    appearance: none;
  }

  .search-wrapper {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 6px;
    padding: 3px 8px;
    min-width: 200px;
  }

  .search-input {
    background: transparent;
    border: none;
    outline: none;
    flex: 1;
    font-family: var(--font-sans);
    font-size: 13px;
    color: var(--spectrum-global-color-gray-900);
  }

  .search-input::placeholder {
    color: var(--spectrum-global-color-gray-600);
  }

  .controls-right {
    display: flex;
    gap: var(--spacing-s);
    align-items: center;
  }

  .create-button {
    background: var(--spectrum-global-color-gray-200);
    border: none;
    border-radius: 100px;
    padding: 7px 15px 8px;
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    cursor: pointer;
    transition: background 130ms ease-out;
    color: var(--spectrum-global-color-gray-900);
  }

  .create-button:hover {
    background: var(--spectrum-global-color-gray-300);
  }

  .badge {
    background: var(--spectrum-global-color-gray-300);
    padding: 2px 4px;
    border-radius: 2px;
    font-size: 11px;
    line-height: 10px;
    color: var(--spectrum-global-color-gray-700);
  }

  .table {
    --border: 1px solid var(--spectrum-global-color-gray-200);
    border: var(--border);
    border-radius: 6px;
    overflow: hidden;
    background: var(--spectrum-global-color-gray-100);
  }

  .table-header {
    display: grid;
    grid-template-columns: 1fr 200px 200px 200px 60px;
    background: var(--spectrum-global-color-gray-100);
    border-bottom: var(--border);
  }

  .table-body {
    display: flex;
    flex-direction: column;
  }

  .row {
    border: none;
    background: var(--background);
    text-align: left;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 200px 200px 200px 60px;
    border-bottom: var(--border);
    align-items: center;
    transition: background 130ms ease-out;
    cursor: pointer;
  }

  .row:hover {
    background: var(--spectrum-global-color-gray-100);
  }

  .row:last-child {
    border-bottom: none;
  }

  .cell {
    padding: 8px 12px;
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }

  .name-cell {
    gap: var(--spacing-s);
  }

  .actions-cell {
    justify-content: center;
  }

  .empty {
    padding: var(--spacing-l);
    display: flex;
    justify-content: center;
    background: var(--background);
  }

</style>
