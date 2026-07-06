<script lang="ts">
  import { API } from "@/api"
  import { agentsStore, featureFlags } from "@/stores/portal"
  import { users } from "@/stores/portal/users"
  import { builderStore } from "@/stores/builder"
  import { Body, Pagination, Table, notifications } from "@budibase/bbui"
  import { BuilderSocketEvent } from "@budibase/shared-core"
  import type {
    AgentRequestsSummary,
    AgentRequestStatus,
  } from "@budibase/types"
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

  const PAGE_SIZE = 20
  const tableSchema = {
    title: {
      type: "string",
      displayName: "Requests",
      width: "minmax(280px, 1.8fr)",
    },
    statusLabel: { type: "string", displayName: "Status", width: "170px" },
    sourceLabel: {
      type: "string",
      displayName: "Source",
      width: "200px",
    },
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

  const RELATIVE_TIME_REFRESH_MS = 30000

  let loading = $state(false)
  let currentPage = $state(1)
  let selectedRequestId = $state<string | null>(null)
  let allRequests = $state<AgentRequest[]>([])
  let summary = $state<AgentRequestsSummary | null>(null)
  let userNames = $state<Record<string, string>>({})
  let activityEnabled = $derived($featureFlags[FeatureFlag.AI_AGENT_ACTIVITY])

  let hasNextPage = $derived.by(() => {
    return !!summary && summary.total > currentPage * PAGE_SIZE
  })

  // Ticks on an interval purely to force updatedLabel to re-derive
  let now = $state(Date.now())

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
    const counts = summary || {
      total: 0,
      active: 0,
      needs_input: 0,
      completed: 0,
      failed: 0,
    }
    return [
      { label: "All requests", value: counts.total },
      { label: "Completed", value: counts.completed },
      { label: "Processing", value: counts.active },
      { label: "Needs input", value: counts.needs_input },
      { label: "Failed", value: counts.failed },
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
          updatedTime > 0 ? dayjs(updatedAt).from(now) : "Unknown time",
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
      summary = null
      return
    }

    loading = true
    try {
      const response = await API.fetchAgentRequests({
        limit: PAGE_SIZE,
        page,
      })
      allRequests = response.requests
      summary = response.summary
      try {
        await hydrateUserNames(response.requests)
      } catch (error) {
        console.error("Failed to hydrate agent request user names", error)
      }
    } catch (error) {
      console.error("Failed to fetch agent requests", error)
      notifications.error("Failed to load agent actions")
      allRequests = []
      summary = null
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
    const interval = setInterval(() => {
      now = Date.now()
    }, RELATIVE_TIME_REFRESH_MS)
    return () => clearInterval(interval)
  })

  $effect(() => {
    if (!activityEnabled) {
      return
    }

    const currentAgentIds = ($agentsStore.agents || []).map(agent => agent._id)
    if (!currentAgentIds.length) {
      allRequests = []
      summary = null
      return
    }

    currentPage = 1
    selectedRequestId = null
    loadRequests(1)
  })

  $effect(() => {
    const socket = builderStore.websocket
    if (!socket) {
      return
    }

    const handleAgentRequestChange = async (request: AgentRequest) => {
      const previous = allRequests.find(r => r._id === request._id)
      if (previous) {
        allRequests = allRequests.map(r =>
          r._id === request._id ? request : r
        )
        if (summary && previous.status !== request.status) {
          summary = {
            ...summary,
            [previous.status]: summary[previous.status] - 1,
            [request.status]: summary[request.status] + 1,
          }
        }
        return
      }

      // A brand-new request always lands on page 1, pushing every other
      // page's rows down by one. On page 1 we can patch locally; on any
      // other page the shift can only be reproduced by re-fetching that
      // page's offset from the server.
      if (currentPage !== 1) {
        await loadRequests(currentPage)
        return
      }

      if (summary) {
        summary = {
          ...summary,
          total: summary.total + 1,
          [request.status]: summary[request.status] + 1,
        }
      }

      allRequests = [request, ...allRequests].slice(0, PAGE_SIZE)
      try {
        await hydrateUserNames([request])
      } catch (error) {
        console.error("Failed to hydrate agent request user name", error)
      }
    }

    socket.on(BuilderSocketEvent.AgentRequestChange, handleAgentRequestChange)
    return () => {
      socket.off(
        BuilderSocketEvent.AgentRequestChange,
        handleAgentRequestChange
      )
    }
  })
</script>

<div class="agent-actions-page">
  <div class="agent-actions-content">
    <div class="page-title">
      <Body size="M" weight="500" color="var(--spectrum-global-color-gray-900)">
        Requests
      </Body>
    </div>

    <div class="metrics-grid">
      {#each summaryMetrics as metric}
        <section class="metric-card">
          <Body size="XL" weight="600">
            {metric.value.toLocaleString()}
          </Body>
          <Body size="S" color="var(--spectrum-global-color-gray-600)">
            {metric.label}
          </Body>
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
  </div>

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
    justify-content: center;
    min-height: 100%;
    padding: 0 var(--spacing-l);
    box-sizing: border-box;
    background: var(--background-alt);
  }

  .agent-actions-content {
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
    max-width: 1280px;
    padding: 20px 0 32px;
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: var(--spacing-m);
  }

  .metric-card {
    background: var(--spectrum-global-color-gray-100);
    border-radius: 4px;
    padding: var(--spacing-m) var(--spacing-l);
    display: flex;
    flex-direction: column;
    gap: calc(var(--spacing-s) - var(--spacing-xs));
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

  .requests-table-panel :global(.spectrum-Table) {
    border-radius: var(--border-radius-s);
    overflow: hidden;
  }

  .requests-table-panel :global(.spectrum-Table-headCell) {
    background: var(--spectrum-global-color-gray-100);
    border-top: none;
    border-left: none;
    border-right: none;
    border-bottom: 1px solid var(--spectrum-global-color-gray-200);
    text-transform: none;
    color: var(--spectrum-global-color-gray-700);
    font-family: var(--font-sans);
    font-size: var(--font-size-s);
    font-weight: 400;
    letter-spacing: normal;
    height: auto;
    padding: 8px 12px;
  }

  .requests-table-panel :global(.spectrum-Table-row) {
    background: var(--spectrum-global-color-gray-100);
  }

  .requests-table-panel
    :global(.spectrum-Table-row.clickable:hover .spectrum-Table-cell) {
    background-color: var(--spectrum-global-color-gray-200);
  }

  .requests-table-panel :global(.spectrum-Table-cell) {
    background: var(--spectrum-global-color-gray-100);
    border-left: 0;
    border-right: 0;
    border-bottom: 1px solid var(--spectrum-global-color-gray-200);
    height: auto;
    padding: 8px 12px;
    font-family: var(--font-sans);
    font-size: var(--font-size-m);
    line-height: 1.5;
    color: var(--spectrum-global-color-gray-700);
  }

  .requests-table-panel :global(.spectrum-Table-cell:nth-child(1)) {
    color: var(--spectrum-global-color-gray-800);
  }

  .requests-table-panel :global(.placeholder) {
    background: var(--spectrum-global-color-gray-100);
    color: var(--spectrum-global-color-gray-700);
    border: none;
  }

  @media (max-width: 1280px) {
    .metrics-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .requests-table-panel {
      overflow-x: auto;
    }
  }

  @media (max-width: 720px) {
    .agent-actions-content {
      padding: 20px 0 24px;
    }

    .table-footer {
      flex-direction: column;
      align-items: flex-start;
    }
  }
</style>
