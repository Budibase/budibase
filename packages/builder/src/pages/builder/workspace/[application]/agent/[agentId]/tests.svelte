<script lang="ts">
  import { API } from "@/api"
  import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"
  import { agentsStore, featureFlags, selectedAgent } from "@/stores/portal"
  import { Helpers, notifications } from "@budibase/bbui"
  import { buildDefaultAgentTestGroup, FeatureFlag } from "@budibase/types"
  import type {
    AgentTestCase,
    AgentTestGroup,
    AgentTestRun,
    AgentTestSuite,
  } from "@budibase/types"
  import TestCaseList from "./TestComponents/TestCaseList.svelte"
  import TestCaseModal from "./TestComponents/TestCaseModal.svelte"
  import TestDetail from "./TestComponents/TestDetail.svelte"
  import TestGroupModal from "./TestComponents/TestGroupModal.svelte"
  import * as routify from "@roxi/routify"

  const { goto } = routify
  $goto

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

  let suite = $state<AgentTestSuite>(emptySuite())
  let loading = $state(false)
  let saving = $state(false)
  let running = $state(false)
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
      suite.cases.filter(c => c.lastResult).map(c => [c.id, c.lastResult!])
    )
  )
  let hasAnyLatestResult = $derived(suite.cases.some(c => !!c.lastResult))
  let selectedCase = $derived(
    suite.cases.find(c => c.id === selectedCaseId) || null
  )
  let latestResultForSelected = $derived(
    selectedCaseId ? (latestResultsByCaseId.get(selectedCaseId) ?? null) : null
  )

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
    const byCaseId = new Map(run.results.map(r => [r.caseId, r]))
    suite = {
      ...suite,
      cases: suite.cases.map(testCase => {
        const result = byCaseId.get(testCase.id)
        return result ? { ...testCase, lastResult: result } : testCase
      }),
    }
  }

  const runCase = async (caseId?: string) => {
    const agentId = currentAgent?._id
    if (!agentId || running || saving) return false

    running = true
    try {
      const { run } = await API.runAgentTestSuite(
        agentId,
        caseId ? { caseId } : {}
      )
      mergeRunResults(run)
      notifications.success(`Run complete · ${run.passed}/${run.total} passed`)
      return true
    } catch (error) {
      console.error("Failed to run test", error)
      notifications.error("Failed to run test")
      return false
    } finally {
      running = false
    }
  }

  const runAllTests = async () => {
    const agentId = currentAgent?._id
    if (!agentId || !selectedGroupId || running || saving) return false

    running = true
    try {
      const { run } = await API.runAgentTestSuite(agentId, {
        groupId: selectedGroupId,
      })
      mergeRunResults(run)
      notifications.success(`Run complete · ${run.passed}/${run.total} passed`)
      return true
    } catch (error) {
      console.error("Failed to run tests", error)
      notifications.error("Failed to run tests")
      return false
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
    if (agentId === lastAgentId) return
    lastAgentId = agentId
    resetState(agentId)
    loadSuite(agentId)
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
        latestResult={latestResultForSelected}
        hasLatestRun={hasAnyLatestResult}
      />
    </div>
  </div>

  <TestCaseModal
    bind:this={testCaseModal}
    {toolOptions}
    {groupOptions}
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
    background: #1a1a1a;
    border-top: 1px solid #2c2c2c;
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
    border-right: 1px solid #2c2c2c;
    background: #1a1a1a;
  }

  .detail-panel {
    flex: 0 0 50%;
    min-width: 0;
    min-height: 0;
    overflow-y: auto;
    background: #1a1a1a;
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
      border-bottom: 1px solid #2c2c2c;
      max-height: 360px;
    }
  }
</style>
