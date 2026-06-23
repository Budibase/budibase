<script lang="ts">
  import { API } from "@/api"
  import { agentsStore, featureFlags } from "@/stores/portal"
  import { users } from "@/stores/portal/users"
  import { Pagination, Select, Table, notifications } from "@budibase/bbui"
  import type { AgentRequestStatus } from "@budibase/types"
  import { FeatureFlag, type AgentRequest } from "@budibase/types"
  import { goto } from "@roxi/routify"
  import dayjs from "dayjs"
  import relativeTime from "dayjs/plugin/relativeTime"
  import ActivityActionsRenderer from "./ActivityActionsRenderer.svelte"
  import ActivitySidePanel from "./ActivitySidePanel.svelte"
  import ActivityStatusRenderer from "./ActivityStatusRenderer.svelte"

  dayjs.extend(relativeTime)

  interface RequestRow {
    id: string
    title: string
    agentName: string
    triggeredBy: string
    statusLabel: string
    status: AgentRequestStatus
    actionCount: number
    updatedLabel: string
    actions: string
  }

  interface SummaryMetric {
    label: string
    value: number
  }

  const PAGE_SIZE = 20
  const tableSchema = {
    title: {
      type: "string",
      displayName: "Requests",
      width: "minmax(280px, 1.8fr)",
    },
    agentName: { type: "string", displayName: "Agent", width: "180px" },
    triggeredBy: {
      type: "string",
      displayName: "Triggered by",
      width: "200px",
    },
    statusLabel: { type: "string", displayName: "Status", width: "170px" },
    actionCount: {
      type: "number",
      displayName: "Actions",
      width: "90px",
      align: "Left",
    },
    updatedLabel: { type: "string", displayName: "Updated", width: "130px" },
    actions: {
      type: "string",
      displayName: "",
      width: "40px",
      sortable: false,
      preventSelectRow: true,
    },
  }
  const customRenderers = [
    { column: "statusLabel", component: ActivityStatusRenderer },
    { column: "actions", component: ActivityActionsRenderer },
  ]

  let loading = $state(false)
  let selectedAgentFilter = $state("")
  let currentPage = $state(1)
  let selectedRequestId = $state<string | null>(null)
  let allRequests = $state<AgentRequest[]>([])
  let userNames = $state<Record<string, string>>({})
  let activityEnabled = $derived($featureFlags[FeatureFlag.AI_AGENT_ACTIVITY])

  const requestStatusMeta: Record<RequestRow["status"], { label: string }> = {
    completed: { label: "Completed" },
  }

  const getRequestTitle = (request: AgentRequest) => {
    if (request.title) {
      return request.title
    }

    const latestEntry = request.entries[request.entries.length - 1]
    if (!latestEntry) {
      return "Untitled request"
    }

    return latestEntry.promptHistory[0]?.message || "Untitled request"
  }

  const getRequestDisplayId = (request: AgentRequest) =>
    request._id || `${request.agentId}-${request.userId}`

  const getRequestUpdatedAt = (request: AgentRequest) => {
    const latestEntry = request.entries[request.entries.length - 1]
    const latestPrompt =
      latestEntry?.promptHistory[latestEntry.promptHistory.length - 1]
    return new Date(
      latestPrompt?.date || request.updatedAt || request.createdAt || 0
    )
  }

  const sortRequestsByLatestActivity = (requests: AgentRequest[]) =>
    [...requests].sort((a, b) => {
      const aTime = getRequestUpdatedAt(a).getTime()
      const bTime = getRequestUpdatedAt(b).getTime()
      return bTime - aTime
    })

  const getTriggeredByLabel = (
    request: AgentRequest,
    resolvedUserNames: Record<string, string>
  ) => {
    const userName = resolvedUserNames[request.userId]
    if (userName) {
      return `User: ${userName}`
    }
    return request.userId ? "User" : "Unknown"
  }

  let agentOptions = $derived.by(() => {
    const options = ($agentsStore.agents || []).map(agent => ({
      label: agent.name || "Untitled agent",
      value: agent._id || "",
    }))

    return options.filter(option => option.value)
  })

  let filteredRequests = $derived.by(() => {
    const requests = !selectedAgentFilter
      ? allRequests
      : allRequests.filter(request => request.agentId === selectedAgentFilter)

    return sortRequestsByLatestActivity(requests)
  })

  let summaryMetrics = $derived.by<SummaryMetric[]>(() => {
    const requests = filteredRequests
    return [
      { label: "All actions", value: requests.length },
      { label: "Completed", value: requests.length },
      { label: "Needs input", value: 0 },
      { label: "Failed", value: 0 },
    ]
  })

  let totalPages = $derived.by(() =>
    Math.max(1, Math.ceil(filteredRequests.length / PAGE_SIZE))
  )

  let paginatedRows = $derived.by<RequestRow[]>(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredRequests.slice(start, start + PAGE_SIZE).map(request => {
      const updatedAt = getRequestUpdatedAt(request)
      const updatedTime = updatedAt.getTime()
      const actionCount = request.entries.reduce(
        (total, entry) => total + entry.promptHistory.length,
        0
      )
      const agentName =
        $agentsStore.agents.find(agent => agent._id === request.agentId)
          ?.name || "Unknown agent"

      return {
        id: getRequestDisplayId(request),
        title: getRequestTitle(request),
        agentName,
        triggeredBy: getTriggeredByLabel(request, userNames),
        statusLabel: requestStatusMeta[request.status].label,
        status: request.status,
        actionCount,
        updatedLabel:
          updatedTime > 0 ? dayjs(updatedAt).fromNow() : "Unknown time",
        actions: "",
      }
    })
  })

  let selectedRequest = $derived.by(() =>
    allRequests.find(request => {
      return getRequestDisplayId(request) === selectedRequestId
    })
  )

  let selectedRequestAgentName = $derived.by(() => {
    if (!selectedRequest) {
      return "Unknown agent"
    }

    return (
      $agentsStore.agents.find(agent => agent._id === selectedRequest.agentId)
        ?.name || "Unknown agent"
    )
  })

  let selectedRequestTriggeredBy = $derived.by(() => {
    if (!selectedRequest) {
      return "Unknown"
    }

    return getTriggeredByLabel(selectedRequest, userNames)
  })

  let paginationLabel = $derived.by(() => {
    const start = (currentPage - 1) * PAGE_SIZE + 1
    const end = Math.min(currentPage * PAGE_SIZE, filteredRequests.length)
    return `Showing ${start}-${end} of ${filteredRequests.length} items`
  })

  async function loadRequests() {
    if (!($agentsStore.agents || []).length) {
      allRequests = []
      return
    }

    loading = true
    try {
      const response = await API.fetchAgentRequests()
      allRequests = response.requests
      await hydrateUserNames(allRequests)
    } catch (error) {
      console.error("Failed to fetch agent requests", error)
      notifications.error("Failed to load agent actions")
      allRequests = []
    } finally {
      loading = false
    }
  }

  async function hydrateUserNames(requests: AgentRequest[]) {
    const missingUserIds = [...new Set(requests.map(request => request.userId))]
      .filter(Boolean)
      .filter(userId => !userNames[userId])

    if (!missingUserIds.length) {
      return
    }

    const entries = await Promise.all(
      missingUserIds.map(async userId => {
        const user = await users.get(userId)
        const name =
          [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
          user?.email ||
          "User"
        return [userId, name] as const
      })
    )

    userNames = {
      ...userNames,
      ...Object.fromEntries(entries),
    }
  }

  function changePage(nextPage: number) {
    currentPage = Math.min(Math.max(1, nextPage), totalPages)
  }

  function selectRequest(row: RequestRow) {
    selectedRequestId = row.id
  }

  function closeRequestPanel() {
    selectedRequestId = null
  }

  $effect(() => {
    if (!activityEnabled) {
      $goto("../home")
      return
    }

    const currentAgentIds = ($agentsStore.agents || []).map(agent => agent._id)
    if (!currentAgentIds.length) {
      return
    }

    loadRequests()
  })

  $effect(() => {
    selectedAgentFilter
    currentPage = 1
    selectedRequestId = null
  })

  $effect(() => {
    if (currentPage > totalPages) {
      currentPage = totalPages
    }
  })
</script>

<div class="agent-actions-page">
  <div class="page-title">Agent actions</div>

  <div class="metrics-grid">
    {#each summaryMetrics as metric}
      <section class="metric-card">
        <div class="metric-label">{metric.label}</div>
        <div class="metric-value">{metric.value.toLocaleString()}</div>
      </section>
    {/each}
  </div>

  <div class="filter-control">
    <Select
      bind:value={selectedAgentFilter}
      options={agentOptions}
      placeholder="All agents"
      size="S"
      bordered
    />
  </div>

  <section class="requests-table-panel">
    <Table
      quiet
      compact
      {loading}
      allowClickRows
      allowEditRows={false}
      allowEditColumns={false}
      allowSelectRows={false}
      data={paginatedRows}
      schema={tableSchema}
      {customRenderers}
      placeholderText="No agent actions tracked yet."
      on:click={({ detail }) => selectRequest(detail)}
    />

    {#if paginatedRows.length > 0}
      <div class="table-footer">
        <div class="footer-copy">{paginationLabel}</div>

        {#if totalPages > 1}
          <Pagination
            page={currentPage}
            goToPrevPage={() => changePage(currentPage - 1)}
            goToNextPage={() => changePage(currentPage + 1)}
            hasPrevPage={currentPage > 1}
            hasNextPage={currentPage < totalPages && !!paginatedRows.length}
          />
        {/if}
      </div>
    {/if}
  </section>

  <ActivitySidePanel
    open={!!selectedRequest}
    title={selectedRequest ? getRequestTitle(selectedRequest) : "Request"}
    request={selectedRequest}
    agentName={selectedRequestAgentName}
    triggeredBy={selectedRequestTriggeredBy}
    onClose={closeRequestPanel}
  />
</div>

<style>
  .agent-actions-page {
    display: flex;
    flex-direction: column;
    gap: 24px;
    min-height: 100%;
    padding: 20px 40px 32px;
    background: var(--background);
  }

  .page-title {
    font-size: 24px;
    font-weight: 500;
    color: var(--spectrum-global-color-gray-900);
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 10px;
  }

  .metric-card {
    background: var(--background-alt);
    border-radius: 4px;
    padding: 12px 16px;
    min-height: 72px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .metric-label {
    font-size: 13px;
    line-height: 16px;
    color: var(--spectrum-global-color-gray-700);
  }

  .metric-value {
    font-size: 26px;
  }

  .filter-control {
    width: 240px;
  }

  .requests-table-panel {
    background: transparent;
    display: flex;
    min-width: 0;
    flex-direction: column;
    min-height: 0;
  }

  .table-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 26px 10px 0;
    gap: 16px;
  }

  .footer-copy {
    font-size: 13px;
    color: var(--spectrum-global-color-gray-700);
  }

  .requests-table-panel :global(.spectrum-Table-headCell) {
    background: transparent;
    border-top: none;
    border-left: none;
    border-right: none;
    text-transform: none;
    color: var(--spectrum-global-color-gray-600);
    font-family: inherit;
    font-size: 13px;
    font-weight: 400;
    letter-spacing: normal;
  }

  .requests-table-panel :global(.spectrum-Table-body) {
    background: transparent;
  }

  .requests-table-panel :global(.spectrum-Table-row) {
    background: transparent;
  }

  .requests-table-panel :global(.spectrum-Table-cell) {
    border-left: 0;
    border-right: 0;
  }

  .requests-table-panel :global(.spectrum-Table-cell:nth-child(2)),
  .requests-table-panel :global(.spectrum-Table-cell:nth-child(3)),
  .requests-table-panel :global(.spectrum-Table-cell:nth-child(6)) {
    color: var(--spectrum-global-color-gray-600);
  }

  .requests-table-panel :global(.spectrum-Table-bodyEmpty) {
    color: var(--spectrum-global-color-gray-700);
  }

  @media (max-width: 1280px) {
    .agent-actions-page {
      padding-left: 24px;
      padding-right: 24px;
    }

    .metrics-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .requests-table-panel {
      overflow-x: auto;
    }
  }

  @media (max-width: 720px) {
    .agent-actions-page {
      padding: 20px 16px 24px;
    }

    .filter-control {
      width: 100%;
    }

    .table-footer {
      flex-direction: column;
      align-items: flex-start;
    }
  }
</style>
