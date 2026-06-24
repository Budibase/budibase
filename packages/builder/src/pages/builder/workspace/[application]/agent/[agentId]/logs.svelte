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
  import LogsSessionDetail from "./LogComponents/LogsSessionDetail.svelte"
  import LogsSessionList from "./LogComponents/LogsSessionList.svelte"
  import {
    formatLogDateForApi,
    formatTime,
    parseAssistantResponse,
  } from "./LogComponents/utils"
  import { notifications } from "@budibase/bbui"

  const AGENT_LOG_SESSION_LIMIT = 75

  let sessions = $state<AgentLogSession[]>([])
  let loading = $state(false)
  let selectedSession = $state<AgentLogSession | null>(null)
  let expandedStepId = $state<string | null>(null)
  let stepDetailCache = $state<Record<string, AgentLogRequestDetail>>({})
  let loadingStepIds = $state<Record<string, boolean>>({})
  let exportingSession = $state(false)
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
      return
    }

    expandedStepId = entry.requestId
    await loadStepDetail(entry)
  }

  function formatTranscriptBlock(label: string, content: string | undefined) {
    const trimmed = content?.trim()
    if (!trimmed) {
      return ""
    }

    return `${label}\n${trimmed}`
  }

  function formatTranscriptToolList(
    label: string,
    items: Array<{
      name: string
      displayName?: string
      arguments?: string
      content?: string
      toolCallId?: string
      id?: string
    }>
  ) {
    if (!items.length) {
      return ""
    }

    const lines = [label]
    for (const item of items) {
      const name = item.displayName || item.name
      const id = item.id || item.toolCallId
      lines.push(id ? `- ${name} (${id})` : `- ${name}`)
      if (item.arguments) {
        lines.push(item.arguments)
      }
      if (item.content) {
        lines.push(item.content)
      }
    }

    return lines.join("\n")
  }

  function formatTranscriptError(detail: AgentLogRequestDetail) {
    if (!detail.error) {
      return ""
    }

    const lines = [detail.error.message]
    if (detail.error.code) {
      lines.push(`Code: ${detail.error.code}`)
    }
    if (detail.error.errorClass) {
      lines.push(`Class: ${detail.error.errorClass}`)
    }
    if (detail.error.provider) {
      lines.push(`Provider: ${detail.error.provider}`)
    }
    if (detail.error.traceback) {
      lines.push(detail.error.traceback)
    }

    return formatTranscriptBlock("Error", lines.join("\n"))
  }

  function buildSessionTranscript(
    session: AgentLogSession,
    details: AgentLogRequestDetail[]
  ) {
    const lines = [
      "Agent Log Session",
      "",
      `Session ID: ${session.sessionId}`,
      `Environment: ${session.environment}`,
      `Trigger: ${session.trigger}`,
      `Status: ${session.status}`,
      `Started: ${formatTime(session.startTime)}`,
      `First input: ${session.firstInput || "-"}`,
      `Steps: ${session.entries.length}`,
      "",
    ]

    details.forEach((detail, index) => {
      const entry = session.entries.find(
        item => item.requestId === detail.requestId
      )
      const assistantResponse = parseAssistantResponse(detail.response)
      const sections = [
        `Step ${index + 1}`,
        `Request ID: ${detail.requestId}`,
        `Model: ${detail.model}`,
        `Status: ${entry?.status || "unknown"}`,
        `Started: ${formatTime(detail.startTime)}`,
        `Tokens: ${detail.inputTokens} in / ${detail.outputTokens} out`,
        "",
        "Messages sent to model",
        ...detail.messages.map(message => {
          const role = message.role.toUpperCase()
          return `${role}:\n${message.content || "[empty]"}`
        }),
        formatTranscriptBlock(
          "Assistant response",
          assistantResponse.response || detail.response
        ),
        formatTranscriptToolList("Input tool calls", detail.inputToolCalls),
        formatTranscriptToolList("Tool calls", detail.toolCalls),
        formatTranscriptToolList("Tool results", detail.toolResults),
        formatTranscriptError(detail),
      ].filter(Boolean)

      lines.push(sections.join("\n"), "", "---", "")
    })

    return lines.join("\n")
  }

  function downloadTextFile(filename: string, content: string) {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    link.style.display = "none"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  function getTranscriptFilename(session: AgentLogSession) {
    const sessionId = session.sessionId.replace(/[^a-zA-Z0-9-_]/g, "-")
    return `agent-log-${sessionId}.txt`
  }

  async function exportSessionTranscript(session: AgentLogSession) {
    const agentId = $selectedAgent?._id
    if (!agentId || exportingSession) {
      return
    }

    exportingSession = true
    try {
      const details = await Promise.all(
        session.entries.map(entry =>
          API.fetchAgentLogDetail(agentId, entry.requestId)
        )
      )
      const transcript = buildSessionTranscript(session, details)
      downloadTextFile(getTranscriptFilename(session), transcript)
    } catch (error) {
      console.error("Failed to export session transcript", error)
      notifications.error("Failed to export session transcript")
    } finally {
      exportingSession = false
    }
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
        {stepDetailCache}
        {expandedStepLoading}
        exportSessionLoading={exportingSession}
        onToggleStep={toggleStep}
        onExportSession={exportSessionTranscript}
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
</style>
