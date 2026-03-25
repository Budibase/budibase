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
    Input,
    StatusLight,
    TextArea,
    notifications,
  } from "@budibase/bbui"
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
  let loading = $state(false)
  let saving = $state(false)
  let running = $state(false)
  let selectedCaseId = $state<string | null>(null)
  let lastAgentId = $state<string | undefined>()

  let currentAgent = $derived($selectedAgent)
  let resultsByCaseId = $derived(
    new Map((latestRun?.results ?? []).map(result => [result.caseId, result]))
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
    selectedCaseId = null
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

<div class="evals-page">
  <div class="evals-header">
    <div class="evals-title">
      <Heading size="S">Eval suite</Heading>
      <Body size="S" color="var(--spectrum-global-color-gray-700)">
        Run reusable prompt checks against the latest saved agent draft. Exact,
        contains, and not-contains assertions are deterministic.
      </Body>
    </div>
    <div class="evals-actions">
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

  <div class="evals-summary">
    <div class="summary-card">
      <Detail>Cases</Detail>
      <div class="summary-value">{suite.cases.length}</div>
    </div>
    <div class="summary-card">
      <Detail>Last run</Detail>
      <div class="summary-value">
        {latestRun ? latestRun.passed + "/" + latestRun.total : "—"}
      </div>
    </div>
    <div class="summary-card">
      <Detail>Updated</Detail>
      <div class="summary-value">
        {suite.updatedAt ? new Date(suite.updatedAt).toLocaleString() : "—"}
      </div>
    </div>
  </div>

  <div class="evals-layout">
    <div class="case-list">
      <div class="case-list-header">
        <Heading size="XS">Cases</Heading>
        <ActionButton quiet icon="plus" on:click={addCase}
          >Add case</ActionButton
        >
      </div>

      {#if !suite.cases.length}
        <div class="empty-state">
          <Body size="S" color="var(--spectrum-global-color-gray-600)">
            No eval cases yet.
          </Body>
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

    <div class="case-editor">
      {#if selectedCase}
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
      {:else}
        <div class="empty-state">
          <Body size="S" color="var(--spectrum-global-color-gray-600)">
            Select a case to edit it.
          </Body>
        </div>
      {/if}
    </div>

    <div class="results-panel">
      <div class="results-header">
        <Heading size="XS">Latest result</Heading>
        {#if latestRun}
          <Body size="XS" color="var(--spectrum-global-color-gray-600)">
            {latestRun.completedAt}
          </Body>
        {/if}
      </div>

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
        <div class="empty-state">
          <Body size="S" color="var(--spectrum-global-color-gray-600)">
            Run the suite to see pass/fail results for each case.
          </Body>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .evals-page {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
    padding: var(--spacing-xl);
    min-height: 0;
  }

  .evals-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--spacing-l);
  }

  .evals-title {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .evals-actions {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    flex-shrink: 0;
  }

  .evals-summary {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--spacing-l);
  }

  .summary-card,
  .case-list,
  .case-editor,
  .results-panel {
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 10px;
    background: var(--background);
  }

  .summary-card {
    padding: var(--spacing-m);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .summary-value {
    font-size: 12px;
    font-weight: 500;
    color: var(--spectrum-global-color-gray-900);
  }

  .evals-layout {
    display: grid;
    grid-template-columns: 280px minmax(0, 1.2fr) minmax(0, 1fr);
    gap: var(--spacing-l);
    min-height: 640px;
  }

  .case-list,
  .case-editor,
  .results-panel {
    padding: var(--spacing-m);
    min-height: 0;
    overflow: auto;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }

  .case-list-header,
  .results-header,
  .editor-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
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

  .assertion-group {
    margin-top: var(--spacing-m);
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
    background: var(--background-alt);
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
    min-height: 160px;
    text-align: center;
  }
</style>
