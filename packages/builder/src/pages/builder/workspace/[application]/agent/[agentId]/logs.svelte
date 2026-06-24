<script lang="ts">
  import { API } from "@/api"
  import { selectedAgent } from "@/stores/portal"
  import dayjs, { type Dayjs } from "dayjs"
  import { onMount } from "svelte"
  import type {
    AgentLogEnvironment,
    AgentLogEntry,
    AgentLogRequestDetail,
    AgentLogSession,
  } from "@budibase/types"
  import LogsSessionDetailPanel from "./LogComponents/LogsSessionDetailPanel.svelte"
  import LogsSessionList from "./LogComponents/LogsSessionList.svelte"
  import { formatLogDateForApi, formatTime } from "./LogComponents/utils"
  import { notifications } from "@budibase/bbui"

  const AGENT_LOG_SESSION_LIMIT = 75

  let sessions = $state<AgentLogSession[]>([])
  let loading = $state(false)
  let selectedSession = $state<AgentLogSession | null>(null)
  let detailPanelOpen = $state(false)
  let expandedStepId = $state<string | null>(null)
  let stepDetailCache = $state<Record<string, AgentLogRequestDetail>>({})
  let loadingStepIds = $state<Record<string, boolean>>({})
  let hasMore = $state(false)
  let nextBookmark = $state<string | undefined>(undefined)

  let statusFilter = $state<string>("all")
  let dateRange = $state<[Dayjs | null, Dayjs | null]>([
    dayjs().subtract(7, "days"),
    dayjs(),
  ])
  let triggerFilter = $state<string>("all")

  let mounted = false

  function getDateRange(): { startDate: string; endDate: string } {
    const [start, end] = dateRange
    const fallbackEnd = dayjs()
    const fallbackStart = fallbackEnd.subtract(7, "days")

    return {
      startDate: formatLogDateForApi(start || fallbackStart),
      endDate: formatLogDateForApi(end || fallbackEnd),
    }
  }

  function resetDetailState() {
    expandedStepId = null
    stepDetailCache = {}
    loadingStepIds = {}
  }

  let expandedStepLoading = $derived(
    expandedStepId != null && !!loadingStepIds[expandedStepId]
  )

  let visibleSessions = $derived.by(() => sessions)

  let sessionTableData = $derived.by(() =>
    visibleSessions.map(session => ({
      sessionId: session.sessionId,
      environment: session.environment,
      environmentLabel:
        session.environment === "production" ? "Production" : "Development",
      trigger: session.trigger,
      startTime: formatTime(session.startTime),
      operations: session.operations,
    }))
  )

  let visibleSelectedSession = $derived.by(() => {
    if (!selectedSession) {
      return null
    }
    return selectedSession
  })

  async function loadSessions(
    bookmark: string | undefined = undefined,
    { append = false }: { append?: boolean } = {}
  ) {
    const agentId = $selectedAgent?._id
    if (!agentId) {
      sessions = []
      hasMore = false
      nextBookmark = undefined
      selectedSession = null
      detailPanelOpen = false
      resetDetailState()
      return
    }

    loading = true
    try {
      const { startDate, endDate } = getDateRange()
      const response = await API.fetchAgentLogs(agentId, {
        startDate,
        endDate,
        bookmark,
        limit: AGENT_LOG_SESSION_LIMIT,
        statusFilter,
        triggerFilter,
      })

      const nextSessions = append
        ? [
            ...sessions,
            ...response.sessions.filter(
              session =>
                !sessions.some(
                  existing =>
                    existing.sessionId === session.sessionId &&
                    existing.environment === session.environment
                )
            ),
          ]
        : response.sessions

      sessions = nextSessions
      hasMore = response.hasMore
      nextBookmark = response.nextBookmark

      const current = selectedSession
      const selectedStillExists = current
        ? nextSessions.some(
            s =>
              s.sessionId === current.sessionId &&
              s.environment === current.environment
          )
        : false

      if (!append && !selectedStillExists) {
        selectedSession = null
        detailPanelOpen = false
        resetDetailState()
      }
    } catch (error) {
      console.error("Failed to fetch agent logs", error)
      if (!append) {
        sessions = []
        hasMore = false
        nextBookmark = undefined
        selectedSession = null
        detailPanelOpen = false
        resetDetailState()
      }
    } finally {
      loading = false
    }
  }

  async function loadStepDetail(entry: AgentLogEntry): Promise<void> {
    const agentId = $selectedAgent?._id
    const requestedSessionId = selectedSession?.sessionId
    const requestedEnvironment = selectedSession?.environment

    if (!agentId || !requestedSessionId || !requestedEnvironment) {
      return
    }

    if (stepDetailCache[entry.requestId] || loadingStepIds[entry.requestId]) {
      return
    }

    loadingStepIds = {
      ...loadingStepIds,
      [entry.requestId]: true,
    }

    try {
      const detail = await API.fetchAgentLogDetail(agentId, entry.requestId)
      const selectionUnchanged =
        selectedSession?.sessionId === requestedSessionId &&
        selectedSession?.environment === requestedEnvironment

      if (selectionUnchanged) {
        stepDetailCache = {
          ...stepDetailCache,
          [detail.requestId || entry.requestId]: detail,
        }
      }
    } catch (error) {
      console.error("Failed to fetch step detail", error)
    } finally {
      const { [entry.requestId]: _loadingStepId, ...remainingLoadingStepIds } =
        loadingStepIds
      loadingStepIds = remainingLoadingStepIds
    }
  }

  async function selectSession(session: AgentLogSession) {
    const agentId = $selectedAgent?._id
    const requestedSessionId = session.sessionId
    const requestedEnvironment = session.environment
    selectedSession = session
    resetDetailState()

    if (!agentId) return

    const isCurrentSelection = () =>
      selectedSession?.sessionId === requestedSessionId &&
      selectedSession?.environment === requestedEnvironment

    try {
      const fullSession = await API.fetchAgentLogSession(
        agentId,
        requestedSessionId,
        session.environment
      )
      if (!isCurrentSelection()) return

      if (!fullSession) {
        throw new Error("Session detail not found")
      }
      selectedSession = fullSession
    } catch (error) {
      if (!isCurrentSelection()) return
      notifications.error("Failed to fetch full session detail")
      selectedSession = null
      detailPanelOpen = false
      resetDetailState()
    }
  }

  function onSessionRowClick(row: {
    sessionId?: string
    environment?: AgentLogEnvironment
  }) {
    if (!row.sessionId || !row.environment) {
      return
    }
    const session = visibleSessions.find(
      item =>
        item.sessionId === row.sessionId && item.environment === row.environment
    )
    if (session) {
      detailPanelOpen = true
      selectSession(session)
    }
  }

  function closeDetailPanel() {
    detailPanelOpen = false
    resetDetailState()
  }

  async function loadMoreSessions() {
    if (!hasMore || loading) {
      return
    }

    await loadSessions(nextBookmark, { append: true })
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
    dateRange
    triggerFilter

    if (mounted) {
      loadSessions()
    }
  })

  onMount(() => {
    mounted = true
    loadSessions()
  })
</script>

<div class="logs-container">
  <LogsSessionList
    {loading}
    {sessionTableData}
    {hasMore}
    bind:statusFilter
    bind:dateRange
    bind:triggerFilter
    {onSessionRowClick}
    onLoadMore={loadMoreSessions}
  />

  <LogsSessionDetailPanel
    open={detailPanelOpen}
    selectedSession={visibleSelectedSession}
    {expandedStepId}
    {stepDetailCache}
    {expandedStepLoading}
    onClose={closeDetailPanel}
    onToggleStep={toggleStep}
  />
</div>

<style>
  .logs-container {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    height: 100%;
    min-height: 0;
  }
</style>
