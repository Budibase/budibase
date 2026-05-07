<script lang="ts">
  import { API } from "@/api"
  import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"
  import {
    agentsStore,
    aiConfigsStore,
    featureFlags,
    selectedAgent,
  } from "@/stores/portal"
  import { Helpers, notifications } from "@budibase/bbui"
  import {
    AIConfigType,
    buildDefaultAgentTestGroup,
    FeatureFlag,
  } from "@budibase/types"
  import type {
    AgentTestCase,
    AgentTestCaseResult,
    AgentTestGroup,
    AgentTestRun,
    AgentTestSuite,
  } from "@budibase/types"
  import TestCaseList from "./TestComponents/TestCaseList.svelte"
  import TestCaseModal from "./TestComponents/TestCaseModal.svelte"
  import TestDetail from "./TestComponents/TestDetail.svelte"
  import TestGroupModal from "./TestComponents/TestGroupModal.svelte"
  import * as routify from "@roxi/routify"
  import { createPolling } from "@/utils/polling"
  import { onDestroy } from "svelte"
  import type { RunAgentTestSuiteRequest } from "@budibase/types"

  const { goto } = routify
  $goto
  const TEST_RUN_POLL_INTERVAL_MS = 1000
  const MAX_RUN_POLL_ERRORS = 3

  const emptySuite = (agentId = ""): AgentTestSuite => ({
    agentId,
    groups: [buildDefaultAgentTestGroup()],
    cases: [],
  })

  const newCase = (index: number, groupId: string): AgentTestCase => ({
    id: Helpers.uuid(),
    groupId,
    name: `Test ${index + 1}`,
    input: "",
    aiConfigIds: currentAgent?.aiconfig ? [currentAgent.aiconfig] : [],
    reviewers: [],
  })

  const getSelectedGroupId = (
    groups: AgentTestGroup[],
    preferredGroupId?: string | null
  ) =>
    groups.find(group => group.id === preferredGroupId)?.id ??
    groups[0]?.id ??
    null

  const getSelectedCaseId = (
    cases: AgentTestCase[],
    groupId: string | null,
    preferredCaseId?: string | null
  ) =>
    cases.find(
      testCase =>
        testCase.id === preferredCaseId &&
        (!groupId || testCase.groupId === groupId)
    )?.id ??
    cases.find(testCase => !groupId || testCase.groupId === groupId)?.id ??
    null

  const getLatestResults = (testCase: AgentTestCase): AgentTestCaseResult[] =>
    testCase.lastResults || (testCase.lastResult ? [testCase.lastResult] : [])

  interface ActiveTestRun {
    runId: string
    caseIds: string[]
    pollErrorCount: number
  }

  let suite = $state<AgentTestSuite>(emptySuite())
  let loading = $state(false)
  let saving = $state(false)
  let activeRuns = $state<ActiveTestRun[]>([])
  let preferredGroupId = $state<string | null>(buildDefaultAgentTestGroup().id)
  let preferredCaseId = $state<string | null>(null)
  let lastAgentId = $state<string | undefined>()
  let testsEnabled = $derived($featureFlags[FeatureFlag.AI_TESTS])
  let testCaseModal: TestCaseModal
  let testGroupModal: TestGroupModal
  let deleteGroupDialog: ConfirmDialog

  let currentAgent = $derived($selectedAgent)
  let toolOptions = $derived.by(() => {
    const enabled = new Set(currentAgent?.enabledTools ?? [])
    const tools = $agentsStore.tools ?? []
    return tools
      .filter(t => enabled.has(t.name))
      .map(t => ({ label: t.readableName || t.name, value: t.name }))
  })
  let aiConfigOptions = $derived(
    $aiConfigsStore.customConfigsPerType[AIConfigType.COMPLETIONS].map(
      config => ({
        label: config.name || config._id || "Unnamed",
        value: config._id || "",
      })
    )
  )
  let groupOptions = $derived(
    suite.groups.map(group => ({
      label: group.name,
      value: group.id,
    }))
  )
  let selectedGroupId = $derived(
    getSelectedGroupId(suite.groups, preferredGroupId)
  )
  let selectedCaseId = $derived(
    getSelectedCaseId(suite.cases, selectedGroupId, preferredCaseId)
  )
  let selectedGroup = $derived(
    suite.groups.find(group => group.id === selectedGroupId) ?? null
  )
  let latestResultsByCaseId = $derived(
    new Map(
      suite.cases
        .map(testCase => [testCase.id, getLatestResults(testCase)] as const)
        .filter(([, results]) => results.length)
    )
  )
  let hasAnyLatestResult = $derived(
    suite.cases.some(c => !!c.lastResult || !!c.lastResults?.length)
  )
  let selectedCase = $derived(
    suite.cases.find(c => c.id === selectedCaseId) || null
  )
  let latestResultsForSelected = $derived(
    selectedCaseId ? (latestResultsByCaseId.get(selectedCaseId) ?? []) : []
  )
  let running = $derived(activeRuns.length > 0)
  let runningCaseIds = $derived(new Set(activeRuns.flatMap(run => run.caseIds)))

  const resetState = (agentId?: string) => {
    suite = emptySuite(agentId)
    preferredGroupId = null
    preferredCaseId = null
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
    } catch (error) {
      console.error("Failed to load agent test suite", error)
      resetState(agentId)
      notifications.error("Failed to load tests")
    } finally {
      loading = false
    }
  }

  const persistSuite = async (
    {
      groups = suite.groups,
      cases = suite.cases,
    }: {
      groups?: AgentTestGroup[]
      cases?: AgentTestCase[]
    },
    {
      nextSelectedGroupId,
      nextSelectedCaseId,
      successMessage,
    }: {
      nextSelectedGroupId?: string | null
      nextSelectedCaseId?: string | null
      successMessage?: string
    } = {}
  ) => {
    const agentId = currentAgent?._id
    if (!agentId || saving) return false

    saving = true
    try {
      suite = await API.updateAgentTestSuite(agentId, {
        _rev: suite._rev,
        groups,
        cases,
      })
      if (nextSelectedGroupId !== undefined) {
        preferredGroupId = nextSelectedGroupId
      }
      if (nextSelectedCaseId !== undefined) {
        preferredCaseId = nextSelectedCaseId
      }
      if (successMessage) notifications.success(successMessage)
      return true
    } catch (error) {
      console.error("Failed to save test suite", error)
      notifications.error("Failed to save tests")
      return false
    } finally {
      saving = false
    }
  }

  const saveCase = async (testCase: AgentTestCase) => {
    const isNew = !suite.cases.some(c => c.id === testCase.id)
    const cases = isNew
      ? [...suite.cases, testCase]
      : suite.cases.map(c => (c.id === testCase.id ? testCase : c))
    return persistSuite(
      { cases },
      {
        nextSelectedGroupId: testCase.groupId,
        nextSelectedCaseId: testCase.id,
        successMessage: isNew ? "Test added" : "Test updated",
      }
    )
  }

  const saveAndRunCase = async (testCase: AgentTestCase) => {
    const saved = await saveCase(testCase)
    if (!saved) return false
    return runCase(testCase.id)
  }

  const duplicateCase = async (caseId: string) => {
    const sourceCase = suite.cases.find(testCase => testCase.id === caseId)
    if (!sourceCase) return

    const duplicated: AgentTestCase = {
      ...sourceCase,
      id: Helpers.uuid(),
      name: `${sourceCase.name} copy`,
      aiConfigIds: sourceCase.aiConfigIds ? [...sourceCase.aiConfigIds] : [],
      reviewers: sourceCase.reviewers.map(r => ({
        ...r,
        id: Helpers.uuid(),
      })),
    }
    await persistSuite(
      { cases: [...suite.cases, duplicated] },
      {
        nextSelectedGroupId: duplicated.groupId,
        nextSelectedCaseId: duplicated.id,
        successMessage: "Test duplicated",
      }
    )
  }

  const removeCase = async (caseId: string) => {
    const remaining = suite.cases.filter(c => c.id !== caseId)
    await persistSuite(
      { cases: remaining },
      {
        nextSelectedGroupId: selectedGroupId,
        nextSelectedCaseId: null,
        successMessage: "Test deleted",
      }
    )
  }

  const saveGroup = async (
    group: AgentTestGroup | Omit<AgentTestGroup, "id">
  ) => {
    const nextGroup = "id" in group ? group : { ...group, id: Helpers.uuid() }
    const isNew = !suite.groups.some(existing => existing.id === nextGroup.id)
    const groups = isNew
      ? [...suite.groups, nextGroup]
      : suite.groups.map(existing =>
          existing.id === nextGroup.id ? nextGroup : existing
        )

    return persistSuite(
      { groups },
      {
        nextSelectedGroupId: nextGroup.id,
        successMessage: isNew ? "Test group created" : "Test group renamed",
      }
    )
  }

  const deleteGroup = async () => {
    if (!selectedGroupId || suite.groups.length <= 1) {
      return
    }

    const groups = suite.groups.filter(group => group.id !== selectedGroupId)
    const cases = suite.cases.filter(
      testCase => testCase.groupId !== selectedGroupId
    )
    await persistSuite(
      { groups, cases },
      {
        nextSelectedGroupId: groups[0]?.id ?? null,
        nextSelectedCaseId: null,
        successMessage: "Test group deleted",
      }
    )
  }

  const mergeRunResults = (run: AgentTestRun) => {
    const byCaseId = new Map<string, AgentTestRun["results"]>()
    for (const result of run.results) {
      const results = byCaseId.get(result.caseId) || []
      results.push(result)
      byCaseId.set(result.caseId, results)
    }

    suite = {
      ...suite,
      cases: suite.cases.map(testCase => {
        const results = byCaseId.get(testCase.id)
        return results
          ? { ...testCase, lastResult: results[0], lastResults: results }
          : testCase
      }),
    }
  }

  const stopPollingIfIdle = () => {
    if (!activeRuns.length) {
      testRunPolling.stop()
    }
  }

  const clearActiveRuns = () => {
    activeRuns = []
    testRunPolling.stop()
  }

  const finishActiveRun = (runId: string) => {
    activeRuns = activeRuns.filter(run => run.runId !== runId)
    stopPollingIfIdle()
  }

  const updatePollErrorCount = (runId: string) => {
    activeRuns = activeRuns.map(run =>
      run.runId === runId
        ? { ...run, pollErrorCount: run.pollErrorCount + 1 }
        : run
    )
  }

  const pollActiveRun = async (activeRun: ActiveTestRun) => {
    const agentId = currentAgent?._id
    if (!agentId) return

    try {
      const { run } = await API.fetchAgentTestRun(agentId, activeRun.runId)
      if (run.runId !== activeRun.runId || run.status === "running") {
        return
      }

      finishActiveRun(activeRun.runId)
      if (run.status === "completed" && run.run) {
        mergeRunResults(run.run)
        notifications.success(
          `Run complete · ${run.run.passed}/${run.run.total} passed`
        )
        return
      }

      notifications.error(run.error || "Failed to run test")
    } catch (error) {
      console.error("Failed to poll test run", error)
      updatePollErrorCount(activeRun.runId)
      if (activeRun.pollErrorCount + 1 < MAX_RUN_POLL_ERRORS) return

      finishActiveRun(activeRun.runId)
      notifications.error("Failed to fetch test run status")
    }
  }

  const pollActiveRuns = async () => {
    if (!activeRuns.length) {
      return
    }

    await Promise.all(activeRuns.map(pollActiveRun))
  }

  const testRunPolling = createPolling({
    intervalMs: TEST_RUN_POLL_INTERVAL_MS,
    immediate: true,
    poll: pollActiveRuns,
    shouldPoll: () => activeRuns.length > 0,
  })

  const startRun = async ({
    body,
    caseIds,
  }: {
    body: RunAgentTestSuiteRequest
    caseIds: string[]
  }) => {
    const agentId = currentAgent?._id
    if (!agentId || saving) return false

    try {
      const { runId } = await API.runAgentTestSuite(agentId, body)
      activeRuns = [...activeRuns, { runId, caseIds, pollErrorCount: 0 }]
      testRunPolling.start()
      return true
    } catch (error) {
      console.error("Failed to run test", error)
      notifications.error("Failed to run test")
      return false
    }
  }

  const runCase = async (caseId: string) => {
    if (runningCaseIds.has(caseId)) return false
    return startRun({
      body: { caseId },
      caseIds: [caseId],
    })
  }

  const runAllTests = async () => {
    const agentId = currentAgent?._id
    if (!agentId || !selectedGroupId || saving) return false

    const groupCaseIds = suite.cases
      .filter(testCase => testCase.groupId === selectedGroupId)
      .map(testCase => testCase.id)

    if (!groupCaseIds.length) return false
    if (groupCaseIds.some(caseId => runningCaseIds.has(caseId))) return false

    return startRun({
      body: { groupId: selectedGroupId },
      caseIds: groupCaseIds,
    })
  }

  $effect(() => {
    if (!testsEnabled) {
      $goto("../config")
      return
    }
    const agentId = currentAgent?._id
    if (agentId === lastAgentId) return
    lastAgentId = agentId
    clearActiveRuns()
    resetState(agentId)
    loadSuite(agentId)
  })

  onDestroy(() => {
    testRunPolling.stop()
  })
</script>

<div class="tests-container">
  <div class="tests-split">
    <div class="tests-list-panel">
      <TestCaseList
        groups={suite.groups}
        cases={suite.cases}
        {selectedCaseId}
        {selectedGroupId}
        {loading}
        {saving}
        {running}
        {runningCaseIds}
        hasLatestRun={hasAnyLatestResult}
        {latestResultsByCaseId}
        onSelectCase={id => (preferredCaseId = id)}
        onSelectGroup={id => (preferredGroupId = id)}
        onCreateGroup={() => testGroupModal?.show()}
        onRenameGroup={() =>
          selectedGroup && testGroupModal?.show(selectedGroup)}
        onDeleteGroup={() => deleteGroupDialog?.show()}
        onAddCase={() =>
          selectedGroupId &&
          testCaseModal?.show(newCase(suite.cases.length, selectedGroupId))}
        onEditCase={id => {
          const testCase = suite.cases.find(test => test.id === id)
          if (testCase) testCaseModal?.show(testCase)
        }}
        onRunCase={id => {
          runCase(id)
        }}
        onRunAll={runAllTests}
        onDuplicateCase={duplicateCase}
        onRemoveCase={removeCase}
      />
    </div>
    <div class="detail-panel">
      <TestDetail
        {selectedCase}
        latestResults={latestResultsForSelected}
        hasLatestRun={hasAnyLatestResult}
      />
    </div>
  </div>

  <TestCaseModal
    bind:this={testCaseModal}
    {toolOptions}
    {groupOptions}
    {aiConfigOptions}
    defaultAiConfigId={currentAgent?.aiconfig}
    isExisting={id => suite.cases.some(c => c.id === id)}
    onSave={saveAndRunCase}
  />

  <TestGroupModal bind:this={testGroupModal} onSave={saveGroup} />

  <ConfirmDialog
    bind:this={deleteGroupDialog}
    title="Delete test group"
    body={`Delete "${selectedGroup?.name || "this group"}" and all tests in it?`}
    okText="Delete group"
    onOk={deleteGroup}
    disabled={suite.groups.length <= 1}
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
    flex: 0 0 50%;
    min-width: 0;
    max-width: none;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    min-height: 0;
    overflow: hidden;
    border-right: 1px solid var(--spectrum-global-color-gray-200);
    background: var(--background);
  }

  .detail-panel {
    flex: 0 0 50%;
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
