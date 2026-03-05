<script lang="ts">
  import { Body, Icon, Select } from "@budibase/bbui"
  import { API } from "@/api"
  import { selectedAgent } from "@/stores/portal"
  import { onMount } from "svelte"
  import dayjs from "dayjs"
  import type {
    AgentLogEntry,
    AgentLogRequestDetail,
    AgentLogSession,
  } from "@budibase/types"

  interface StepFlow {
    from: string
    to: string
  }

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

  const statusOptions = [
    { label: "All statuses", value: "all" },
    { label: "Success", value: "success" },
    { label: "Error", value: "error" },
  ]

  const timeRangeOptions = [
    { label: "Last hour", value: "1h" },
    { label: "Last 8 hours", value: "8h" },
    { label: "Last 24 hours", value: "24h" },
    { label: "Last 7 days", value: "7d" },
    { label: "Last 30 days", value: "30d" },
  ]

  const triggerOptions = [
    { label: "All triggers", value: "all" },
    { label: "Chat", value: "Chat" },
    { label: "Automation", value: "Automation" },
  ]

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
        ? response.sessions.some(
            s => s.sessionId === selectedSession?.sessionId
          )
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
    await Promise.allSettled(
      session.entries.map(entry => loadStepDetail(entry))
    )
  }

  function selectSession(session: AgentLogSession) {
    selectedSession = session
    resetDetailState()
    void prefetchSessionDetails(session)
  }

  async function toggleStep(entry: AgentLogEntry) {
    if (expandedStepId === entry.requestId) {
      expandedStepId = null
      return
    }

    expandedStepId = entry.requestId
    await loadStepDetail(entry)
  }

  function getStepDetail(
    entry: AgentLogEntry
  ): AgentLogRequestDetail | undefined {
    return stepDetailsByRequestId[entry.requestId]
  }

  function isStepLoading(entry: AgentLogEntry): boolean {
    return !!stepLoadingByRequestId[entry.requestId]
  }

  function formatTime(dateStr: string): string {
    if (!dateStr) return "-"
    return dayjs(dateStr).format("MMM D, YYYY | HH:mm")
  }

  function formatSpend(spend: number): string {
    if (!spend) return "$0.0000"
    return `$${spend.toFixed(4)}`
  }

  function getStepDuration(entry: AgentLogEntry): string {
    if (!entry.startTime || !entry.endTime) return ""
    const ms =
      new Date(entry.endTime).getTime() - new Date(entry.startTime).getTime()
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(1)}s`
  }

  function calculateLatency(session: AgentLogSession): string {
    if (!session.entries.length) return "-"
    const first = session.entries[0]
    const last = session.entries[session.entries.length - 1]
    if (!first.startTime || !last.endTime) return "-"
    const ms =
      new Date(last.endTime).getTime() - new Date(first.startTime).getTime()
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(2)}s`
  }

  function getSessionInputTokens(session: AgentLogSession): number {
    return session.entries.reduce((sum, entry) => sum + entry.inputTokens, 0)
  }

  function getSessionOutputTokens(session: AgentLogSession): number {
    return session.entries.reduce((sum, entry) => sum + entry.outputTokens, 0)
  }

  function getSessionSpend(session: AgentLogSession): number {
    return session.entries.reduce((sum, entry) => sum + entry.spend, 0)
  }

  function summarizeToolNames(names: string[]): string {
    if (!names.length) {
      return ""
    }

    const counts = new Map<string, number>()
    for (const name of names) {
      counts.set(name, (counts.get(name) || 0) + 1)
    }

    return [...counts.entries()]
      .map(([name, count]) => (count > 1 ? `${name} (x${count})` : name))
      .join(", ")
  }

  function getStepFlow(
    detail: AgentLogRequestDetail | undefined,
    loadingStep: boolean
  ): StepFlow {
    if (loadingStep) {
      return {
        from: "Loading details",
        to: "...",
      }
    }

    if (!detail) {
      return {
        from: "Model input",
        to: "Model output",
      }
    }

    const inputTools = detail.toolResults.map(result => result.name)
    const fallbackInputTools = detail.inputToolCalls.map(call => call.name)
    const outputTools = detail.toolCalls.map(call => call.name)

    const from =
      summarizeToolNames(inputTools) ||
      summarizeToolNames(fallbackInputTools) ||
      "Prompt + context"

    const to =
      summarizeToolNames(outputTools) ||
      (detail.response ? "Assistant response" : "No response")

    return { from, to }
  }

  function extractUserPrompt(content: string): string {
    const trimmed = content.trim()
    const match = trimmed.match(/(?:^|\n)\s*user:\s*([\s\S]*)$/i)
    return match?.[1]?.trim() || trimmed
  }

  function formatMessages(detail: AgentLogRequestDetail): string {
    const userMessages = detail.messages
      .filter(message => message.role.toLowerCase() === "user")
      .map(message => extractUserPrompt(message.content))
      .filter(Boolean)

    if (!userMessages.length) {
      return "No user prompt"
    }

    return userMessages.join("\n\n")
  }

  function formatToolCalls(detail: AgentLogRequestDetail): string {
    if (!detail.toolCalls.length) {
      return "No tool calls"
    }

    return detail.toolCalls
      .map(toolCall => {
        const idPart = toolCall.id ? ` [${toolCall.id}]` : ""
        return `${toolCall.name}${idPart}(\n${toolCall.arguments}\n)`
      })
      .join("\n\n")
  }

  function formatToolResults(detail: AgentLogRequestDetail): string {
    if (!detail.toolResults.length) {
      return "No tool results"
    }

    return detail.toolResults
      .map(result => {
        const callId = result.toolCallId ? ` [${result.toolCallId}]` : ""
        return `${result.name}${callId}\n${result.content}`
      })
      .join("\n\n")
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
  <div class="filters-bar">
    <div class="filter-group">
      <Select
        quiet
        options={statusOptions}
        bind:value={statusFilter}
        placeholder="All statuses"
      />
    </div>
    <div class="filter-group">
      <Select
        quiet
        options={timeRangeOptions}
        bind:value={timeRange}
        placeholder="Last 7 days"
      />
    </div>
    <div class="filter-group">
      <Select
        quiet
        options={triggerOptions}
        bind:value={triggerFilter}
        placeholder="All triggers"
      />
    </div>
  </div>

  <div class="logs-split">
    <div class="logs-table-panel">
      <div class="table-wrapper">
        <div class="table">
          <div class="table-header" role="row">
            <div class="header-cell header-cell--status"></div>
            <div class="header-cell">Input</div>
            <div class="header-cell">Trigger</div>
            <div class="header-cell">Start time</div>
            <div class="header-cell">Operations</div>
          </div>

          <div class="table-body">
            {#if loading && !sessions.length}
              <div class="empty-state">
                <Body size="S" color="var(--spectrum-global-color-gray-600)">
                  Loading logs...
                </Body>
              </div>
            {:else if !filteredSessions.length}
              <div class="empty-state">
                <Body size="S" color="var(--spectrum-global-color-gray-600)">
                  No logs found for this time period
                </Body>
              </div>
            {:else}
              {#each filteredSessions as session (session.sessionId)}
                <button
                  class="row"
                  class:active={selectedSession?.sessionId ===
                    session.sessionId}
                  type="button"
                  onclick={() => selectSession(session)}
                >
                  <div class="cell cell--status">
                    <Icon
                      name={session.status === "error"
                        ? "close-circle"
                        : "checkmark-circle"}
                      size="S"
                      color={session.status === "error"
                        ? "var(--spectrum-global-color-red-600)"
                        : "#8CA171"}
                    />
                  </div>
                  <div class="cell cell--input">
                    <Body
                      size="S"
                      color="var(--spectrum-global-color-gray-900)"
                    >
                      {session.firstInput || "No input"}
                    </Body>
                  </div>
                  <div class="cell">
                    <span class="trigger-badge">{session.trigger}</span>
                  </div>
                  <div class="cell">
                    <Body
                      size="S"
                      color="var(--spectrum-global-color-gray-700)"
                    >
                      {formatTime(session.startTime)}
                    </Body>
                  </div>
                  <div class="cell">
                    <Body
                      size="S"
                      color="var(--spectrum-global-color-gray-700)"
                    >
                      {session.operations}
                    </Body>
                  </div>
                </button>
              {/each}
            {/if}
          </div>
        </div>

        {#if hasMore || currentPage > 0}
          <div class="pagination">
            <button
              class="pagination-btn"
              disabled={currentPage === 0}
              onclick={() => loadSessions(currentPage - 1)}
            >
              <Icon
                name="chevron-left"
                size="S"
                color="var(--spectrum-global-color-gray-700)"
              />
            </button>
            <Body size="S" color="var(--spectrum-global-color-gray-600)">
              Page {currentPage + 1}
            </Body>
            <button
              class="pagination-btn"
              disabled={!hasMore}
              onclick={() => loadSessions(currentPage + 1)}
            >
              <Icon
                name="chevron-right"
                size="S"
                color="var(--spectrum-global-color-gray-700)"
              />
            </button>
          </div>
        {/if}
      </div>
    </div>

    <div class="detail-panel">
      {#if selectedSession}
        <div class="detail-content">
          <div class="detail-header">
            <h3 class="detail-title">Log</h3>
            <div class="detail-header-stats">
              <span class="header-stat"
                >{selectedSession.entries.length} steps</span
              >
              <span class="header-stat"
                >{calculateLatency(selectedSession)}</span
              >
            </div>
          </div>

          <div class="detail-meta">
            <div class="meta-row">
              <span class="meta-label">Input</span>
              <span class="meta-value">{selectedSession.firstInput || "-"}</span
              >
            </div>
            <div class="meta-row">
              <span class="meta-label">Status</span>
              <span
                class="meta-value"
                class:meta-value--success={selectedSession.status === "success"}
                class:meta-value--error={selectedSession.status === "error"}
              >
                {selectedSession.status === "success" ? "Success" : "Error"}
              </span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Trigger</span>
              <span class="meta-value">{selectedSession.trigger}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Tokens (in/out)</span>
              <span class="meta-value">
                {getSessionInputTokens(selectedSession)} / {getSessionOutputTokens(
                  selectedSession
                )}
              </span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Spend</span>
              <span class="meta-value"
                >{formatSpend(getSessionSpend(selectedSession))}</span
              >
            </div>
            <div class="meta-row">
              <span class="meta-label">Started</span>
              <span class="meta-value"
                >{formatTime(selectedSession.startTime)}</span
              >
            </div>
          </div>

          <div class="steps-section">
            <h4 class="steps-title">Execution steps</h4>
            <div class="steps-list">
              {#each selectedSession.entries as entry, index (entry.requestId)}
                {@const detail = getStepDetail(entry)}
                {@const loadingStep = isStepLoading(entry)}
                {@const flow = getStepFlow(detail, loadingStep)}

                <div
                  class="step"
                  class:step--expanded={expandedStepId === entry.requestId}
                >
                  <button
                    class="step-header"
                    type="button"
                    onclick={() => toggleStep(entry)}
                  >
                    <div class="step-number">{index + 1}</div>
                    <div class="step-flow">
                      <div class="step-flow-main">
                        <span class="step-flow-from">{flow.from}</span>
                        <span class="step-flow-arrow">→</span>
                        <span class="step-flow-to">{flow.to}</span>
                      </div>
                      <div class="step-model">{entry.model}</div>
                    </div>
                    <div class="step-metrics">
                      <span class="step-token-metric"
                        >{entry.inputTokens} → {entry.outputTokens}</span
                      >
                      <span
                        class="step-duration"
                        class:step-duration--slow={entry.startTime &&
                          entry.endTime &&
                          new Date(entry.endTime).getTime() -
                            new Date(entry.startTime).getTime() >
                            2000}
                      >
                        {getStepDuration(entry)}
                      </span>
                      <Icon
                        name={expandedStepId === entry.requestId
                          ? "chevron-down"
                          : "chevron-right"}
                        size="S"
                        color="var(--spectrum-global-color-gray-600)"
                      />
                    </div>
                  </button>

                  {#if expandedStepId === entry.requestId}
                    <div class="step-body">
                      {#if loadingStep && !detail}
                        <div class="step-loading">
                          <Body
                            size="S"
                            color="var(--spectrum-global-color-gray-600)"
                          >
                            Loading step detail...
                          </Body>
                        </div>
                      {:else if detail}
                        <div class="step-pill-row">
                          <span class="step-pill">Model: {detail.model}</span>
                          <span class="step-pill"
                            >Input calls: {detail.inputToolCalls.length}</span
                          >
                          <span class="step-pill"
                            >Output calls: {detail.toolCalls.length}</span
                          >
                          <span class="step-pill"
                            >Tool results: {detail.toolResults.length}</span
                          >
                        </div>

                        <div class="io-grid">
                          <div class="io-panel">
                            <h5 class="io-title">Input</h5>
                            <div class="code-block">
                              <pre><code>{formatMessages(detail)}</code></pre>
                            </div>
                            <div class="code-block">
                              <pre><code>{formatToolResults(detail)}</code
                                ></pre>
                            </div>
                          </div>

                          <div class="io-panel">
                            <h5 class="io-title">Output</h5>
                            <div class="code-block">
                              <pre><code
                                  >{detail.response || "No response"}</code
                                ></pre>
                            </div>
                            <div class="code-block">
                              <pre><code>{formatToolCalls(detail)}</code></pre>
                            </div>
                          </div>
                        </div>
                      {/if}
                    </div>
                  {/if}
                </div>
              {/each}
            </div>
          </div>
        </div>
      {:else}
        <div class="detail-empty">
          <Icon
            name="clock"
            size="L"
            color="var(--spectrum-global-color-gray-500)"
          />
          <Body size="S" color="var(--spectrum-global-color-gray-600)">
            Select a session to view details
          </Body>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .logs-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
    gap: 0;
  }

  .filters-bar {
    display: flex;
    gap: var(--spacing-m);
    padding-bottom: var(--spacing-l);
    flex-wrap: wrap;
    flex-shrink: 0;
  }

  .filter-group {
    min-width: 140px;
  }

  .filter-group :global(.spectrum-Picker) {
    background: var(--spectrum-global-color-gray-100) !important;
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 6px;
  }

  .logs-split {
    display: grid;
    grid-template-columns: minmax(520px, 1.05fr) minmax(520px, 1fr);
    gap: 0;
    flex: 1 1 auto;
    min-height: 0;
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 8px;
    overflow: hidden;
    background: var(--background-alt);
  }

  .logs-table-panel {
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
    border-right: 1px solid var(--spectrum-global-color-gray-200);
  }

  .table-wrapper {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    min-height: 0;
    overflow: hidden;
  }

  .table {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    min-height: 0;
    overflow: hidden;
  }

  .table-header,
  .row {
    display: grid;
    grid-template-columns: 36px 1fr 110px 170px 90px;
    align-items: center;
  }

  .table-header {
    padding: 10px 12px;
    font-size: 13px;
    color: var(--spectrum-global-color-gray-700);
    border-bottom: 1px solid var(--spectrum-global-color-gray-200);
    flex-shrink: 0;
    background: var(--background-alt);
  }

  .header-cell {
    font-size: 13px;
    color: var(--spectrum-global-color-gray-700);
  }

  .header-cell--status {
    width: 36px;
  }

  .table-body {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    overflow-y: auto;
    scrollbar-width: thin;
    background: var(--background-alt);
  }

  .table-body::-webkit-scrollbar,
  .detail-panel::-webkit-scrollbar,
  .code-block::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  .table-body::-webkit-scrollbar-track,
  .detail-panel::-webkit-scrollbar-track,
  .code-block::-webkit-scrollbar-track {
    background: transparent;
  }

  .table-body::-webkit-scrollbar-thumb,
  .detail-panel::-webkit-scrollbar-thumb,
  .code-block::-webkit-scrollbar-thumb {
    background: var(--spectrum-global-color-gray-300);
    border-radius: 3px;
  }

  .row {
    padding: 9px 12px;
    text-align: left;
    border: none;
    border-bottom: 0.5px solid var(--spectrum-global-color-gray-200);
    background: var(--background-alt);
    cursor: pointer;
    transition: background 130ms ease-out;
  }

  .row:hover,
  .row.active {
    background: var(--spectrum-global-color-gray-100);
  }

  .cell {
    display: flex;
    align-items: center;
    min-width: 0;
  }

  .cell--status {
    justify-content: center;
    width: 36px;
  }

  .cell--input {
    overflow: hidden;
  }

  .cell--input :global(.spectrum-Body) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .trigger-badge {
    font-size: 12px;
    font-weight: 500;
    color: var(--spectrum-global-color-gray-700);
    background: var(--spectrum-global-color-gray-200);
    padding: 2px 8px;
    border-radius: 4px;
  }

  .empty-state {
    padding: 40px 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-m);
    padding: var(--spacing-s) 0;
    border-top: 1px solid var(--spectrum-global-color-gray-200);
    flex-shrink: 0;
  }

  .pagination-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    border: none;
    background: transparent;
    cursor: pointer;
    border-radius: 4px;
    transition: background 130ms ease-out;
  }

  .pagination-btn:hover:not(:disabled) {
    background: var(--spectrum-global-color-gray-200);
  }

  .pagination-btn:disabled {
    opacity: 0.4;
    cursor: default;
  }

  .detail-panel {
    min-height: 0;
    overflow-y: auto;
    background: var(--background);
  }

  .detail-content {
    padding: var(--spacing-xl);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
  }

  .detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-m);
  }

  .detail-title {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--spectrum-global-color-gray-900);
  }

  .detail-header-stats {
    display: flex;
    gap: var(--spacing-s);
    align-items: center;
    flex-wrap: wrap;
  }

  .header-stat {
    font-size: 12px;
    color: var(--spectrum-global-color-gray-700);
    background: var(--spectrum-global-color-gray-100);
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 999px;
    padding: 4px 10px;
  }

  .detail-meta {
    display: grid;
    grid-template-columns: repeat(2, minmax(220px, 1fr));
    gap: var(--spacing-s) var(--spacing-l);
  }

  .meta-row {
    display: grid;
    grid-template-columns: 140px 1fr;
    gap: var(--spacing-s);
    align-items: baseline;
    font-size: 13px;
  }

  .meta-label {
    color: var(--spectrum-global-color-gray-600);
    font-weight: 500;
  }

  .meta-value {
    color: var(--spectrum-global-color-gray-900);
    word-break: break-word;
  }

  .meta-value--success {
    color: #8ca171;
  }

  .meta-value--error {
    color: var(--spectrum-global-color-red-600);
  }

  .steps-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }

  .steps-title {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: var(--spectrum-global-color-gray-900);
  }

  .steps-list {
    display: flex;
    flex-direction: column;
  }

  .step {
    border-bottom: 1px solid var(--spectrum-global-color-gray-200);
  }

  .step:last-child {
    border-bottom: none;
  }

  .step-header {
    display: grid;
    grid-template-columns: 34px minmax(0, 1fr) auto;
    align-items: center;
    gap: var(--spacing-s);
    width: 100%;
    padding: 10px 12px;
    border: none;
    background: transparent;
    text-align: left;
    cursor: pointer;
    transition: background 130ms ease-out;
  }

  .step-header:hover,
  .step--expanded .step-header {
    background: var(--spectrum-global-color-gray-100);
  }

  .step-number {
    width: 24px;
    height: 24px;
    border-radius: 999px;
    border: 1px solid var(--spectrum-global-color-gray-300);
    color: var(--spectrum-global-color-gray-700);
    font-size: 12px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .step-flow {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .step-flow-main {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
  }

  .step-flow-from,
  .step-flow-to {
    font-size: 13px;
    color: var(--spectrum-global-color-gray-900);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .step-flow-arrow {
    color: var(--spectrum-global-color-gray-500);
    font-size: 12px;
    flex-shrink: 0;
  }

  .step-model {
    font-size: 12px;
    color: var(--spectrum-global-color-gray-600);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .step-metrics {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--spectrum-global-color-gray-600);
    font-size: 12px;
    white-space: nowrap;
  }

  .step-token-metric {
    color: var(--spectrum-global-color-gray-700);
  }

  .step-duration {
    color: var(--spectrum-global-color-gray-600);
    min-width: 34px;
    text-align: right;
  }

  .step-duration--slow {
    color: var(--spectrum-global-color-orange-600);
  }

  .step-body {
    padding: 0 12px 12px;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }

  .step-loading {
    padding: var(--spacing-s) 0;
  }

  .step-pill-row {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .step-pill {
    display: inline-flex;
    align-items: center;
    padding: 3px 8px;
    border-radius: 999px;
    border: 1px solid var(--spectrum-global-color-gray-200);
    background: var(--spectrum-global-color-gray-100);
    color: var(--spectrum-global-color-gray-700);
    font-size: 11px;
  }

  .io-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--spacing-s);
  }

  .io-panel {
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 8px;
    background: var(--background);
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 0;
  }

  .io-title {
    margin: 0;
    font-size: 12px;
    font-weight: 600;
    color: var(--spectrum-global-color-gray-700);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .code-block {
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 6px;
    overflow: auto;
    max-height: 220px;
    background: var(--background-alt);
  }

  .code-block pre {
    margin: 0;
    padding: 10px;
    font-size: 12px;
    line-height: 1.55;
    color: var(--spectrum-global-color-gray-800);
    font-family: var(--font-mono, "SF Mono", "Fira Code", monospace);
    white-space: pre-wrap;
    word-break: break-word;
  }

  .detail-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-m);
    height: 100%;
    padding: var(--spacing-xl);
  }

  @media (max-width: 1400px) {
    .logs-split {
      grid-template-columns: 1fr;
    }

    .logs-table-panel {
      border-right: none;
      border-bottom: 1px solid var(--spectrum-global-color-gray-200);
      max-height: 360px;
    }
  }

  @media (max-width: 900px) {
    .table-header,
    .row {
      grid-template-columns: 30px 1fr 80px 120px 70px;
    }

    .detail-meta {
      grid-template-columns: 1fr;
    }

    .meta-row {
      grid-template-columns: 110px 1fr;
    }

    .step-header {
      grid-template-columns: 28px minmax(0, 1fr);
      gap: 8px;
    }

    .step-metrics {
      grid-column: 1 / -1;
      justify-content: flex-end;
      padding-left: 36px;
    }

    .io-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
