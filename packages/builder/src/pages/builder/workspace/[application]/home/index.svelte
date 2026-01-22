<script lang="ts">
  import WorkspaceAppModal from "@/pages/builder/workspace/[application]/design/[workspaceAppId]/[screenId]/_components/WorkspaceApp/WorkspaceAppModal.svelte"
  import AgentModal from "@/pages/builder/workspace/[application]/agent/AgentModal.svelte"
  import CreateAutomationModal from "@/components/automation/AutomationPanel/CreateAutomationModal.svelte"
  import CreateWebhookModal from "@/components/automation/Shared/CreateWebhookModal.svelte"
  import HomeControls from "./_components/HomeControls.svelte"
  import HomeMetrics from "./_components/HomeMetrics.svelte"
  import HomeTable from "./_components/HomeTable.svelte"
  import {
    appStore,
    automationStore,
    workspaceAppStore,
    workspaceFavouriteStore,
  } from "@/stores/builder"
  import { API } from "@/api"
  import { agentsStore, auth, featureFlags } from "@/stores/portal"
  import { Body, Modal, type ModalAPI } from "@budibase/bbui"
  import {
    FeatureFlag,
    type GetWorkspaceHomeMetricsResponse,
    type UIWorkspaceApp,
    type WorkspaceFavourite,
    type WorkspaceResource,
  } from "@budibase/types"
  import { goto, url } from "@roxi/routify"
  import { onMount } from "svelte"
  import {
    buildHomeRows,
    filterHomeRows,
    sortHomeRows,
  } from "./_components/rows"
  import type {
    HomeRow,
    HomeSortColumn,
    HomeSortOrder,
    HomeType,
  } from "./_components/types"

  $goto
  $url

  let workspaceAppModal: WorkspaceAppModal
  let selectedWorkspaceApp: UIWorkspaceApp | undefined

  let createAutomationModal: ModalAPI
  let webhookModal: ModalAPI

  let agentModal: AgentModal

  let typeFilter: HomeType = "all"
  let searchTerm = ""
  let metrics: GetWorkspaceHomeMetricsResponse | null = null
  let metricsError = false

  let sortColumn: HomeSortColumn = "created"
  let sortOrder: HomeSortOrder = "desc"

  let hasMounted = false

  const favourites = workspaceFavouriteStore.lookup
  $: currentUserId = $auth.user?._id || ""

  let getFavourite: (
    _resourceType: WorkspaceResource,
    _resourceId: string
  ) => WorkspaceFavourite

  $: getFavourite = (resourceType, resourceId) => {
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

  const normalizeType = (value: string | null): HomeType | null => {
    if (!value) {
      return null
    }
    if (value === "all" || value === "app" || value === "automation") {
      return value
    }
    if (value === "agent" && $featureFlags.AI_AGENTS) {
      return value
    }
    return null
  }

  const normalizeSortColumn = (value: string | null): HomeSortColumn | null => {
    if (!value) {
      return null
    }
    if (
      value === "name" ||
      value === "type" ||
      value === "status" ||
      value === "created"
    ) {
      return value
    }
    return null
  }

  const normalizeSortOrder = (value: string | null): HomeSortOrder | null => {
    if (value === "asc" || value === "desc") {
      return value
    }
    return null
  }

  const readUrlState = () => {
    if (typeof window === "undefined") {
      return { type: null as HomeType | null, q: "" }
    }
    const params = new URLSearchParams(window.location.search)
    const type = normalizeType(params.get("type"))
    const q = params.get("q") ?? ""
    const sort = normalizeSortColumn(params.get("sort"))
    const order = normalizeSortOrder(params.get("order"))
    return { type, q, sort, order }
  }

  const writeUrlState = () => {
    if (!hasMounted || typeof window === "undefined") {
      return
    }

    const params = new URLSearchParams(window.location.search)

    if (typeFilter === "all") {
      params.delete("type")
    } else if (typeFilter === "chat") {
      params.delete("type")
    } else {
      params.set("type", typeFilter)
    }

    const q = searchTerm.trim()
    if (!q) {
      params.delete("q")
    } else {
      params.set("q", q)
    }

    const defaultSortColumn: HomeSortColumn = "created"
    const defaultSortOrder: HomeSortOrder = "desc"
    const isDefaultSort =
      sortColumn === defaultSortColumn && sortOrder === defaultSortOrder
    if (isDefaultSort) {
      params.delete("sort")
      params.delete("order")
    } else {
      params.set("sort", sortColumn)
      params.set("order", sortOrder)
    }

    const query = params.toString()
    const next = `${window.location.pathname}${query ? `?${query}` : ""}`
    history.replaceState({}, "", next)
  }

  const setTypeFilter = (value: string) => {
    const normalized = normalizeType(value)
    if (!normalized) {
      return
    }
    typeFilter = normalized
  }

  const setSort = (column: HomeSortColumn) => {
    if (sortColumn === column) {
      sortOrder = sortOrder === "asc" ? "desc" : "asc"
      return
    }
    sortColumn = column
    sortOrder = column === "created" ? "desc" : "asc"
  }

  const createApp = () => {
    selectedWorkspaceApp = undefined
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

  $: baseRows = buildHomeRows({
    apps: $workspaceAppStore.workspaceApps,
    automations: $automationStore.automations,
    agents: $agentsStore.agents,
    agentsEnabled: $featureFlags.AI_AGENTS,
    getFavourite,
  })

  $: allRows = sortHomeRows(baseRows, { sortColumn, sortOrder })

  $: filteredRows = filterHomeRows({ rows: allRows, typeFilter, searchTerm })

  $: if (hasMounted) writeUrlState()

  onMount(async () => {
    const workspaceId = $appStore.appId
    if (!workspaceId) {
      return
    }

    if (!$featureFlags[FeatureFlag.WORKSPACE_HOME]) {
      $goto($url("../design"))
      return
    }

    const { type, q, sort, order } = readUrlState()
    if (type) {
      typeFilter = type
    }
    if (q) {
      searchTerm = q
    }
    if (sort) {
      sortColumn = sort
    }
    if (order) {
      sortOrder = order
    }

    hasMounted = true
    writeUrlState()

    await Promise.all([
      $featureFlags.AI_AGENTS ? agentsStore.fetchAgents() : Promise.resolve(),
      loadMetrics(),
    ])
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
          <Body size="S">Portal</Body>
        </a>
      </div>
    </div>

    <HomeMetrics {metrics} {metricsError} />

    <HomeControls
      {typeFilter}
      {searchTerm}
      agentsEnabled={$featureFlags.AI_AGENTS}
      on:typeChange={({ detail }) => setTypeFilter(detail)}
      on:searchChange={({ detail }) => (searchTerm = detail)}
      on:createAutomation={createAutomation}
      on:createApp={createApp}
      on:createAgent={createAgent}
    />

    <HomeTable
      rows={filteredRows}
      allRowsCount={allRows.length}
      {typeFilter}
      {searchTerm}
      {sortColumn}
      {sortOrder}
      on:openRow={({ detail }) => openRow(detail)}
      on:clearSearch={() => (searchTerm = "")}
      on:resetFilters={() => (typeFilter = "all")}
      on:sortChange={({ detail }) => setSort(detail)}
    />
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
    background: var(--background-alt);
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
</style>
