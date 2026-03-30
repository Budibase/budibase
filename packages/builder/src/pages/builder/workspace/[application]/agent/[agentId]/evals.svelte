<script lang="ts">
  import { API } from "@/api"
  import { selectedAgent } from "@/stores/portal"
  import { Helpers, notifications } from "@budibase/bbui"
  import type {
    AgentEvalCase,
    AgentEvalCaseResult,
    AgentEvalRun,
    AgentEvalSuite,
  } from "@budibase/types"
  import EvalCaseList from "./EvalComponents/EvalCaseList.svelte"
  import EvalCaseDetail from "./EvalComponents/EvalCaseDetail.svelte"

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
  let selectedResult = $derived<AgentEvalCaseResult | null>(
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
      console.error("Failed to load agent evaluation suite", error)
      resetState(agentId)
      notifications.error("Failed to load evaluation suite")
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
      latestRun = run
      recentRuns = [run, ...recentRuns.filter(item => item.runId !== run.runId)]
      selectedRunId = run.runId
      notifications.success("Evaluation run complete")
    } catch (error) {
      console.error("Failed to run evaluation suite", error)
      notifications.error("Failed to run evaluation suite")
    } finally {
      running = false
    }
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
      <EvalCaseList
        cases={suite.cases}
        {resultsByCaseId}
        {selectedCaseId}
        {loading}
        {saving}
        {running}
        onSelectCase={id => (selectedCaseId = id)}
        onAddCase={addCase}
        onSave={() => saveSuite()}
        onRun={runSuite}
      />
    </div>
    <div class="detail-panel">
      <EvalCaseDetail
        {selectedCase}
        {selectedResult}
        selectedRun={selectedRun}
        {recentRuns}
        {selectedRunId}
        onUpdateCase={updateSelectedCase}
        onDuplicateCase={duplicateSelectedCase}
        onRemoveCase={removeSelectedCase}
        onSelectRun={runId => (selectedRunId = runId)}
      />
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
</style>
