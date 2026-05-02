<script>
  import {
    Body,
    Select,
    notifications,
    Pagination,
    Button,
    Icon,
    Toggle,
    TextInput,
  } from "@budibase/bbui"
  import Panel from "@/components/design/Panel.svelte"
  import { automationStore } from "@/stores/builder"
  import { licensing, auth } from "@/stores/portal"
  import { createPaginationStore } from "@/helpers/pagination"
  import { onMount, onDestroy } from "svelte"
  import dayjs from "dayjs"
  import StatusRenderer from "@/settings/pages/automations/_components/StatusRenderer.svelte"
  import { AutomationStatus } from "@budibase/types"

  export let automation
  export let onSelectLog = () => {}
  export let selectedLog = null

  const ERROR = AutomationStatus.ERROR
  const SUCCESS = AutomationStatus.SUCCESS
  const STOPPED = AutomationStatus.STOPPED
  const STOPPED_ERROR = AutomationStatus.STOPPED_ERROR
  const TIMED_OUT = AutomationStatus.TIMED_OUT

  const FAILURE_STATUSES = [ERROR, STOPPED_ERROR, TIMED_OUT]

  let pageInfo = createPaginationStore()
  let runHistory = null
  let status = null
  let statuses = null
  let timeRange = null
  let loaded = false
  let totalLogs = 0
  let showAdvancedFilters = false

  let durationGte = null
  let durationLte = null
  let hasRetry = false
  let attemptGte = null

  const AUTOMATION_LOG_PAGE_SIZE = 10

  const allTimeOptions = [
    { value: "90-d", label: "Past 90 days" },
    { value: "30-d", label: "Past 30 days" },
    { value: "1-w", label: "Past week" },
    { value: "1-d", label: "Past day" },
    { value: "1-h", label: "Past 1 hour" },
    { value: "15-m", label: "Past 15 mins" },
    { value: "5-m", label: "Past 5 mins" },
  ]

  const quickFilterOptions = [
    { value: null, label: "All runs" },
    { value: "failures", label: "Failures only" },
    { value: "success", label: "Success only" },
  ]

  let quickFilter = null

  $: automationLogRetentionDays =
    $licensing.license?.quotas?.constant?.automationLogRetentionDays?.value || 1

  $: timeOptions = allTimeOptions.filter(option => {
    if ($licensing.isFreePlan) {
      return ["1-d", "1-h", "15-m", "5-m"].includes(option.value)
    }
    if (!$licensing.isEnterprisePlan) {
      const retentionDays = automationLogRetentionDays
      if (retentionDays <= 1) {
        return ["1-d", "1-h", "15-m", "5-m"].includes(option.value)
      } else if (retentionDays <= 7) {
        return !["90-d", "30-d"].includes(option.value)
      } else if (retentionDays <= 30) {
        return option.value !== "90-d"
      }
    }
    return true
  })

  $: showUpgradeButton =
    !$licensing.isEnterprisePlan && $auth?.user?.accountPortalAccess

  const statusOptions = [
    { value: SUCCESS, label: "Success" },
    { value: ERROR, label: "Error" },
    { value: STOPPED, label: "Stopped" },
    { value: STOPPED_ERROR, label: "Stopped - Error" },
    { value: TIMED_OUT, label: "Timed out" },
  ]

  function getUrlParams() {
    const params = new URLSearchParams(window.location.search)
    return {
      status: params.get("status") || null,
      timeRange: params.get("timeRange") || null,
      quickFilter: params.get("quickFilter") || null,
      durationGte: params.get("durationGte")
        ? parseInt(params.get("durationGte"))
        : null,
      durationLte: params.get("durationLte")
        ? parseInt(params.get("durationLte"))
        : null,
      hasRetry: params.get("hasRetry") === "true",
      attemptGte: params.get("attemptGte")
        ? parseInt(params.get("attemptGte"))
        : null,
    }
  }

  function updateUrlParams() {
    const params = new URLSearchParams()
    if (status) params.set("status", status)
    if (timeRange) params.set("timeRange", timeRange)
    if (quickFilter) params.set("quickFilter", quickFilter)
    if (durationGte !== null) params.set("durationGte", durationGte.toString())
    if (durationLte !== null) params.set("durationLte", durationLte.toString())
    if (hasRetry) params.set("hasRetry", "true")
    if (attemptGte !== null) params.set("attemptGte", attemptGte.toString())

    const newUrl = `${window.location.pathname}${params.toString() ? "?" + params.toString() : ""}`
    window.history.replaceState({}, "", newUrl)
  }

  function loadFiltersFromUrl() {
    const params = getUrlParams()
    status = params.status
    timeRange = params.timeRange
    quickFilter = params.quickFilter
    durationGte = params.durationGte
    durationLte = params.durationLte
    hasRetry = params.hasRetry
    attemptGte = params.attemptGte

    applyQuickFilter()
  }

  function applyQuickFilter() {
    if (quickFilter === "failures") {
      statuses = [...FAILURE_STATUSES]
      status = null
    } else if (quickFilter === "success") {
      statuses = null
      status = SUCCESS
    } else {
      statuses = null
    }
  }

  $: if (quickFilter !== undefined) {
    applyQuickFilter()
  }

  $: pageInfo.reset(), status, timeRange, quickFilter, durationGte, durationLte, hasRetry, attemptGte
  $: page = $pageInfo.page
  $: fetchLogs(
    automation._id,
    status,
    statuses,
    page,
    timeRange,
    durationGte,
    durationLte,
    hasRetry ? 1 : null
  )
  $: if (loaded) {
    updateUrlParams()
  }

  async function fetchLogs(
    automationId,
    status,
    statuses,
    page,
    timeRange,
    durationGte,
    durationLte,
    attemptGte,
    force = false
  ) {
    if (!force && !loaded) {
      return
    }
    let startDate = null
    if (timeRange) {
      const [length, units] = timeRange.split("-")
      startDate = dayjs().subtract(length, units)
    }

    const logOptions = {
      automationId,
      page,
      startDate,
    }

    if (statuses && statuses.length > 0) {
      logOptions.statuses = statuses
    } else if (status) {
      logOptions.status = status
    }

    if (durationGte !== null && !isNaN(durationGte)) {
      logOptions.durationGte = durationGte
    }
    if (durationLte !== null && !isNaN(durationLte)) {
      logOptions.durationLte = durationLte
    }
    if (attemptGte !== null && !isNaN(attemptGte)) {
      logOptions.attemptGte = attemptGte
    }

    try {
      const response = await automationStore.actions.getLogs(logOptions)
      pageInfo.fetched(response.hasNextPage, response.nextPage)
      totalLogs = response.totalLogs
      runHistory = response.data
    } catch (error) {
      notifications.error("Error fetching automation logs")
      console.error(error)
    }
  }

  function formatDuration(ms) {
    if (ms === undefined || ms === null) return ""
    if (ms < 1000) return `${ms}ms`
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
    return `${(ms / 60000).toFixed(1)}m`
  }

  onMount(async () => {
    loadFiltersFromUrl()
    await fetchLogs(
      automation._id,
      status,
      statuses,
      0,
      timeRange,
      durationGte,
      durationLte,
      hasRetry ? 1 : null,
      true
    )
    loaded = true
  })
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="container">
  <Panel title="Logs" customWidth={400} borderLeft borderBottomHeader={false}>
    <div class="logs-panel-content">
      <div class="quick-filters">
        <Select
          placeholder="Quick filter"
          label="Quick filter"
          bind:value={quickFilter}
          options={quickFilterOptions}
        />
      </div>

      <div class="filters">
        <div class="filter-group">
          <Select
            placeholder="All statuses"
            label="Status"
            bind:value={status}
            options={statusOptions}
            disabled={quickFilter !== null}
          />
        </div>
        <div class="filter-group">
          <Select
            placeholder="All time"
            label="Date range"
            bind:value={timeRange}
            options={timeOptions}
          />
        </div>
      </div>

      <div class="advanced-filter-toggle">
        <Button
          size="S"
          secondary
          on:click={() => (showAdvancedFilters = !showAdvancedFilters)}
        >
          <Icon name={showAdvancedFilters ? "ChevronUp" : "ChevronDown"} size="S" />
          {showAdvancedFilters ? "Hide" : "Show"} advanced filters
        </Button>
      </div>

      {#if showAdvancedFilters}
        <div class="advanced-filters">
          <div class="filter-row">
            <div class="filter-group">
              <Toggle
                text="With retries only"
                value={hasRetry}
                on:change={e => {
                  hasRetry = e.detail
                  if (hasRetry) {
                    attemptGte = 1
                  } else {
                    attemptGte = null
                  }
                }}
              />
            </div>
          </div>

          <div class="filter-row">
            <div class="filter-group">
              <label class="filter-label">Duration (ms)</label>
              <div class="duration-filters">
                <TextInput
                  placeholder="Min"
                  type="number"
                  bind:value={durationGte}
                />
                <span class="separator">-</span>
                <TextInput
                  placeholder="Max"
                  type="number"
                  bind:value={durationLte}
                />
              </div>
            </div>
          </div>
        </div>
      {/if}

      <!-- Free plan message and upgrade prompt -->
      {#if $licensing.isFreePlan}
        <div class="plan-info">
          <div class="plan-message">
            <Icon name="Info" size="S" />
            <Body size="S">
              Free plan stores up to {automationLogRetentionDays} day{automationLogRetentionDays ===
              1
                ? ""
                : "s"} of automation history
            </Body>
          </div>
          {#if showUpgradeButton}
            <Button size="S" cta on:click={$licensing.goToUpgradePage}>
              Get more history
            </Button>
          {/if}
        </div>
      {/if}

      {#if runHistory}
        <div class="logs-list">
          {#if runHistory.length === 0}
            <div class="no-logs">
              <Body size="S" textAlign="center">No logs found</Body>
            </div>
          {:else}
            <div class="logs-items">
              {#each runHistory as log, idx}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div
                  class="log-item"
                  class:selected={selectedLog && selectedLog._id === log._id}
                  on:click={() => onSelectLog(log)}
                >
                  <div class="log-content">
                    <div class="log-main">
                      <div class="log-header">
                        <Body size="S" weight="600">
                          Log #{totalLogs -
                            (($pageInfo.pageNumber - 1) *
                              AUTOMATION_LOG_PAGE_SIZE +
                              idx)}
                        </Body>
                        <div class="log-status">
                          <StatusRenderer value={log.status} />
                        </div>
                      </div>
                      <div class="log-meta">
                        <Body size="XS">
                          {dayjs(log.createdAt).format("MMM DD, YYYY HH:mm:ss")}
                        </Body>
                        {#if log.durationMs !== undefined && log.durationMs !== null}
                          <Body size="XS" class="log-duration">
                            <Icon name="Clock" size="XS" />
                            {formatDuration(log.durationMs)}
                          </Body>
                        {/if}
                        {#if log.attempt !== undefined && log.attempt !== null && log.attempt > 0}
                          <Body size="XS" class="log-attempt">
                            <Icon name="Refresh" size="XS" />
                            Attempt {log.attempt}
                          </Body>
                        {/if}
                      </div>
                    </div>
                  </div>
                </div>
              {/each}
            </div>

            <div class="pagination-wrapper">
              <Pagination
                page={$pageInfo.pageNumber}
                hasPrevPage={$pageInfo.loading ? false : $pageInfo.hasPrevPage}
                hasNextPage={$pageInfo.loading ? false : $pageInfo.hasNextPage}
                goToPrevPage={pageInfo.prevPage}
                goToNextPage={pageInfo.nextPage}
              />
            </div>
          {/if}
        </div>
      {/if}
    </div>
  </Panel>
</div>

<style>
  .container {
    position: fixed;
    right: 0;
    z-index: 99;
    height: calc(100% - 60px);
    display: flex;
    flex-direction: row;
    align-items: stretch;
  }

  .logs-panel-content {
    flex: 1 1 auto;
    overflow-y: auto;
    padding: 10px 15px 10px 15px;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
  }

  .filters {
    display: flex;
    flex-direction: row;
    gap: var(--spacing-m);
  }

  .filter-group {
    flex: 1;
  }

  .plan-info {
    background: var(--spectrum-global-color-gray-75);
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: var(--border-radius-s);
    padding: var(--spacing-m);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-m);
  }

  .plan-message {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    color: var(--spectrum-global-color-gray-700);
  }

  .logs-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s) var(--spacing-s) 0 var(--spacing-s);
  }

  .logs-items {
    display: flex;
    flex-direction: column;
  }

  .no-logs {
    padding: var(--spacing-xl);
    color: var(--spectrum-global-color-gray-600);
  }

  .log-item {
    border-bottom: 1px solid var(--spectrum-global-color-gray-300);
    padding: var(--spacing-m) var(--spacing-m) var(--spacing-m) var(--spacing-m);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .log-item:hover {
    background: var(--spectrum-global-color-gray-75);
    border-color: var(--spectrum-global-color-gray-400);
  }

  .log-item.selected {
    background: var(--spectrum-global-color-gray-200);
    border-left: 3px solid var(--spectrum-global-color-blue-600);
  }

  .log-item.selected:hover {
    background: var(--spectrum-global-color-gray-300);
  }

  .log-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .log-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--spacing-l);
  }

  .log-info :global(.spectrum-Body:first-child) {
    color: var(--spectrum-global-color-gray-900);
  }

  .pagination-wrapper {
    display: flex;
    justify-content: right;
    padding: var(--spacing-m) 0;
    margin-top: var(--spacing-s);
  }

  .quick-filters {
    display: flex;
    flex-direction: row;
    gap: var(--spacing-m);
  }

  .advanced-filter-toggle {
    display: flex;
    justify-content: flex-start;
  }

  .advanced-filters {
    background: var(--spectrum-global-color-gray-75);
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: var(--border-radius-s);
    padding: var(--spacing-m);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
  }

  .filter-row {
    display: flex;
    flex-direction: row;
    gap: var(--spacing-m);
  }

  .filter-label {
    display: block;
    font-size: var(--spectrum-alias-item-text-size-s);
    color: var(--spectrum-global-color-gray-700);
    margin-bottom: var(--spacing-s);
  }

  .duration-filters {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
  }

  .separator {
    color: var(--spectrum-global-color-gray-600);
    font-size: var(--spectrum-alias-item-text-size-m);
  }

  .log-main {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    flex: 1;
  }

  .log-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-m);
  }

  .log-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--spacing-s);
    color: var(--spectrum-global-color-gray-600);
  }

  .log-duration,
  .log-attempt {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-xs);
    padding: var(--spacing-xs) var(--spacing-s);
    background: var(--spectrum-global-color-gray-200);
    border-radius: var(--border-radius-s);
    font-size: 10px;
    line-height: 1.2;
  }

  .log-attempt {
    background: var(--spectrum-global-color-orange-200);
    color: var(--spectrum-global-color-orange-900);
  }

  .log-status {
    flex-shrink: 0;
  }
</style>
