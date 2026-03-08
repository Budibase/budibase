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
  import { formatLogDateForApi, formatTime } from "./LogComponents/utils"
  import { notifications } from "@budibase/bbui"

  type TimeRange = "1h" | "8h" | "24h" | "7d" | "30d"

  let sessions = $state<AgentLogSession[]>([])
  let loading = $state(false)
  let selectedSession = $state<AgentLogSession | null>(null)
  let expandedStepId = $state<string | null>(null)
  let currentPage = $state(0)
  let hasMore = $state(false)
  let deepLinkedSessionId = $state<string | null>(null)

  let stepDetailsByRequestId = $state<Record<string, AgentLogRequestDetail>>({})
  let stepLoadingByRequestId = $state<Record<string, boolean>>({})

  let statusFilter = $state<string>("all")
  let timeRange = $state<TimeRange>("7d")
  let triggerFilter = $state<string>("all")

  let mounted = false

  const HOUR = 60 * 60 * 1000
  const DAY = 24 * HOUR
  const TIME_RANGE_MS: Record<TimeRange, number> = {
    "1h": HOUR,
    "8h": 8 * HOUR,
    "24h": DAY,
    "7d": 7 * DAY,
    "30d": 30 * DAY,
  }

  function getDateRange(): { startDate: string; endDate: string } {
    const now = new Date()
    const endDate = formatLogDateForApi(new Date(now.getTime() + DAY))
    const includeTime = ["1h", "8h", "24h"].includes(timeRange)
    const start = new Date(now.getTime() - TIME_RANGE_MS[timeRange])

    return {
      startDate: formatLogDateForApi(start, { includeTime }),
      endDate,
    }
  }

  function resetDetailState() {
    stepDetailsByRequestId = {}
    stepLoadingByRequestId = {}
    expandedStepId = null
  }

  function readLinkedSessionId(): string | null {
    if (typeof window === "undefined") {
      return null
    }
    return new URLSearchParams(window.location.search).get("sessionId")
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
      })

      sessions = response.sessions
      currentPage = response.currentPage
      hasMore = response.hasMore

      const current = selectedSession
      const selectedStillExists = current
        ? response.sessions.some(s => s.sessionId === current.sessionId)
        : false

      if (
        !selectedStillExists &&
        current?.sessionId !== deepLinkedSessionId
      ) {
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

  async function selectSession(session: AgentLogSession) {
    const agentId = $selectedAgent?._id
    selectedSession = session
    resetDetailState()

    if (!agentId) {
      await prefetchSessionDetails(session)
      return
    }

    try {
      const fullSession = await API.fetchAgentLogSession(
        agentId,
        session.sessionId
      )
      if (selectedSession?.sessionId !== session.sessionId) {
        return
      }
      if (!fullSession) {
        throw new Error("Session detail not found")
      }
      selectedSession = fullSession
      await prefetchSessionDetails(fullSession)
    } catch (error) {
      notifications.error("Failed to fetch full session detail")
      if (selectedSession?.sessionId === session.sessionId) {
        selectedSession = null
        resetDetailState()
      }
    }
  }

  async function loadLinkedSession() {
    const agentId = $selectedAgent?._id
    if (!agentId || !deepLinkedSessionId) {
      return
    }

    try {
      const fullSession = await API.fetchAgentLogSession(
        agentId,
        deepLinkedSessionId
      )
      if (!fullSession) {
        notifications.error("Linked session was not found")
        return
      }
      selectedSession = fullSession
      resetDetailState()
      await prefetchSessionDetails(fullSession)
    } catch (error) {
      notifications.error("Failed to fetch linked session")
    }
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
      loadSessions(0)
    }
  })

  onMount(() => {
    mounted = true
    deepLinkedSessionId = readLinkedSessionId()
    loadSessions(0)
    loadLinkedSession()
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
