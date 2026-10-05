<script lang="ts">
  import { API } from "@/api"
  import { agentsStore } from "@/stores/portal"
  import { users } from "@/stores/portal/users"
  import { builderStore } from "@/stores/builder"
  import { Pagination, Select, Table, notifications } from "@budibase/bbui"
  import { BuilderSocketEvent } from "@budibase/shared-core"
  import type {
    AgentRequest,
    AgentRequestsSummary,
    AgentRequestStatus,
  } from "@budibase/types"
  import dayjs from "dayjs"
  import relativeTime from "dayjs/plugin/relativeTime"
  import ActivityActionsRenderer from "./ActivityActionsRenderer.svelte"
  import ActivityFilters from "./ActivityFilters.svelte"
  import ActivityPage from "./ActivityPage.svelte"
  import ActivitySidePanel from "./ActivitySidePanel.svelte"
  import ActivityStatusRenderer from "./ActivityStatusRenderer.svelte"
  import ActivitySummaryCards, {
    type SummaryMetric,
  } from "./ActivitySummaryCards.svelte"
  import ActivityTablePanel from "./ActivityTablePanel.svelte"

  dayjs.extend(relativeTime)

  interface RequestRow {
    id: string
    title: string
    sourceLabel: string
    status: AgentRequestStatus
    updatedLabel: string
    actions: string
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

  type StatusFilter = AgentRequestStatus | "all"

  let loading = $state(false)
  let currentPage = $state(1)
  let statusFilter = $state<StatusFilter>("all")
  let selectedRequestId = $state<string | null>(null)
  let allRequests = $state<AgentRequest[]>([])
  let summary = $state<AgentRequestsSummary | null>(null)
  let userNames = $state<Record<string, string>>({})

  let filteredTotal = $derived.by(() => {
    if (!summary) {
      return 0
    }
    return statusFilter === "all" ? summary.total : summary[statusFilter]
  })

  let hasNextPage = $derived.by(() => {
    return filteredTotal > currentPage * PAGE_SIZE
  })

  // Ticks on an interval purely to force updatedLabel to re-derive
  let now = $state(Date.now())

  const requestStatusMeta: Record<RequestRow["status"], { label: string }> = {
    active: { label: "Processing" },
    needs_input: { label: "Needs input" },
    completed: { label: "Completed" },
    failed: { label: "Failed" },
  }

  const statusFilterOptions: { label: string; value: StatusFilter }[] = [
    { label: "All statuses", value: "all" },
    ...(Object.keys(requestStatusMeta) as AgentRequestStatus[]).map(status => ({
      label: requestStatusMeta[status].label,
      value: status,
    })),
  ]

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

    return `Showing ${start}–${end} of ${filteredTotal} items`
  })

  const loadRequests = (() => {
    let requestSequence = 0

    return async function loadRequests(page = currentPage) {
      const sequence = ++requestSequence

      if (!($agentsStore.agents || []).length) {
        allRequests = []
        summary = null
        loading = false
        return
      }

      loading = true
      try {
        const response = await API.fetchAgentRequests({
          limit: PAGE_SIZE,
          page,
          status: statusFilter === "all" ? undefined : statusFilter,
        })
        if (sequence !== requestSequence) {
          // A newer request was issued while this one was in flight - discard
          // this stale response so it can't overwrite fresher state.
          return
        }
        allRequests = response.requests
        summary = response.summary
        try {
          await hydrateUserNames(response.requests)
        } catch (error) {
          console.error("Failed to hydrate agent request user names", error)
        }
      } catch (error) {
        if (sequence !== requestSequence) {
          return
        }
        console.error("Failed to fetch agent requests", error)
        notifications.error("Failed to load agent actions")
        allRequests = []
        summary = null
      } finally {
        if (sequence === requestSequence) {
          loading = false
        }
      }
    }
  })()

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

  function changeStatusFilter(nextFilter: StatusFilter) {
    if (nextFilter === statusFilter) {
      return
    }

    statusFilter = nextFilter
    currentPage = 1
    selectedRequestId = null
    loadRequests(1)
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
    const interval = setInterval(() => {
      now = Date.now()
    }, RELATIVE_TIME_REFRESH_MS)
    return () => clearInterval(interval)
  })

  $effect(() => {
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
      // With a status filter active, a change can move a request in or out
      // of the filtered set (e.g. it stops being "Failed"), which a local
      // patch can't express correctly - only a re-fetch can. loadRequests
      // also refreshes summary from the server, so no manual patch is needed.
      if (statusFilter !== "all") {
        await loadRequests(currentPage)
        return
      }

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
        try {
          await hydrateUserNames([request])
        } catch (error) {
          console.error("Failed to hydrate agent request user name", error)
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

      if (allRequests.length >= PAGE_SIZE) {
        hasNextPage = true
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

<ActivityPage>
  <ActivitySummaryCards metrics={summaryMetrics} />

  <ActivityFilters>
    <Select
      size="M"
      autoWidth
      placeholder={false}
      options={statusFilterOptions}
      value={statusFilter}
      on:change={({ detail }) => changeStatusFilter(detail)}
    />
  </ActivityFilters>

  <ActivityTablePanel>
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
  </ActivityTablePanel>

  <ActivitySidePanel
    open={!!selectedRequest}
    title={selectedRequest ? getRequestTitle(selectedRequest) : "Request"}
    request={selectedRequest}
    agentName={selectedRequestAgentName}
    createdBy={selectedRequestCreatedBy}
    onClose={closeRequestPanel}
  />
</ActivityPage>

<style>
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

  @media (max-width: 720px) {
    .table-footer {
      flex-direction: column;
      align-items: flex-start;
    }
  }
</style>
