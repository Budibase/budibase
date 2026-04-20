<script lang="ts">
  import { API } from "@/api"
  import { agentsStore, featureFlags, selectedAgent } from "@/stores/portal"
  import { Helpers, notifications } from "@budibase/bbui"
  import { FeatureFlag } from "@budibase/types"
  import type {
    AgentTestCase,
    AgentTestRun,
    AgentTestSuite,
  } from "@budibase/types"
  import TestCaseList from "./TestComponents/TestCaseList.svelte"
  import TestCaseModal from "./TestComponents/TestCaseModal.svelte"
  import TestDetail from "./TestComponents/TestDetail.svelte"
  import * as routify from "@roxi/routify"

  const { goto } = routify
  $goto

  const createEmptySuite = (agentId = ""): AgentTestSuite => ({
    agentId,
    cases: [],
  })

  const createCase = (index: number): AgentTestCase => ({
    id: Helpers.uuid(),
    name: `Test ${index + 1}`,
    input: "",
    reviewers: [],
  })

  let suite = $state<AgentTestSuite>(createEmptySuite())
  let runs = $state<AgentTestRun[]>([])
  let loading = $state(false)
  let saving = $state(false)
  let running = $state(false)
  let selectedCaseId = $state<string | null>(null)
  let lastAgentId = $state<string | undefined>()
  let testsEnabled = $derived($featureFlags[FeatureFlag.AI_TESTS])
  let testCaseModal: TestCaseModal

  let currentAgent = $derived($selectedAgent)
  let toolOptions = $derived.by(() => {
    const enabled = new Set(currentAgent?.enabledTools ?? [])
    const tools = $agentsStore.tools ?? []
    return tools
      .filter(t => enabled.has(t.name))
      .map(t => ({ label: t.readableName || t.name, value: t.name }))
  })
  let latestRun = $derived(runs[0] ?? null)
  let latestResultsByCaseId = $derived(
    new Map((latestRun?.results ?? []).map(result => [result.caseId, result]))
  )
  let selectedCase = $derived(
    suite.cases.find(testCase => testCase.id === selectedCaseId) || null
  )
  let latestResultForSelected = $derived(
    selectedCaseId ? (latestResultsByCaseId.get(selectedCaseId) ?? null) : null
  )

  const resetState = (agentId?: string) => {
    suite = createEmptySuite(agentId)
    runs = []
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
    if (!testsEnabled) {
      $goto("../config")
      return
    }

    if (!agentId) {
      resetState()
      return
    }

    loading = true
    try {
      const response = await API.fetchAgentTestSuite(agentId)
      suite = response.suite
      runs = response.runs
      ensureSelection()
    } catch (error) {
      console.error("Failed to load agent test suite", error)
      resetState(agentId)
      notifications.error("Failed to load tests")
    } finally {
      loading = false
    }
  }

  const persistCases = async (
    cases: AgentTestCase[],
    {
      nextSelectedCaseId,
      successMessage,
    }: { nextSelectedCaseId?: string | null; successMessage?: string } = {}
  ) => {
    const agentId = currentAgent?._id
    if (!agentId || saving) {
      return false
    }

    saving = true
    try {
      suite = await API.updateAgentTestSuite(agentId, {
        _rev: suite._rev,
        cases,
      })

      if (nextSelectedCaseId !== undefined) {
        selectedCaseId =
          suite.cases.find(testCase => testCase.id === nextSelectedCaseId)
            ?.id ??
          suite.cases[0]?.id ??
          null
      } else {
        ensureSelection()
      }

      if (successMessage) {
        notifications.success(successMessage)
      }

      return true
    } catch (error) {
      console.error("Failed to save test suite", error)
      notifications.error("Failed to save tests")
      return false
    } finally {
      saving = false
    }
  }

  const openCreateCaseModal = () => {
    testCaseModal?.showCreate(createCase(suite.cases.length))
  }

  const openEditCaseModal = () => {
    if (!selectedCase) {
      return
    }

    testCaseModal?.showEdit(selectedCase)
  }

  const addCase = async (testCase: AgentTestCase) => {
    return persistCases([...suite.cases, testCase], {
      nextSelectedCaseId: testCase.id,
      successMessage: "Test added",
    })
  }

  const updateCase = async (testCase: AgentTestCase) => {
    return persistCases(
      suite.cases.map(currentCase =>
        currentCase.id === testCase.id ? testCase : currentCase
      ),
      {
        nextSelectedCaseId: testCase.id,
        successMessage: "Test updated",
      }
    )
  }

  const duplicateSelectedCase = async () => {
    if (!selectedCase) {
      return
    }

    const duplicated: AgentTestCase = {
      ...selectedCase,
      id: Helpers.uuid(),
      name: `${selectedCase.name} copy`,
      reviewers: selectedCase.reviewers.map(reviewer => ({
        ...reviewer,
        id: Helpers.uuid(),
      })),
    }

    await persistCases([...suite.cases, duplicated], {
      nextSelectedCaseId: duplicated.id,
      successMessage: "Test duplicated",
    })
  }

  const removeSelectedCase = async () => {
    if (!selectedCaseId) {
      return
    }

    const remainingCases = suite.cases.filter(
      testCase => testCase.id !== selectedCaseId
    )
    await persistCases(remainingCases, {
      nextSelectedCaseId: remainingCases[0]?.id ?? null,
      successMessage: "Test deleted",
    })
  }

  const runSelectedCase = async () => {
    const agentId = currentAgent?._id
    const caseId = selectedCaseId
    if (!agentId || !caseId || running || saving) {
      return
    }

    running = true
    try {
      const { run } = await API.runAgentTestSuite(agentId, { caseId })
      runs = [run, ...runs.filter(item => item.runId !== run.runId)]
      notifications.success(`Run complete · ${run.passed}/${run.total} passed`)
    } catch (error) {
      console.error("Failed to run test", error)
      notifications.error("Failed to run test")
    } finally {
      running = false
    }
  }

  $effect(() => {
    if (!testsEnabled) {
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

<div class="tests-container">
  <div class="tests-split">
    <div class="tests-list-panel">
      <TestCaseList
        cases={suite.cases}
        hasLatestRun={!!latestRun}
        {selectedCaseId}
        {loading}
        onSelectCase={id => (selectedCaseId = id)}
        onAddCase={openCreateCaseModal}
      />
    </div>
    <div class="detail-panel">
      <TestDetail
        {selectedCase}
        latestResult={latestResultForSelected}
        hasLatestRun={!!latestRun}
        {saving}
        {running}
        {loading}
        onRun={runSelectedCase}
        onEditCase={openEditCaseModal}
        onDuplicateCase={duplicateSelectedCase}
        onRemoveCase={removeSelectedCase}
      />
    </div>
  </div>

  <TestCaseModal
    bind:this={testCaseModal}
    {toolOptions}
    onSave={async testCase => {
      const exists = suite.cases.some(
        currentCase => currentCase.id === testCase.id
      )
      return exists ? updateCase(testCase) : addCase(testCase)
    }}
  />
</div>

<style>
  .tests-container {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    height: 100%;
    min-height: 0;
  }

  .tests-split {
    display: flex;
    flex: 1 1 auto;
    min-height: 0;
    overflow: hidden;
    background: var(--background);
    border-top: 1px solid var(--spectrum-global-color-gray-200);
  }

  .tests-list-panel {
    flex: 0 0 clamp(260px, 26vw, 340px);
    min-width: 0;
    max-width: 380px;
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

  @media (max-width: 1200px) {
    .tests-split {
      flex-direction: column;
    }

    .tests-list-panel {
      flex: none;
      min-width: 0;
      max-width: none;
      border-right: none;
      border-bottom: 1px solid var(--spectrum-global-color-gray-200);
      max-height: 360px;
    }
  }
</style>
