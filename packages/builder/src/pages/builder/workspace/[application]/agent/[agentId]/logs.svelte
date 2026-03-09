<script lang="ts">
  import { API } from "@/api"
  import { selectedAgent } from "@/stores/portal"
  import { admin } from "@/stores/portal/admin"
  import dayjs, { type Dayjs } from "dayjs"
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

  let sessions = $state<AgentLogSession[]>([])
  let loading = $state(false)
  let selectedSession = $state<AgentLogSession | null>(null)
  let expandedStepId = $state<string | null>(null)
  let expandedStepDetail = $state<AgentLogRequestDetail | null>(null)
  let expandedStepLoading = $state(false)
  let hasMore = $state(false)
  let nextBookmark = $state<string | undefined>(undefined)
  let deepLinkedSessionId = $state<string | null>(null)
  let linkedSessionLoaded = $state(false)

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
      startDate: formatLogDateForApi((start || fallbackStart).toDate()),
      endDate: formatLogDateForApi((end || fallbackEnd).toDate()),
    }
  }

  function resetDetailState() {
    expandedStepId = null
    expandedStepDetail = null
    expandedStepLoading = false
  }

  function readLinkedSessionId(): string | null {
    if (typeof window === "undefined") {
      return null
    }
    return new URLSearchParams(window.location.search).get("sessionId")
  }

  let visibleSessions = $derived.by(() => sessions)

  let sessionTableData = $derived.by(() =>
    visibleSessions.map(session => ({
      sessionId: session.sessionId,
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
        limit: 75,
        statusFilter,
        triggerFilter,
      })

      const nextSessions = append
        ? [
            ...sessions,
            ...response.sessions.filter(
              session =>
                !sessions.some(
                  existing => existing.sessionId === session.sessionId
                )
            ),
          ]
        : response.sessions

      sessions = nextSessions
      hasMore = response.hasMore
      nextBookmark = response.nextBookmark

      const current = selectedSession
      const selectedStillExists = current
        ? nextSessions.some(s => s.sessionId === current.sessionId)
        : false

      if (
        !append &&
        !selectedStillExists &&
        current?.sessionId !== deepLinkedSessionId
      ) {
        selectedSession = null
        resetDetailState()
      }
    } catch (error) {
      console.error("Failed to fetch agent logs", error)
      if (!append) {
        sessions = []
        hasMore = false
        nextBookmark = undefined
        selectedSession = null
        resetDetailState()
      }
    } finally {
      loading = false
    }
  }

  async function loadStepDetail(entry: AgentLogEntry): Promise<void> {
    const agentId = $selectedAgent?._id
    if (!agentId) return

    if (expandedStepLoading || expandedStepDetail?.requestId === entry.requestId) {
      return
    }

    expandedStepLoading = true
    expandedStepDetail = null

    try {
      const detail = await API.fetchAgentLogDetail(agentId, entry.requestId)
      if (expandedStepId === entry.requestId) {
        expandedStepDetail = detail
      }
    } catch (error) {
      console.error("Failed to fetch step detail", error)
    } finally {
      if (expandedStepId === entry.requestId) {
        expandedStepLoading = false
      }
    }
  }

  async function selectSession(session: AgentLogSession) {
    const agentId = $selectedAgent?._id
    selectedSession = session
    resetDetailState()

    if (!agentId) {
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
    } catch (error) {
      notifications.error("Failed to fetch linked session")
    }
  }

  function onSessionRowClick(row: { sessionId?: string }) {
    if (!row.sessionId) {
      return
    }
    const session = visibleSessions.find(
      item => item.sessionId === row.sessionId
    )
    if (session) {
      selectSession(session)
    }
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
      expandedStepDetail = null
      expandedStepLoading = false
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
      linkedSessionLoaded = false
      loadSessions()
    }
  })

  $effect(() => {
    if (
      mounted &&
      !linkedSessionLoaded &&
      deepLinkedSessionId &&
      $selectedAgent?._id
    ) {
      linkedSessionLoaded = true
      loadLinkedSession()
    }
  })

  onMount(() => {
    mounted = true
    deepLinkedSessionId = readLinkedSessionId()
    loadSessions()
  })
</script>

<div class="logs-container">
  <div class="logs-split">
    <div class="logs-table-panel">
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
    </div>

    <div class="detail-panel">
      <LogsSessionDetail
        selectedSession={visibleSelectedSession}
        {expandedStepId}
        {expandedStepDetail}
        {expandedStepLoading}
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
