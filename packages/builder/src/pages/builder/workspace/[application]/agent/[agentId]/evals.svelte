<script lang="ts">
  import { API } from "@/api"
  import { selectedAgent } from "@/stores/portal"
  import {
    ActionButton,
    Body,
    Button,
    Detail,
    Heading,
    Helpers,
    Icon,
    Input,
    StatusLight,
    TextArea,
    notifications,
  } from "@budibase/bbui"
  import { Duration } from "@budibase/shared-core"
  import type {
    AgentEvalCase,
    AgentEvalCaseResult,
    AgentEvalRun,
    AgentEvalSuite,
  } from "@budibase/types"

  const createEmptySuite = (agentId = ""): AgentEvalSuite => ({
    agentId,
    cases: [],
  })

  const createCase = (index: number): AgentEvalCase => ({
    id: Helpers.uuid(),
    name: `Case ${index + 1}`,
    prompt: "",
    assertions: {
      contains: [""],
    },
  })

  let suite = $state<AgentEvalSuite>(createEmptySuite())
  let latestRun = $state<AgentEvalRun | null>(null)
  let recentRuns = $state<AgentEvalRun[]>([])
  let loading = $state(false)
  let saving = $state(false)
  let running = $state(false)
  let selectedCaseId = $state<string | null>(null)
  let selectedRunId = $state<string | null>(null)
  let lastAgentId = $state<string | undefined>()

  let currentAgent = $derived($selectedAgent)
  let selectedRun = $derived(
    recentRuns.find(run => run.runId === selectedRunId) ?? latestRun
  )
  let resultsByCaseId = $derived(
    new Map((selectedRun?.results ?? []).map(result => [result.caseId, result]))
  )
  let selectedCase = $derived(
    suite.cases.find(testCase => testCase.id === selectedCaseId) || null
  )
  let selectedResult = $derived(
    selectedCaseId ? (resultsByCaseId.get(selectedCaseId) ?? null) : null
  )

  const resetState = (agentId?: string) => {
    suite = createEmptySuite(agentId)
    latestRun = null
    recentRuns = []
    selectedCaseId = null
    selectedRunId = null
  }

  const ensureSelection = () => {
    if (!suite.cases.length) {
      selectedCaseId = null
      return
    }

    if (
      !selectedCaseId ||
      !suite.cases.some(testCase => testCase.id === selectedCaseId)
    ) {
      selectedCaseId = suite.cases[0].id
    }
  }

  const loadSuite = async (agentId?: string) => {
    if (!agentId) {
      resetState()
      return
    }

    loading = true
    try {
      const response = await API.fetchAgentEvalSuite(agentId)
      suite = response.suite
      latestRun = response.latestRun
      recentRuns = response.recentRuns
      selectedRunId =
        response.latestRun?.runId || response.recentRuns[0]?.runId || null
      ensureSelection()
    } catch (error) {
      console.error("Failed to load agent eval suite", error)
      resetState(agentId)
      notifications.error("Failed to load eval suite")
    } finally {
      loading = false
    }
  }

  const updateSelectedCase = (
    updater: (testCase: AgentEvalCase) => AgentEvalCase
  ) => {
    if (!selectedCaseId) {
      return
    }

    suite = {
      ...suite,
      cases: suite.cases.map(testCase =>
        testCase.id === selectedCaseId ? updater(testCase) : testCase
      ),
    }
  }

  const updateAssertionList = (
    key: "contains" | "notContains",
    index: number,
    value: string
  ) => {
    updateSelectedCase(testCase => {
      const currentValues = [...(testCase.assertions[key] || [])]
      currentValues[index] = value
      return {
        ...testCase,
        assertions: {
          ...testCase.assertions,
          [key]: currentValues,
        },
      }
    })
  }

  const addAssertionLine = (key: "contains" | "notContains") => {
    updateSelectedCase(testCase => ({
      ...testCase,
      assertions: {
        ...testCase.assertions,
        [key]: [...(testCase.assertions[key] || []), ""],
      },
    }))
  }

  const removeAssertionLine = (
    key: "contains" | "notContains",
    index: number
  ) => {
    updateSelectedCase(testCase => ({
      ...testCase,
      assertions: {
        ...testCase.assertions,
        [key]: (testCase.assertions[key] || []).filter(
          (_, itemIndex) => itemIndex !== index
        ),
      },
    }))
  }

  const addCase = () => {
    const nextCase = createCase(suite.cases.length)
    suite = {
      ...suite,
      cases: [...suite.cases, nextCase],
    }
    selectedCaseId = nextCase.id
  }

  const duplicateSelectedCase = () => {
    if (!selectedCase) {
      return
    }

    const duplicated: AgentEvalCase = {
      ...selectedCase,
      id: Helpers.uuid(),
      name: `${selectedCase.name} copy`,
      assertions: {
        exact: selectedCase.assertions.exact || "",
        contains: [...(selectedCase.assertions.contains || [])],
        notContains: [...(selectedCase.assertions.notContains || [])],
        ...(selectedCase.assertions.judge
          ? {
              judge: {
                rubric: selectedCase.assertions.judge.rubric,
              },
            }
          : {}),
      },
    }

    suite = {
      ...suite,
      cases: [...suite.cases, duplicated],
    }
    selectedCaseId = duplicated.id
  }

  const removeSelectedCase = () => {
    if (!selectedCaseId) {
      return
    }

    suite = {
      ...suite,
      cases: suite.cases.filter(testCase => testCase.id !== selectedCaseId),
    }
    selectedCaseId = suite.cases[0]?.id ?? null
  }

  const saveSuite = async ({
    showToast = true,
  }: { showToast?: boolean } = {}) => {
    const agentId = currentAgent?._id
    if (!agentId || saving) {
      return
    }

    saving = true
    try {
      suite = await API.updateAgentEvalSuite(agentId, {
        _rev: suite._rev,
        cases: suite.cases,
      })
      ensureSelection()
      if (showToast) {
        notifications.success("Eval suite saved")
      }
    } catch (error) {
      console.error("Failed to save eval suite", error)
      notifications.error("Failed to save eval suite")
      throw error
    } finally {
      saving = false
    }
  }

  const runSuite = async () => {
    const agentId = currentAgent?._id
    if (!agentId || running) {
      return
    }

    try {
      await saveSuite({ showToast: false })
    } catch {
      return
    }

    running = true
    try {
      const { run } = await API.runAgentEvalSuite(agentId)
      latestRun = run
      recentRuns = [run, ...recentRuns.filter(item => item.runId !== run.runId)]
      selectedRunId = run.runId
      notifications.success("Eval run complete")
    } catch (error) {
      console.error("Failed to run eval suite", error)
      notifications.error("Failed to run eval suite")
    } finally {
      running = false
    }
  }

  const resultSummary = (result?: AgentEvalCaseResult | null) => {
    if (!result) {
      return "Not run yet"
    }
    if (result.status === "passed") {
      return "Passed"
    }
    if (result.status === "failed") {
      return "Failed"
    }
    return "Error"
  }

  $effect(() => {
    const agentId = currentAgent?._id
    if (agentId === lastAgentId) {
      return
    }

    lastAgentId = agentId
    resetState(agentId)
    loadSuite(agentId)
  })
</script>

<div class="evals-container">
  <div class="evals-split">
    <div class="evals-list-panel">
      <div class="list-toolbar">
        <div class="toolbar-title">
          <Heading size="S">Eval suite</Heading>
          <Body size="S" color="var(--spectrum-global-color-gray-700)">
            Run reusable prompt checks against the latest saved agent draft.
            Exact, contains, and not-contains assertions are deterministic.
            Judge criteria use the same model config as the agent and return a
            pass/fail verdict with a reason.
          </Body>
        </div>
        <div class="toolbar-actions">
          <Button
            secondary
            disabled={saving || loading}
            on:click={() => saveSuite()}
          >
            Save suite
          </Button>
          <Button
            primary
            disabled={running || saving || loading}
            on:click={runSuite}
          >
            {running ? "Running..." : "Run suite"}
          </Button>
        </div>
      </div>

      <div class="list-meta">
        <span class="header-stat">{suite.cases.length} cases</span>
        <span class="header-stat">
          Last run:
          {latestRun ? `${latestRun.passed}/${latestRun.total}` : "—"}
        </span>
        <span class="header-stat">
          Updated:
          {suite.updatedAt ? new Date(suite.updatedAt).toLocaleString() : "—"}
        </span>
      </div>

      <div class="case-list-header">
        <Heading size="XS">Cases</Heading>
        <ActionButton quiet icon="plus" on:click={addCase}
          >Add case</ActionButton
        >
      </div>

      <div class="case-list-body">
        {#if loading && !suite.cases.length}
          <div class="empty-state">
            <Body size="S" color="var(--spectrum-global-color-gray-600)">
              Loading eval suite...
            </Body>
          </div>
        {:else if !suite.cases.length}
          <div class="empty-state">
            <div class="empty-state-content">
              <Body size="S" color="var(--spectrum-global-color-gray-600)">
                No eval cases yet.
              </Body>
              <Button secondary on:click={addCase}>Add first case</Button>
            </div>
          </div>
        {:else}
          <div class="case-items">
            {#each suite.cases as testCase}
              <button
                class:selected={testCase.id === selectedCaseId}
                class="case-item"
                type="button"
                onclick={() => (selectedCaseId = testCase.id)}
              >
                <div class="case-item-top">
                  <span class="case-item-name">{testCase.name}</span>
                  <span
                    class={`status-pill ${resultsByCaseId.get(testCase.id)?.status || "idle"}`}
                  >
                    {resultSummary(resultsByCaseId.get(testCase.id))}
                  </span>
                </div>
                <div class="case-item-subtitle">
                  {testCase.prompt || "No prompt yet"}
                </div>
              </button>
            {/each}
          </div>
        {/if}
      </div>
    </div>

    <div class="detail-panel">
      {#if selectedCase}
        <div class="detail-content">
          <div class="detail-header">
            <h3 class="detail-title">{selectedCase.name}</h3>
            <div class="detail-header-right">
              <div class="editor-actions">
                <ActionButton
                  quiet
                  icon="copy"
                  tooltip="Duplicate"
                  on:click={duplicateSelectedCase}
                />
                <ActionButton
                  quiet
                  icon="trash"
                  tooltip="Delete"
                  on:click={removeSelectedCase}
                />
              </div>
              <div class="detail-header-stats">
                {#if selectedResult}
                  <span class="header-stat"
                    >{resultSummary(selectedResult)}</span
                  >
                  <span class="header-stat"
                    >{Duration.fromMilliseconds(
                      selectedResult.durationMs
                    ).toSeconds()}</span
                  >
                {:else}
                  <span class="header-stat">Not run yet</span>
                {/if}
              </div>
            </div>
          </div>

          <div class="detail-meta">
            <div class="meta-row">
              <span class="meta-label">Prompt</span>
              <span class="meta-value">{selectedCase.prompt || "—"}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Status</span>
              <span
                class="meta-value"
                class:meta-value--success={selectedResult?.status === "passed"}
                class:meta-value--error={selectedResult?.status === "failed" ||
                  selectedResult?.status === "error"}
              >
                {resultSummary(selectedResult)}
              </span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Last run</span>
              <span class="meta-value"
                >{selectedResult?.completedAt
                  ? new Date(selectedResult.completedAt).toLocaleString()
                  : "-"}</span
              >
            </div>
            <div class="meta-row">
              <span class="meta-label">Suite run</span>
              <span class="meta-value">
                {selectedRun
                  ? new Date(selectedRun.completedAt).toLocaleString()
                  : "—"}
              </span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Snapshot</span>
              <span class="meta-value">
                {selectedRun?.snapshot
                  ? `${selectedRun.snapshot.aiconfig} • ${selectedRun.snapshot.enabledTools.length} tools • ${selectedRun.snapshot.knowledgeBases.length} KBs`
                  : "—"}
              </span>
            </div>
          </div>

          <div class="steps-section">
            <h4 class="steps-title">Run history</h4>
            {#if recentRuns.length > 0}
              <div class="run-history">
                {#each recentRuns as run}
                  <button
                    class:selected={run.runId === selectedRunId}
                    class="run-item"
                    type="button"
                    onclick={() => (selectedRunId = run.runId)}
                  >
                    <span class="run-item-score">{run.passed}/{run.total}</span>
                    <span class="run-item-time"
                      >{new Date(run.completedAt).toLocaleString()}</span
                    >
                  </button>
                {/each}
              </div>
            {:else}
              <div class="result-empty">
                <Body size="S" color="var(--spectrum-global-color-gray-600)">
                  No runs yet.
                </Body>
              </div>
            {/if}
          </div>

          <div class="steps-section">
            <h4 class="steps-title">Case configuration</h4>
            <div class="editor-fields">
              <Input
                label="Case name"
                value={selectedCase.name}
                on:change={event =>
                  updateSelectedCase(testCase => ({
                    ...testCase,
                    name: event.detail,
                  }))}
              />

              <TextArea
                label="Prompt"
                value={selectedCase.prompt}
                height={140}
                on:change={event =>
                  updateSelectedCase(testCase => ({
                    ...testCase,
                    prompt: event.detail,
                  }))}
              />

              <TextArea
                label="Exact match"
                value={selectedCase.assertions.exact}
                height={80}
                on:change={event =>
                  updateSelectedCase(testCase => ({
                    ...testCase,
                    assertions: {
                      ...testCase.assertions,
                      exact: event.detail,
                    },
                  }))}
              />

              <div class="assertion-group">
                <div class="assertion-header">
                  <Body size="S" color="var(--spectrum-global-color-gray-900)"
                    >Contains</Body
                  >
                  <ActionButton
                    quiet
                    icon="plus"
                    on:click={() => addAssertionLine("contains")}
                  >
                    Add line
                  </ActionButton>
                </div>
                {#each selectedCase.assertions.contains || [] as value, index}
                  <div class="assertion-row">
                    <Input
                      {value}
                      on:change={event =>
                        updateAssertionList("contains", index, event.detail)}
                    />
                    <ActionButton
                      quiet
                      icon="x"
                      tooltip="Remove"
                      on:click={() => removeAssertionLine("contains", index)}
                    />
                  </div>
                {/each}
              </div>

              <div class="assertion-group">
                <div class="assertion-header">
                  <Body size="S" color="var(--spectrum-global-color-gray-900)"
                    >Not contains</Body
                  >
                  <ActionButton
                    quiet
                    icon="plus"
                    on:click={() => addAssertionLine("notContains")}
                  >
                    Add line
                  </ActionButton>
                </div>
                {#each selectedCase.assertions.notContains || [] as value, index}
                  <div class="assertion-row">
                    <Input
                      {value}
                      on:change={event =>
                        updateAssertionList("notContains", index, event.detail)}
                    />
                    <ActionButton
                      quiet
                      icon="x"
                      tooltip="Remove"
                      on:click={() => removeAssertionLine("notContains", index)}
                    />
                  </div>
                {/each}
              </div>

              <TextArea
                label="Judge criteria"
                value={selectedCase.assertions.judge?.rubric || ""}
                height={100}
                on:change={event =>
                  updateSelectedCase(testCase => ({
                    ...testCase,
                    assertions: {
                      ...testCase.assertions,
                      judge: event.detail
                        ? {
                            rubric: event.detail,
                          }
                        : undefined,
                    },
                  }))}
              />
            </div>
          </div>

          <div class="steps-section">
            <h4 class="steps-title">Latest result</h4>
            {#if selectedResult}
              <div class="result-status">
                <StatusLight
                  positive={selectedResult.status === "passed"}
                  negative={selectedResult.status === "failed" ||
                    selectedResult.status === "error"}
                >
                  {resultSummary(selectedResult)}
                </StatusLight>
              </div>

              {#if selectedResult.error}
                <div class="result-section">
                  <Detail>Error</Detail>
                  <pre>{selectedResult.error}</pre>
                </div>
              {/if}

              {#if selectedResult.judge}
                <div class="result-section">
                  <Detail>Judge result</Detail>
                  <StatusLight
                    positive={selectedResult.judge.status === "passed"}
                    negative={selectedResult.judge.status === "failed" ||
                      selectedResult.judge.status === "error"}
                  >
                    {selectedResult.judge.status === "passed"
                      ? "Passed"
                      : selectedResult.judge.status === "failed"
                        ? "Failed"
                        : "Error"}
                  </StatusLight>
                  {#if selectedResult.judge.reason}
                    <Body size="S">{selectedResult.judge.reason}</Body>
                  {/if}
                  {#if selectedResult.judge.error}
                    <pre>{selectedResult.judge.error}</pre>
                  {/if}
                </div>
              {/if}

              {#if selectedResult.failures.length > 0}
                <div class="result-section">
                  <Detail>Assertion failures</Detail>
                  <ul class="failure-list">
                    {#each selectedResult.failures as failure}
                      <li>{failure.message}</li>
                    {/each}
                  </ul>
                </div>
              {/if}

              <div class="result-section">
                <Detail>Response</Detail>
                <pre>{selectedResult.response || "[No response]"}</pre>
              </div>
            {:else}
              <div class="result-empty">
                <Body size="S" color="var(--spectrum-global-color-gray-600)">
                  Run the suite to see pass/fail results for this case.
                </Body>
              </div>
            {/if}
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
            Select a case to view and edit
          </Body>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .evals-container {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    height: 100%;
    min-height: 0;
  }

  .evals-split {
    display: flex;
    flex: 1 1 auto;
    height: 100%;
    min-height: 0;
    overflow: hidden;
    background: var(--background);
  }

  .evals-list-panel {
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

  .list-toolbar {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--spacing-l);
    padding: var(--spacing-l) var(--spacing-l) var(--spacing-s);
    flex-shrink: 0;
  }

  .toolbar-title {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    min-width: 0;
  }

  .toolbar-actions {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    flex-shrink: 0;
  }

  .list-meta {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-s);
    padding: 0 var(--spacing-l) var(--spacing-m);
    flex-shrink: 0;
  }

  .case-list-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 var(--spacing-l) var(--spacing-s);
    flex-shrink: 0;
  }

  .case-list-body {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    padding: 0 var(--spacing-l) var(--spacing-l);
    scrollbar-width: thin;
  }

  .case-list-body::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  .case-list-body::-webkit-scrollbar-track {
    background: transparent;
  }

  .case-list-body::-webkit-scrollbar-thumb {
    background: var(--spectrum-global-color-gray-300);
    border-radius: 3px;
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

  .header-stat {
    font-size: 12px;
    color: var(--spectrum-global-color-gray-700);
    background: var(--spectrum-global-color-gray-100);
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 999px;
    padding: 4px 10px;
    white-space: nowrap;
  }

  .case-items {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .case-item {
    width: 100%;
    text-align: left;
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 8px;
    padding: var(--spacing-s);
    background: var(--background);
    cursor: pointer;
    transition:
      border-color 130ms ease,
      background 130ms ease;
  }

  .case-item:hover {
    border-color: var(--spectrum-global-color-gray-400);
    background: var(--background-alt);
  }

  .case-item.selected {
    border-color: var(--bb-blue);
    background: var(--background-alt);
  }

  .case-item-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-xs);
  }

  .case-item-name {
    font-size: 13px;
    font-weight: 500;
    color: var(--spectrum-global-color-gray-900);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .case-item-subtitle {
    font-size: 12px;
    color: var(--spectrum-global-color-gray-600);
    margin-top: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .status-pill {
    font-size: 11px;
    border-radius: 999px;
    padding: 2px 8px;
    background: var(--spectrum-global-color-gray-200);
    color: var(--spectrum-global-color-gray-700);
    white-space: nowrap;
    flex-shrink: 0;
  }

  .status-pill.passed {
    background: #d7f5de;
    color: #1a7f37;
  }

  .status-pill.failed,
  .status-pill.error {
    background: #fde2e1;
    color: #b42318;
  }

  .detail-content {
    padding: var(--spacing-xl) var(--spacing-l);
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
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
  }

  .detail-header-right {
    display: flex;
    align-items: center;
    gap: var(--spacing-m);
    flex-shrink: 0;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .detail-header-stats {
    display: flex;
    gap: var(--spacing-s);
    align-items: center;
    flex-wrap: wrap;
    flex-shrink: 0;
  }

  .editor-actions {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }

  .detail-meta {
    display: grid;
    grid-template-columns: repeat(2, minmax(220px, 1fr));
    gap: var(--spacing-s) var(--spacing-l);
  }

  .run-history {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .run-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-s);
    width: 100%;
    padding: var(--spacing-s);
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 8px;
    background: var(--background);
    cursor: pointer;
    text-align: left;
  }

  .run-item.selected {
    border-color: var(--bb-blue);
    background: var(--background-alt);
  }

  .run-item-score {
    font-size: 13px;
    font-weight: 600;
    color: var(--spectrum-global-color-gray-900);
  }

  .run-item-time {
    font-size: 12px;
    color: var(--spectrum-global-color-gray-600);
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

  .editor-fields {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }

  .assertion-header,
  .assertion-row {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
  }

  .assertion-header {
    justify-content: space-between;
  }

  .assertion-group {
    margin-top: var(--spacing-s);
  }

  .result-status {
    display: flex;
    margin-bottom: var(--spacing-xs);
  }

  .result-section {
    margin-top: var(--spacing-m);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .result-section pre {
    white-space: pre-wrap;
    word-break: break-word;
    font-family: "ui-monospace", "SFMono-Regular", monospace;
    font-size: 12px;
    line-height: 1.5;
    background: var(--background);
    border-radius: 8px;
    padding: var(--spacing-s);
    margin: 0;
    border: 1px solid var(--spectrum-global-color-gray-200);
  }

  .failure-list {
    margin: 0;
    padding-left: 18px;
    font-size: 13px;
    color: var(--spectrum-global-color-gray-800);
  }

  .failure-list li {
    margin-bottom: 4px;
  }

  .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px var(--spacing-m);
    text-align: center;
  }

  .empty-state-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
    align-items: center;
  }

  .detail-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-m);
    height: 100%;
    padding: var(--spacing-xl);
    min-height: 200px;
  }

  .result-empty {
    padding: var(--spacing-m) 0;
  }

  @media (max-width: 1400px) {
    .evals-split {
      flex-direction: column;
    }

    .evals-list-panel {
      flex: none;
      min-width: 0;
      max-width: none;
      border-right: none;
      border-bottom: 1px solid var(--spectrum-global-color-gray-200);
      max-height: 360px;
    }
  }

  @media (max-width: 900px) {
    .detail-meta {
      grid-template-columns: 1fr;
    }

    .meta-row {
      grid-template-columns: 110px 1fr;
    }
  }
</style>
