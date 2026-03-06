<script lang="ts">
  import { API } from "@/api"
  import { selectedAgent } from "@/stores/portal"
  import { onMount } from "svelte"
  import type {
    AgentLogEntry,
    AgentLogRequestDetail,
    AgentLogSession,
  } from "@budibase/types"
  import LogsSessionDetail from "./LogComponents/LogsSessionDetail.svelte"
  import LogsSessionList from "./LogComponents/LogsSessionList.svelte"
  import { formatTime } from "./LogComponents/utils"

  let sessions = $state<AgentLogSession[]>([])
  let loading = $state(false)
  let selectedSession = $state<AgentLogSession | null>(null)
  let expandedStepId = $state<string | null>(null)
  let currentPage = $state(0)
  let hasMore = $state(false)

  let stepDetailsByRequestId = $state<Record<string, AgentLogRequestDetail>>({})
  let stepLoadingByRequestId = $state<Record<string, boolean>>({})

  let statusFilter = $state<string>("all")
  let timeRange = $state<string>("7d")
  let triggerFilter = $state<string>("all")

  let mounted = false

  function getDateRange(): { startDate: string; endDate: string } {
    const now = new Date()
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    const endDate = tomorrow.toISOString().split("T")[0]

    let start = new Date(now)
    switch (timeRange) {
      case "1h":
        start = new Date(now.getTime() - 60 * 60 * 1000)
        break
      case "8h":
        start = new Date(now.getTime() - 8 * 60 * 60 * 1000)
        break
      case "24h":
        start = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        break
      case "7d":
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case "30d":
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
    }

    return { startDate: start.toISOString().split("T")[0], endDate }
  }

  function resetDetailState() {
    stepDetailsByRequestId = {}
    stepLoadingByRequestId = {}
    expandedStepId = null
  }

  let filteredSessions = $derived.by(() => {
    let result = sessions
    if (statusFilter !== "all") {
      result = result.filter(s => s.status === statusFilter)
    }
    if (triggerFilter !== "all") {
      result = result.filter(s => s.trigger === triggerFilter)
    }
    return result
  })

  let sessionTableData = $derived.by(() =>
    filteredSessions.map(session => ({
      sessionId: session.sessionId,
      trigger: session.trigger,
      startTime: formatTime(session.startTime),
      operations: session.operations,
    }))
  )

  async function loadSessions(page = 0) {
    const agentId = $selectedAgent?._id
    if (!agentId) {
      sessions = []
      selectedSession = null
      resetDetailState()
      return
    }

    loading = true
    try {
      const { startDate, endDate } = getDateRange()
      const response = await API.fetchAgentLogs(agentId, {
        startDate,
        endDate,
        page,
        pageSize: 20,
      })

      sessions = response.sessions
      currentPage = response.currentPage
      hasMore = response.hasMore

      const selectedStillExists = selectedSession
        ? response.sessions.some(s => s.sessionId === selectedSession.sessionId)
        : false
      if (!selectedStillExists) {
        selectedSession = null
        resetDetailState()
      }
    } catch (error) {
      console.error("Failed to fetch agent logs", error)
      sessions = []
      selectedSession = null
      resetDetailState()
    } finally {
      loading = false
    }
  }

  async function loadStepDetail(entry: AgentLogEntry): Promise<void> {
    const agentId = $selectedAgent?._id
    if (!agentId) return

    if (
      stepDetailsByRequestId[entry.requestId] ||
      stepLoadingByRequestId[entry.requestId]
    ) {
      return
    }

    stepLoadingByRequestId = {
      ...stepLoadingByRequestId,
      [entry.requestId]: true,
    }

    try {
      const { startDate } = getDateRange()
      const detail = await API.fetchAgentLogDetail(
        agentId,
        entry.requestId,
        startDate
      )
      stepDetailsByRequestId = {
        ...stepDetailsByRequestId,
        [entry.requestId]: detail,
      }
    } catch (error) {
      console.error("Failed to fetch step detail", error)
    } finally {
      stepLoadingByRequestId = {
        ...stepLoadingByRequestId,
        [entry.requestId]: false,
      }
    }
  }

  async function prefetchSessionDetails(
    session: AgentLogSession
  ): Promise<void> {
    await Promise.all(session.entries.map(entry => loadStepDetail(entry)))
  }

  function selectSession(session: AgentLogSession) {
    selectedSession = session
    resetDetailState()
    prefetchSessionDetails(session)
  }

  function onSessionRowClick(row: { sessionId?: string }) {
    if (!row.sessionId) {
      return
    }
    const session = filteredSessions.find(
      item => item.sessionId === row.sessionId
    )
    if (session) {
      selectSession(session)
    }
  }

  async function toggleStep(entry: AgentLogEntry) {
    if (expandedStepId === entry.requestId) {
      expandedStepId = null
      return
    }

    expandedStepId = entry.requestId
    await loadStepDetail(entry)
  }

  $effect(() => {
    statusFilter
    timeRange
    triggerFilter

    if (mounted) {
      void loadSessions(0)
    }
  })

  onMount(() => {
    mounted = true
    void loadSessions(0)
  })
</script>

<div class="logs-container">
  <div class="logs-split">
    <div class="logs-table-panel">
      <LogsSessionList
        {loading}
        {sessionTableData}
        {hasMore}
        {currentPage}
        bind:statusFilter
        bind:timeRange
        bind:triggerFilter
        {onSessionRowClick}
        onPrevPage={() => loadSessions(currentPage - 1)}
        onNextPage={() => loadSessions(currentPage + 1)}
      />
    </div>

    <div class="detail-panel">
      <LogsSessionDetail
        {selectedSession}
        {expandedStepId}
        {stepDetailsByRequestId}
        {stepLoadingByRequestId}
        onToggleStep={toggleStep}
      />
    </div>
  </div>
</div>

<style>
  .logs-container {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    height: 100%;
    min-height: 0;
  }

  .logs-split {
    display: flex;
    flex: 1 1 auto;
    height: 100%;
    min-height: 0;
    overflow: hidden;
    background: var(--background);
  }

  .logs-table-panel {
    flex: 0 0 52%;
    min-width: 420px;
    max-width: 60%;
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
    border-right: 1px solid var(--spectrum-global-color-gray-200);
    background: var(--background);
  }

  .detail-panel {
    flex: 1 1 auto;
    min-width: 0;
    min-height: 0;
    overflow-y: auto;
    background: var(--background-alt);
    scrollbar-width: thin;
  }

  .detail-panel::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  .detail-panel::-webkit-scrollbar-track {
    background: transparent;
  }

  .detail-panel::-webkit-scrollbar-thumb {
    background: var(--spectrum-global-color-gray-300);
    border-radius: 3px;
  }

  @media (max-width: 1400px) {
    .logs-split {
      flex-direction: column;
    }

    .logs-table-panel {
      flex: none;
      min-width: 0;
      max-width: none;
      border-right: none;
      border-bottom: 1px solid var(--spectrum-global-color-gray-200);
      max-height: 360px;
    }
  }
</style>
