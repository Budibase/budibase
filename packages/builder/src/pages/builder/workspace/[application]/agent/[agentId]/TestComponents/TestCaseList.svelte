<script lang="ts">
  import {
    ActionButton,
    ActionMenu,
    Body,
    Button,
    Icon,
    MenuItem,
    ProgressCircle,
    Search,
    Select,
  } from "@budibase/bbui"
  import type {
    AgentTestCase,
    AgentTestCaseResult,
    AgentTestGroup,
  } from "@budibase/types"
  import { formatRunTime, getVerdictMeta, type VerdictStatus } from "./utils"

  type StatusFilter = "all" | VerdictStatus

  interface Option<T extends string> {
    label: string
    value: T
  }

  type Props = {
    groups: AgentTestGroup[]
    cases: AgentTestCase[]
    selectedCaseId: string | null
    selectedGroupId: string | null
    loading: boolean
    saving: boolean
    running: boolean
    runningCaseIds: Set<string>
    hasLatestRun: boolean
    latestResultsByCaseId: Map<string, AgentTestCaseResult[]>
    onSelectCase: (_caseId: string) => void
    onSelectGroup: (_groupId: string) => void
    onCreateGroup: () => void
    onRenameGroup: () => void
    onDeleteGroup: () => void
    onAddCase: () => void
    onEditCase: (_caseId: string) => void
    onRunCase: (_caseId: string) => void
    onRunAll: () => void
    onDuplicateCase: (_caseId: string) => void
    onRemoveCase: (_caseId: string) => void
  }

  let {
    groups,
    cases,
    selectedCaseId,
    selectedGroupId,
    loading,
    saving,
    running,
    runningCaseIds,
    hasLatestRun,
    latestResultsByCaseId,
    onSelectCase,
    onSelectGroup,
    onCreateGroup,
    onRenameGroup,
    onDeleteGroup,
    onAddCase,
    onEditCase,
    onRunCase,
    onRunAll,
    onDuplicateCase,
    onRemoveCase,
  }: Props = $props()

  const statusOptions: Option<StatusFilter>[] = [
    { label: "All statuses", value: "all" },
    { label: "Passed", value: "passed" },
    { label: "Failed", value: "failed" },
    { label: "Error", value: "error" },
    { label: "Not run", value: "idle" },
  ]

  let search = $state("")
  let statusFilter = $state<StatusFilter>("all")

  const getInputPreview = (input: string) =>
    input.replace(/\s+/g, " ").trim() || "No input"

  const getLastRunLabel = (results: AgentTestCaseResult[] | undefined) => {
    if (!results?.length) {
      return hasLatestRun ? "Not in latest run" : "Not run"
    }

    const completedAt = results
      .map(result => result.completedAt)
      .sort()
      .slice(-1)[0]
    return formatRunTime(completedAt)
  }

  const getCaseStatus = (
    results: AgentTestCaseResult[] | undefined
  ): VerdictStatus => {
    if (!results?.length) return "idle"
    if (results.some(result => result.status === "error")) return "error"
    if (results.some(result => result.status === "failed")) return "failed"
    return "passed"
  }

  const getStatusLabel = (results: AgentTestCaseResult[] | undefined) => {
    if (!results?.length) return "Not run"
    const passed = results.filter(result => result.status === "passed").length
    return `${passed}/${results.length} passed`
  }

  let groupOptions = $derived(
    groups.map(group => ({
      label: group.name,
      value: group.id,
    }))
  )

  let selectedGroup = $derived(
    groups.find(group => group.id === selectedGroupId) ?? null
  )

  let casesForSelectedGroup = $derived(
    selectedGroupId
      ? cases.filter(testCase => testCase.groupId === selectedGroupId)
      : []
  )

  let filteredCases = $derived.by(() => {
    const query = search.trim().toLowerCase()

    return casesForSelectedGroup.filter(testCase => {
      const status = getCaseStatus(latestResultsByCaseId.get(testCase.id))
      const matchesStatus = statusFilter === "all" || status === statusFilter
      const matchesQuery =
        !query ||
        testCase.name.toLowerCase().includes(query) ||
        testCase.input.toLowerCase().includes(query)

      return matchesStatus && matchesQuery
    })
  })
</script>

<div class="case-list-shell">
  <div class="toolbar-stack">
    <div class="toolbar-row">
      <div class="group-controls">
        <div class="group-select-shell">
          <Select
            value={selectedGroupId ?? undefined}
            options={groupOptions}
            placeholder={false}
            getOptionLabel={option => option.label}
            getOptionValue={option => option.value}
            on:change={event => onSelectGroup(event.detail)}
          />
        </div>

        <Button
          secondary
          icon="plus"
          size="M"
          disabled={loading || saving || running}
          on:click={onCreateGroup}
        >
          New group
        </Button>
      </div>

      <div class="top-actions">
        <ActionMenu
          align="right"
          disabled={!selectedGroupId || loading || saving || running}
          roundedPopover
        >
          <div slot="control">
            <ActionButton icon="pencil-simple">Manage</ActionButton>
          </div>
          <MenuItem icon="pencil-simple" on:click={onRenameGroup}>
            Rename group
          </MenuItem>
          <MenuItem
            icon="trash"
            disabled={groups.length <= 1}
            on:click={onDeleteGroup}
          >
            Delete group
          </MenuItem>
        </ActionMenu>

        <Button
          secondary
          icon="play"
          iconWeight="fill"
          disabled={!casesForSelectedGroup.length ||
            loading ||
            saving ||
            running}
          on:click={onRunAll}
        >
          Run all tests
        </Button>
      </div>
    </div>

    <div class="toolbar-row toolbar-row-filters">
      <div class="search-shell">
        <Search bind:value={search} placeholder="Search tests" />
      </div>
      <div class="filter-shell">
        <Select
          bind:value={statusFilter}
          options={statusOptions}
          placeholder={false}
          getOptionLabel={option => option.label}
          getOptionValue={option => option.value}
        />
      </div>
      <Button
        secondary
        icon="plus"
        size="M"
        disabled={loading || saving || running}
        on:click={onAddCase}
      >
        Add test
      </Button>
    </div>
  </div>

  <div class="case-list-body">
    {#if loading && !cases.length}
      <div class="empty-state">
        <Body size="S" color="var(--spectrum-global-color-gray-400)">
          Loading tests...
        </Body>
      </div>
    {:else if !cases.length}
      <div class="empty-state">
        <div class="empty-state-content">
          <Body size="S" color="var(--spectrum-global-color-gray-400)">
            No tests yet.
          </Body>
          <Button
            secondary
            icon="plus"
            disabled={loading || saving || running}
            on:click={onAddCase}
          >
            Add first test
          </Button>
        </div>
      </div>
    {:else if !casesForSelectedGroup.length}
      <div class="empty-state">
        <div class="empty-state-content">
          <Body size="S" color="var(--spectrum-global-color-gray-400)">
            {selectedGroup?.name || "This group"} has no tests yet.
          </Body>
          <Button
            secondary
            icon="plus"
            disabled={loading || saving || running}
            on:click={onAddCase}
          >
            Add test
          </Button>
        </div>
      </div>
    {:else if !filteredCases.length}
      <div class="empty-state">
        <div class="empty-state-content">
          <Body size="S" color="var(--spectrum-global-color-gray-400)">
            No tests match the current filters.
          </Body>
        </div>
      </div>
    {:else}
      <div class="table-header" aria-hidden="true">
        <span class="th-test">Test</span>
        <span>Status</span>
        <span>Last run</span>
        <span></span>
      </div>

      <div class="case-items" role="list" aria-label="Agent tests">
        {#each filteredCases as testCase (testCase.id)}
          {@const latestResults = latestResultsByCaseId.get(testCase.id)}
          {@const statusMeta = getVerdictMeta(getCaseStatus(latestResults))}
          {@const showSpinner = runningCaseIds.has(testCase.id)}
          <div class="case-row" class:selected={testCase.id === selectedCaseId}>
            <button
              class="case-row-select"
              type="button"
              onclick={() => onSelectCase(testCase.id)}
            >
              <div class="case-cell case-cell-primary">
                <span class="status-icon-badge">
                  {#if showSpinner}
                    <ProgressCircle size="S" />
                  {:else}
                    <Icon
                      name={statusMeta.icon}
                      size="S"
                      color={statusMeta.color}
                    />
                  {/if}
                </span>

                <div class="case-text-block">
                  <div class="case-title-line">
                    <span class="case-item-name">{testCase.name}</span>
                  </div>
                  <div class="case-item-subtitle">
                    {getInputPreview(testCase.input)}
                  </div>
                </div>
              </div>

              <div class="case-cell case-cell-status">
                <span
                  class={`status-pill ${showSpinner ? "idle" : statusMeta.tone}`}
                >
                  {showSpinner ? "Running..." : getStatusLabel(latestResults)}
                </span>
              </div>

              <div class="case-cell case-cell-last-run">
                {showSpinner ? "Running..." : getLastRunLabel(latestResults)}
              </div>
            </button>

            <div class="case-cell case-cell-actions">
              <ActionMenu align="right" disabled={running} roundedPopover>
                <div slot="control">
                  <Icon size="M" hoverable name="dots-three" />
                </div>
                {@render caseMenuItems(testCase.id)}
              </ActionMenu>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

{#snippet caseMenuItems(caseId: string)}
  <MenuItem
    icon="play"
    disabled={running}
    on:click={() => onRunCase(caseId)}
  >
    Run test
  </MenuItem>
  <MenuItem icon="pencil-simple" on:click={() => onEditCase(caseId)}>
    Edit test
  </MenuItem>
  <MenuItem icon="copy" on:click={() => onDuplicateCase(caseId)}>
    Duplicate test
  </MenuItem>
  <MenuItem icon="trash" on:click={() => onRemoveCase(caseId)}>
    Delete test
  </MenuItem>
{/snippet}

<style>
  .case-list-shell {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    min-height: 0;
  }

  .toolbar-stack {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
    border-bottom: 1px solid var(--spectrum-global-color-gray-200);
  }

  .toolbar-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .toolbar-row-filters {
    align-items: stretch;
  }

  .group-controls {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }

  .group-select-shell {
    flex: 0 0 240px;
    min-width: 0;
  }

  .search-shell {
    flex: 1 1 auto;
    min-width: 0;
  }

  .filter-shell {
    flex: 0 0 180px;
  }

  .top-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .case-list-body {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    min-height: 0;
    overflow: hidden;
  }

  .table-header,
  .case-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 120px 140px 48px;
    gap: 12px;
    align-items: center;
    padding: 0 16px;
  }

  .table-header {
    height: 40px;
    color: var(--spectrum-global-color-gray-600);
    font-size: 12px;
    border-bottom: 1px solid var(--spectrum-global-color-gray-200);
  }

  .case-items {
    overflow-y: auto;
  }

  .case-row {
    min-height: 56px;
    border-bottom: 1px solid var(--spectrum-global-color-gray-200);
  }

  .case-row.selected {
    background: var(--spectrum-global-color-gray-200);
  }

  .case-row-select {
    display: contents;
    text-align: left;
  }

  .th-test {
    padding-left: 32px;
  }

  .case-cell {
    min-width: 0;
  }

  .case-cell-primary {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 0;
  }

  .case-text-block {
    min-width: 0;
  }

  .case-title-line {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .case-item-name,
  .case-item-subtitle,
  .case-cell-last-run {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .case-item-name {
    color: var(--spectrum-alias-text-color);
  }

  .case-item-subtitle,
  .case-cell-last-run {
    color: var(--spectrum-global-color-gray-600);
    font-size: 12px;
  }

  .status-icon-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    flex: 0 0 auto;
  }

  .status-pill {
    display: inline-flex;
    align-items: center;
    font-size: 12px;
    color: var(--spectrum-global-color-gray-700);
  }

  .status-pill.passed {
    color: var(--color-green-500);
  }

  .status-pill.failed,
  .status-pill.error {
    color: var(--color-orange-500);
  }

  .status-pill.idle {
    color: var(--spectrum-global-color-gray-600);
  }

  .case-cell-actions {
    display: flex;
    justify-content: center;
  }

  .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1 1 auto;
    padding: 32px;
  }

  .empty-state-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .group-select-shell :global(.spectrum-Field),
  .search-shell :global(.spectrum-Field),
  .filter-shell :global(.spectrum-Field) {
    width: 100%;
  }

  @media (max-width: 960px) {
    .toolbar-row,
    .toolbar-row-filters {
      flex-direction: column;
      align-items: stretch;
    }

    .group-select-shell,
    .filter-shell {
      flex-basis: auto;
    }

    .group-controls {
      flex-direction: column;
      align-items: stretch;
    }

    .top-actions {
      justify-content: space-between;
    }

    .table-header {
      display: none;
    }

    .case-row {
      grid-template-columns: minmax(0, 1fr) 32px;
      gap: 8px;
      padding: 0 10px;
    }

    .case-cell-status,
    .case-cell-last-run {
      display: none;
    }

    .case-cell-actions {
      justify-content: flex-end;
    }
  }
</style>
