<script>
  import {
    Body,
    Select,
    notifications,
    Pagination,
    Button,
    Icon,
  } from "@budibase/bbui"
  import Panel from "@/components/design/Panel.svelte"
  import { automationStore } from "@/stores/builder"
  import { licensing, auth } from "@/stores/portal"
  import { createPaginationStore } from "@/helpers/pagination"
  import { onMount } from "svelte"
  import dayjs from "dayjs"
  import StatusRenderer from "@/pages/builder/workspace/[application]/settings/automations/_components/StatusRenderer.svelte"

  export let automation
  export let onSelectLog = () => {}
  export let selectedLog = null

  const ERROR = "error",
    SUCCESS = "success",
    STOPPED = "stopped",
    STOPPED_ERROR = "stopped_error"

  let pageInfo = createPaginationStore()
  let runHistory = null
  let status = null
  let timeRange = null
  let loaded = false

  const allTimeOptions = [
    { value: "90-d", label: "Past 90 days" },
    { value: "30-d", label: "Past 30 days" },
    { value: "1-w", label: "Past week" },
    { value: "1-d", label: "Past day" },
    { value: "1-h", label: "Past 1 hour" },
    { value: "15-m", label: "Past 15 mins" },
    { value: "5-m", label: "Past 5 mins" },
  ]

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
    // Enterprise plan: allow all options
    return true
  })

  $: showUpgradeButton =
    !$licensing.isEnterprisePlan && $auth?.user?.accountPortalAccess

  const statusOptions = [
    { value: SUCCESS, label: "Success" },
    { value: ERROR, label: "Error" },
    { value: STOPPED, label: "Stopped" },
    { value: STOPPED_ERROR, label: "Stopped - Error" },
  ]

  // Reset the page every time that a filter gets updated
  $: pageInfo.reset(), status, timeRange
  $: page = $pageInfo.page
  $: fetchLogs(automation._id, status, page, timeRange)

  async function fetchLogs(
    automationId,
    status,
    page,
    timeRange,
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
    try {
      const response = await automationStore.actions.getLogs({
        automationId,
        status,
        page,
        startDate,
      })
      pageInfo.fetched(response.hasNextPage, response.nextPage)
      runHistory = response.data
    } catch (error) {
      notifications.error("Error fetching automation logs")
      console.error(error)
    }
  }

  onMount(async () => {
    await fetchLogs(automation._id, status, 0, timeRange, true)
    loaded = true
  })
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="container">
  <Panel title="Logs" customWidth={400} borderLeft borderBottomHeader={false}>
    <div class="logs-panel-content">
      <div class="filters">
        <div class="filter-group">
          <Select
            placeholder="All"
            label="Status"
            bind:value={status}
            options={statusOptions}
          />
        </div>
        <div class="filter-group">
          <Select
            placeholder="All"
            label="Date range"
            bind:value={timeRange}
            options={timeOptions}
          />
        </div>
      </div>

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
                    <div class="log-info">
                      <Body size="S" weight="600"
                        >Log #{runHistory.length - idx}</Body
                      >
                      <Body size="S">
                        {dayjs(log.createdAt).format("MMM DD, YYYY HH:mm")}
                      </Body>
                    </div>
                    <div class="log-status">
                      <StatusRenderer value={log.status} />
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
</style>
