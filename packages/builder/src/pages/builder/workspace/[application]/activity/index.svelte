<script lang="ts">
  import { API } from "@/api"
  import { agentsStore, featureFlags } from "@/stores/portal"
  import { users } from "@/stores/portal/users"
  import { Pagination, Table, notifications } from "@budibase/bbui"
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
    sourceLabel: string
    status: AgentRequestStatus
    updatedLabel: string
    actions: string
  }

  interface SummaryMetric {
    label: string
    value: number
  }

  const PAGE_SIZE = 40
  const tableSchema = {
    title: {
      type: "string",
      displayName: "Requests",
      width: "minmax(280px, 1.8fr)",
    },
    sourceLabel: {
      type: "string",
      displayName: "Source",
      width: "200px",
    },
    statusLabel: { type: "string", displayName: "Status", width: "170px" },
    updatedLabel: { type: "string", displayName: "Updated", width: "130px" },
    actions: {
      type: "string",
      displayName: "",
      width: "40px",
      sortable: false,
    },
  }
  const customRenderers = [
    { column: "statusLabel", component: ActivityStatusRenderer },
    { column: "actions", component: ActivityActionsRenderer },
  ]

  let loading = $state(false)
  let currentPage = $state(1)
  let selectedRequestId = $state<string | null>(null)
  let allRequests = $state<AgentRequest[]>([])
  let userNames = $state<Record<string, string>>({})
  let hasNextPage = $state(false)
  let activityEnabled = $derived($featureFlags[FeatureFlag.AI_AGENT_ACTIVITY])

  const requestStatusMeta: Record<RequestRow["status"], { label: string }> = {
    active: { label: "Processing" },
    needs_input: { label: "Needs input" },
    completed: { label: "Completed" },
    failed: { label: "Failed" },
  }

  const getRequestTitle = (request: AgentRequest) => {
    return request.title || "Untitled request"
  }

  const getRequestDisplayId = (request: AgentRequest) =>
    request._id || `${request.agentId}-${request.userId}`

  const getRequestUpdatedAt = (request: AgentRequest) => {
    return new Date(request.updatedAt || request.createdAt || 0)
  }

  const getSourceLabel = (request: AgentRequest) => {
    const agentName =
      $agentsStore.agents.find(agent => agent._id === request.agentId)?.name ||
      "Unknown agent"

    return `Agent: ${agentName}`
  }

  let filteredRequests = $derived(allRequests)

  let summaryMetrics = $derived.by<SummaryMetric[]>(() => {
    const requests = filteredRequests
    return [
      { label: "All actions", value: requests.length },
      {
        label: "Completed",
        value: requests.filter(r => r.status === "completed").length,
      },
      {
        label: "Processing",
        value: requests.filter(r => r.status === "active").length,
      },
      {
        label: "Needs input",
        value: requests.filter(r => r.status === "needs_input").length,
      },
      {
        label: "Failed",
        value: requests.filter(r => r.status === "failed").length,
      },
    ]
  })

  let paginatedRows = $derived.by<RequestRow[]>(() => {
    return filteredRequests.map(request => {
      const updatedAt = getRequestUpdatedAt(request)
      const updatedTime = updatedAt.getTime()

      return {
        id: getRequestDisplayId(request),
        title: getRequestTitle(request),
        sourceLabel: getSourceLabel(request),
        statusLabel: requestStatusMeta[request.status].label,
        status: request.status,
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

  let selectedRequestCreatedBy = $derived.by(() => {
    if (!selectedRequest) {
      return "Unknown user"
    }

    return userNames[selectedRequest.userId] || "Unknown user"
  })

  let paginationLabel = $derived.by(() => {
    const start = (currentPage - 1) * PAGE_SIZE + 1
    const end = start + paginatedRows.length - 1

    if (!paginatedRows.length) {
      return "Showing 0 items"
    }

    return `Showing ${start} to ${end} items`
  })

  async function loadRequests(page = currentPage) {
    if (!($agentsStore.agents || []).length) {
      allRequests = []
      hasNextPage = false
      return
    }

    loading = true
    try {
      const response = await API.fetchAgentRequests({
        limit: PAGE_SIZE,
        page,
      })
      allRequests = response.requests
      hasNextPage = response.requests.length === PAGE_SIZE
      try {
        await hydrateUserNames(response.requests)
      } catch (error) {
        console.error("Failed to hydrate agent request user names", error)
      }
    } catch (error) {
      console.error("Failed to fetch agent requests", error)
      notifications.error("Failed to load agent actions")
      allRequests = []
      hasNextPage = false
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
        try {
          const user = await users.get(userId)
          const name =
            [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
            user?.email ||
            "Unknown user"

          return [userId, name] as const
        } catch (error) {
          console.error("Failed to load agent request user", {
            userId,
            error,
          })

          return [userId, "Unknown user"] as const
        }
      })
    )

    userNames = {
      ...userNames,
      ...Object.fromEntries(entries),
    }
  }

  function changePage(nextPage: number) {
    const resolvedPage = Math.max(1, nextPage)
    if (resolvedPage === currentPage) {
      return
    }

    currentPage = resolvedPage
    selectedRequestId = null
    loadRequests(resolvedPage)
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
  })

  $effect(() => {
    if (!activityEnabled) {
      return
    }

    const currentAgentIds = ($agentsStore.agents || []).map(agent => agent._id)
    if (!currentAgentIds.length) {
      allRequests = []
      hasNextPage = false
      return
    }

    currentPage = 1
    selectedRequestId = null
    loadRequests(1)
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

        {#if currentPage > 1 || hasNextPage}
          <Pagination
            page={currentPage}
            goToPrevPage={() => changePage(currentPage - 1)}
            goToNextPage={() => changePage(currentPage + 1)}
            hasPrevPage={currentPage > 1}
            {hasNextPage}
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
    createdBy={selectedRequestCreatedBy}
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
    font-size: 13px;
    line-height: 17px;
    font-weight: 400;
    color: var(--spectrum-global-color-gray-600);
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
  .requests-table-panel :global(.spectrum-Table-cell:nth-child(4)) {
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

    .table-footer {
      flex-direction: column;
      align-items: flex-start;
    }
  }
</style>
