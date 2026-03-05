<script lang="ts">
  import { Body, Icon, Select } from "@budibase/bbui"
  import { API } from "@/api"
  import { selectedAgent } from "@/stores/portal"
  import { onMount } from "svelte"
  import dayjs from "dayjs"
  import type {
    AgentLogSession,
    AgentLogEntry,
    AgentLogRequestDetail,
  } from "@budibase/types"

  let sessions = $state<AgentLogSession[]>([])
  let loading = $state(false)
  let selectedSession = $state<AgentLogSession | null>(null)
  let expandedStepId = $state<string | null>(null)
  let stepDetail = $state<AgentLogRequestDetail | null>(null)
  let stepDetailLoading = $state(false)
  let activeDetailTab = $state<"input" | "output">("input")
  let currentPage = $state(0)
  let hasMore = $state(false)

  let statusFilter = $state<string>("all")
  let timeRange = $state<string>("7d")
  let triggerFilter = $state<string>("all")

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
    if (!agentId) return
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
    } catch (e) {
      console.error("Failed to fetch agent logs", e)
      sessions = []
    } finally {
      loading = false
    }
  }

  function selectSession(session: AgentLogSession) {
    selectedSession = session
    expandedStepId = null
    stepDetail = null
    activeDetailTab = "input"
  }

  async function toggleStep(entry: AgentLogEntry) {
    if (expandedStepId === entry.requestId) {
      expandedStepId = null
      stepDetail = null
      return
    }
    expandedStepId = entry.requestId
    stepDetail = null
    activeDetailTab = "input"
    stepDetailLoading = true
    try {
      const agentId = $selectedAgent?._id
      if (!agentId) return
      const { startDate } = getDateRange()
      stepDetail = await API.fetchAgentLogDetail(
        agentId,
        entry.requestId,
        startDate
      )
    } catch (e) {
      console.error("Failed to fetch step detail", e)
    } finally {
      stepDetailLoading = false
    }
  }

  function formatTime(dateStr: string): string {
    if (!dateStr) return "-"
    return dayjs(dateStr).format("MMM D, YYYY | HH:mm")
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

  function getLastOutput(session: AgentLogSession): string {
    if (!session.entries.length) return "-"
    return "View in step detail"
  }

  function getStepDuration(entry: AgentLogEntry): string {
    if (!entry.startTime || !entry.endTime) return ""
    const ms =
      new Date(entry.endTime).getTime() -
      new Date(entry.startTime).getTime()
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(1)}s`
  }

  function formatMessages(detail: AgentLogRequestDetail): string {
    if (!detail.messages.length) return "No messages"
    return detail.messages
      .map(m => `${m.role}: ${m.content}`)
      .join("\n\n")
  }

  function formatOutput(detail: AgentLogRequestDetail): string {
    const parts: string[] = []
    if (detail.response) {
      parts.push(detail.response)
    }
    if (detail.toolCalls.length) {
      parts.push("\n--- Tool Calls ---")
      for (const tc of detail.toolCalls) {
        parts.push(`\n${tc.name}(${tc.arguments})`)
        if (tc.result) {
          parts.push(`→ ${tc.result}`)
        }
      }
    }
    return parts.join("\n") || "No output"
  }

  $effect(() => {
    // Re-fetch when filters change
    statusFilter
    timeRange
    triggerFilter
    loadSessions(0)
  })

  onMount(() => {
    loadSessions()
  })
</script>

<div class="logs-container">
  <!-- Filters bar -->
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
    <!-- Left panel: Session table -->
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
                  class:active={selectedSession?.sessionId === session.sessionId}
                  type="button"
                  onclick={() => selectSession(session)}
                >
                  <div class="cell cell--status">
                    <div
                      class="status-dot"
                      class:status-dot--success={session.status === "success"}
                      class:status-dot--error={session.status === "error"}
                    >
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
                  </div>
                  <div class="cell cell--input">
                    <Body size="S" color="var(--spectrum-global-color-gray-900)">
                      {session.firstInput || "No input"}
                    </Body>
                  </div>
                  <div class="cell">
                    <span class="trigger-badge">{session.trigger}</span>
                  </div>
                  <div class="cell">
                    <Body size="S" color="var(--spectrum-global-color-gray-700)">
                      {formatTime(session.startTime)}
                    </Body>
                  </div>
                  <div class="cell">
                    <Body size="S" color="var(--spectrum-global-color-gray-700)">
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

    <!-- Right panel: Session detail -->
    <div class="detail-panel">
      {#if selectedSession}
        <div class="detail-content">
          <div class="detail-header">
            <h3 class="detail-title">Log</h3>
          </div>

          <div class="detail-meta">
            <div class="meta-row">
              <span class="meta-label">Input</span>
              <span class="meta-value">{selectedSession.firstInput || "-"}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Output</span>
              <span class="meta-value">{getLastOutput(selectedSession)}</span>
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
              <span class="meta-label">Latency</span>
              <span class="meta-value">{calculateLatency(selectedSession)}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Total operations</span>
              <span class="meta-value">{selectedSession.operations}</span>
            </div>
          </div>

          <div class="steps-section">
            <h4 class="steps-title">Steps</h4>
            <div class="steps-list">
              {#each selectedSession.entries as entry, i (entry.requestId)}
                <div class="step" class:step--expanded={expandedStepId === entry.requestId}>
                  <button
                    class="step-header"
                    type="button"
                    onclick={() => toggleStep(entry)}
                  >
                    <Icon
                      name={expandedStepId === entry.requestId
                        ? "chevron-down"
                        : "chevron-right"}
                      size="S"
                      color="var(--spectrum-global-color-gray-600)"
                    />
                    <span class="step-label">Step {i + 1}</span>
                    <span class="step-model">{entry.model}</span>
                    <span
                      class="step-duration"
                      class:step-duration--slow={
                        entry.startTime &&
                        entry.endTime &&
                        new Date(entry.endTime).getTime() -
                          new Date(entry.startTime).getTime() >
                          2000
                      }
                    >
                      {getStepDuration(entry)}
                    </span>
                  </button>

                  {#if expandedStepId === entry.requestId}
                    <div class="step-body">
                      {#if stepDetailLoading}
                        <div class="step-loading">
                          <Body
                            size="S"
                            color="var(--spectrum-global-color-gray-600)"
                          >
                            Loading...
                          </Body>
                        </div>
                      {:else if stepDetail}
                        <div class="step-tabs">
                          <button
                            class="step-tab"
                            class:step-tab--active={activeDetailTab === "input"}
                            type="button"
                            onclick={() => (activeDetailTab = "input")}
                          >
                            Input
                          </button>
                          <button
                            class="step-tab"
                            class:step-tab--active={activeDetailTab === "output"}
                            type="button"
                            onclick={() => (activeDetailTab = "output")}
                          >
                            Output
                          </button>
                        </div>
                        <div class="code-block">
                          <pre><code>{activeDetailTab === "input"
                                ? formatMessages(stepDetail)
                                : formatOutput(stepDetail)}</code></pre>
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

  /* Filters */
  .filters-bar {
    display: flex;
    gap: var(--spacing-m);
    padding-bottom: var(--spacing-l);
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

  /* Split layout */
  .logs-split {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    flex: 1 1 auto;
    min-height: 0;
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 6px;
    overflow: hidden;
  }

  /* Left panel */
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
    background: transparent;
    border-bottom: 1px solid var(--spectrum-global-color-gray-200);
    flex-shrink: 0;
  }

  .header-cell {
    font-family: var(--font-sans);
    font-weight: 400;
    font-size: 13px;
    color: var(--spectrum-global-color-gray-700);
  }

  .header-cell--status {
    width: 36px;
  }

  .table-body {
    display: flex;
    flex-direction: column;
    background: var(--background-alt);
    flex: 1 1 auto;
    overflow-y: auto;
    scrollbar-width: thin;
  }

  .table-body::-webkit-scrollbar {
    width: 6px;
  }

  .table-body::-webkit-scrollbar-track {
    background: transparent;
  }

  .table-body::-webkit-scrollbar-thumb {
    background: var(--spectrum-global-color-gray-300);
    border-radius: 3px;
  }

  .row {
    padding: 9px 12px;
    text-align: left;
    border: none;
    border-bottom: 0.5px solid var(--spectrum-global-color-gray-200);
    background: var(--background-alt);
    transition: background 130ms ease-out;
    cursor: pointer;
    flex-shrink: 0;
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

  .status-dot {
    display: flex;
    align-items: center;
    justify-content: center;
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

  /* Right panel */
  .detail-panel {
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow-y: auto;
    scrollbar-width: thin;
    background: var(--background);
  }

  .detail-panel::-webkit-scrollbar {
    width: 6px;
  }

  .detail-panel::-webkit-scrollbar-track {
    background: transparent;
  }

  .detail-panel::-webkit-scrollbar-thumb {
    background: var(--spectrum-global-color-gray-300);
    border-radius: 3px;
  }

  .detail-content {
    padding: var(--spacing-xl);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
  }

  .detail-header {
    display: flex;
    align-items: center;
  }

  .detail-title {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--spectrum-global-color-gray-900);
  }

  .detail-meta {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }

  .meta-row {
    display: grid;
    grid-template-columns: 130px 1fr;
    gap: var(--spacing-m);
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
    color: #8CA171;
  }

  .meta-value--error {
    color: var(--spectrum-global-color-red-600);
  }

  /* Steps */
  .steps-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
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

  .step:first-child {
    border-top: 1px solid var(--spectrum-global-color-gray-200);
  }

  .step-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    padding: 10px 4px;
    width: 100%;
    border: none;
    background: transparent;
    cursor: pointer;
    text-align: left;
    transition: background 130ms ease-out;
    font-family: var(--font-sans);
  }

  .step-header:hover {
    background: var(--spectrum-global-color-gray-100);
  }

  .step-label {
    font-size: 13px;
    font-weight: 600;
    color: var(--spectrum-global-color-gray-900);
  }

  .step-model {
    font-size: 13px;
    font-weight: 400;
    color: var(--spectrum-global-color-gray-900);
  }

  .step-duration {
    font-size: 12px;
    color: var(--spectrum-global-color-gray-600);
    margin-left: auto;
  }

  .step-duration--slow {
    color: var(--spectrum-global-color-orange-600);
  }

  .step-body {
    padding: 0 4px 12px 28px;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }

  .step-loading {
    padding: var(--spacing-m);
  }

  .step-tabs {
    display: flex;
    gap: 0;
    border-bottom: 1px solid var(--spectrum-global-color-gray-200);
  }

  .step-tab {
    padding: 6px 14px;
    font-size: 13px;
    font-weight: 500;
    font-family: var(--font-sans);
    color: var(--spectrum-global-color-gray-700);
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    transition:
      color 130ms ease-out,
      border-color 130ms ease-out;
  }

  .step-tab:hover {
    color: var(--spectrum-global-color-gray-900);
  }

  .step-tab--active {
    color: var(--spectrum-global-color-gray-900);
    border-bottom-color: var(--spectrum-global-color-gray-900);
  }

  .code-block {
    background: var(--spectrum-global-color-gray-100);
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 6px;
    overflow: auto;
    max-height: 320px;
    scrollbar-width: thin;
  }

  .code-block::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  .code-block::-webkit-scrollbar-track {
    background: transparent;
  }

  .code-block::-webkit-scrollbar-thumb {
    background: var(--spectrum-global-color-gray-300);
    border-radius: 3px;
  }

  .code-block pre {
    margin: 0;
    padding: 12px 14px;
    font-size: 12px;
    line-height: 1.6;
    font-family: var(--font-mono, "SF Mono", "Fira Code", monospace);
    color: var(--spectrum-global-color-gray-800);
    white-space: pre-wrap;
    word-break: break-word;
  }

  .code-block code {
    font-family: inherit;
  }

  /* Detail empty state */
  .detail-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-m);
    height: 100%;
    padding: var(--spacing-xl);
  }
</style>
