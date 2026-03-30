<script lang="ts">
  import { API } from "@/api"
  import { agentsStore, featureFlags, selectedAgent } from "@/stores/portal"
  import {
    Button,
    Heading,
    Helpers,
    Tab,
    Tabs,
    notifications,
  } from "@budibase/bbui"
  import { FeatureFlag } from "@budibase/types"
  import type {
    AgentEvalCase,
    AgentEvalCaseResult,
    AgentEvalRun,
    AgentEvalSuite,
  } from "@budibase/types"
  import EvalCaseList from "./EvalComponents/EvalCaseList.svelte"
  import EvalCaseEditor from "./EvalComponents/EvalCaseEditor.svelte"
  import EvalRunCaseList from "./EvalComponents/EvalRunCaseList.svelte"
  import EvalRunDetail from "./EvalComponents/EvalRunDetail.svelte"
  import EvalRunList from "./EvalComponents/EvalRunList.svelte"
  import * as routify from "@roxi/routify"

  const { goto } = routify
  $goto

  const createEmptySuite = (agentId = ""): AgentEvalSuite => ({
    agentId,
    cases: [],
  })

  const createCase = (index: number): AgentEvalCase => ({
    id: Helpers.uuid(),
    name: `Case ${index + 1}`,
    input: "",
    reviewers: [],
  })

  let suite = $state<AgentEvalSuite>(createEmptySuite())
  let runs = $state<AgentEvalRun[]>([])
  let loading = $state(false)
  let saving = $state(false)
  let running = $state(false)
  let selectedView = $state("Cases")
  let selectedCaseId = $state<string | null>(null)
  let selectedRunId = $state<string | null>(null)
  let selectedRunCaseId = $state<string | null>(null)
  let lastAgentId = $state<string | undefined>()
  let evalsEnabled = $derived($featureFlags[FeatureFlag.AI_EVALS])

  let currentAgent = $derived($selectedAgent)
  let toolOptions = $derived.by(() => {
    const enabled = new Set(currentAgent?.enabledTools ?? [])
    const tools = $agentsStore.tools ?? []
    return tools
      .filter(t => enabled.has(t.name))
      .map(t => ({ label: t.readableName || t.name, value: t.name }))
  })
  let latestRun = $derived(runs[0] ?? null)
  let selectedRun = $derived(
    runs.find(run => run.runId === selectedRunId) ?? latestRun
  )
  let latestResultsByCaseId = $derived(
    new Map((latestRun?.results ?? []).map(result => [result.caseId, result]))
  )
  let selectedRunResultsByCaseId = $derived(
    new Map((selectedRun?.results ?? []).map(result => [result.caseId, result]))
  )
  let selectedCase = $derived(
    suite.cases.find(testCase => testCase.id === selectedCaseId) || null
  )
  let selectedRunCaseResult = $derived<AgentEvalCaseResult | null>(
    selectedRunCaseId
      ? (selectedRunResultsByCaseId.get(selectedRunCaseId) ?? null)
      : null
  )
  const resetState = (agentId?: string) => {
    suite = createEmptySuite(agentId)
    runs = []
    selectedCaseId = null
    selectedRunId = null
    selectedRunCaseId = null
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
    if (!evalsEnabled) {
      $goto("../config")
      return
    }

    if (!agentId) {
      resetState()
      return
    }

    loading = true
    try {
      const response = await API.fetchAgentEvalSuite(agentId)
      suite = response.suite
      runs = response.runs
      selectedRunId = response.runs[0]?.runId || null
      ensureSelection()
    } catch (error) {
      console.error("Failed to load agent evaluation suite", error)
      resetState(agentId)
      notifications.error("Failed to load evaluation suite")
    } finally {
      loading = false
    }
  }

  const updateSelectedCase = (
    updater: (_testCase: AgentEvalCase) => AgentEvalCase
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

  const updateCases = (cases: AgentEvalCase[]) => {
    suite = {
      ...suite,
      cases,
    }
  }

  const addCase = () => {
    const nextCase = createCase(suite.cases.length)
    updateCases([...suite.cases, nextCase])
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
      reviewers: selectedCase.reviewers.map(reviewer => ({
        ...reviewer,
        id: Helpers.uuid(),
      })),
    }

    updateCases([...suite.cases, duplicated])
    selectedCaseId = duplicated.id
  }

  const removeSelectedCase = () => {
    if (!selectedCaseId) {
      return
    }

    const remainingCases = suite.cases.filter(
      testCase => testCase.id !== selectedCaseId
    )
    updateCases(remainingCases)
    selectedCaseId = remainingCases[0]?.id ?? null
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
        notifications.success("Evaluation suite saved")
      }
    } catch (error) {
      console.error("Failed to save evaluation suite", error)
      notifications.error("Failed to save evaluation suite")
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
      runs = [run, ...runs.filter(item => item.runId !== run.runId)]
      selectedRunId = run.runId
      selectedView = "Runs"
      notifications.success("Evaluation run complete")
    } catch (error) {
      console.error("Failed to run evaluation suite", error)
      notifications.error("Failed to run evaluation suite")
    } finally {
      running = false
    }
  }

  const selectRunCase = (caseId: string) => {
    selectedRunCaseId = caseId

    if (suite.cases.some(testCase => testCase.id === caseId)) {
      selectedCaseId = caseId
    }
  }

  $effect(() => {
    const runResults = selectedRun?.results ?? []

    if (!runResults.length) {
      selectedRunCaseId = null
      return
    }

    if (
      selectedRunCaseId &&
      runResults.some(result => result.caseId === selectedRunCaseId)
    ) {
      return
    }

    if (
      selectedCaseId &&
      runResults.some(result => result.caseId === selectedCaseId)
    ) {
      selectedRunCaseId = selectedCaseId
      return
    }

    selectedRunCaseId = runResults[0].caseId
  })

  $effect(() => {
    if (!evalsEnabled) {
      $goto("../config")
      return
    }

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
  <div class="evals-header">
    <div class="evals-header-copy">
      <Heading size="S">Evaluation suite</Heading>
    </div>
    <div class="evals-header-actions">
      <Button
        secondary
        disabled={saving || loading}
        on:click={() => saveSuite()}
      >
        Save
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

  <div class="mode-tabs">
    <Tabs bind:selected={selectedView} noPadding noHorizPadding size="M">
      <Tab title="Cases">
        <div class="evals-split">
          <div class="evals-list-panel">
            <EvalCaseList
              cases={suite.cases}
              resultsByCaseId={latestResultsByCaseId}
              hasLatestRun={!!latestRun}
              {selectedCaseId}
              {loading}
              onSelectCase={id => (selectedCaseId = id)}
              onAddCase={addCase}
            />
          </div>
          <div class="detail-panel">
            <EvalCaseEditor
              {selectedCase}
              {toolOptions}
              onUpdateCase={updateSelectedCase}
              onDuplicateCase={duplicateSelectedCase}
              onRemoveCase={removeSelectedCase}
            />
          </div>
        </div>
      </Tab>
      <Tab title="Runs">
        <div class="evals-split">
          <div class="runs-panel">
            <div class="runs-panel-section">
              <EvalRunList
                {runs}
                {selectedRunId}
                onSelectRun={runId => (selectedRunId = runId)}
              />
            </div>
            <div class="runs-panel-divider"></div>
            <div class="runs-panel-section runs-panel-section--scroll">
              <EvalRunCaseList
                results={selectedRun?.results ?? []}
                selectedCaseId={selectedRunCaseId}
                onSelectCase={selectRunCase}
              />
            </div>
          </div>
          <div class="detail-panel">
            <EvalRunDetail
              selectedResult={selectedRunCaseResult}
              {selectedRun}
            />
          </div>
        </div>
      </Tab>
    </Tabs>
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

  .evals-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--spacing-l);
    padding: var(--spacing-l);
    flex-shrink: 0;
  }

  .evals-header-copy {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    min-width: 0;
  }

  .evals-header-actions {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    flex-shrink: 0;
  }

  .mode-tabs {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    min-height: 0;
  }

  .mode-tabs > :global(.spectrum-Tabs) {
    flex-shrink: 0;
    padding: 0 var(--spacing-l);
  }

  .mode-tabs > :global(.spectrum-Tabs-content) {
    display: flex;
    flex: 1 1 auto;
    min-height: 0;
    margin-top: 0;
  }

  .mode-tabs > :global(.spectrum-Tabs-content > div) {
    display: flex;
    flex: 1 1 auto;
    min-width: 0;
    min-height: 0;
    width: 100%;
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

  .runs-panel {
    flex: 0 0 36%;
    min-width: 340px;
    max-width: 460px;
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
    border-right: 1px solid var(--spectrum-global-color-gray-200);
    background: var(--background);
    padding: var(--spacing-l);
    gap: var(--spacing-l);
  }

  .runs-panel-section {
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .runs-panel-section--scroll {
    flex: 1 1 auto;
    overflow-y: auto;
    scrollbar-width: thin;
  }

  .runs-panel-divider {
    border-top: 1px solid var(--spectrum-global-color-gray-200);
  }

  .detail-panel {
    flex: 1 1 auto;
    min-width: 0;
    min-height: 0;
    overflow-y: auto;
    background: var(--background-alt);
    scrollbar-width: thin;
  }

  .runs-panel-section--scroll::-webkit-scrollbar,
  .detail-panel::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  .runs-panel-section--scroll::-webkit-scrollbar-track,
  .detail-panel::-webkit-scrollbar-track {
    background: transparent;
  }

  .runs-panel-section--scroll::-webkit-scrollbar-thumb,
  .detail-panel::-webkit-scrollbar-thumb {
    background: var(--spectrum-global-color-gray-300);
    border-radius: 3px;
  }

  @media (max-width: 1400px) {
    .evals-split {
      flex-direction: column;
    }

    .evals-list-panel,
    .runs-panel {
      flex: none;
      min-width: 0;
      max-width: none;
      border-right: none;
      border-bottom: 1px solid var(--spectrum-global-color-gray-200);
      max-height: 360px;
    }
  }
</style>
