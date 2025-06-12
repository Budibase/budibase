<script>
  import { Body, Select, notifications, Pagination } from "@budibase/bbui"
  import Panel from "@/components/design/Panel.svelte"
  import { automationStore } from "@/stores/builder"
  import { createPaginationStore } from "@/helpers/pagination"
  import { onMount } from "svelte"
  import { fly } from "svelte/transition"
  import dayjs from "dayjs"
  import StatusRenderer from "@/pages/builder/app/[application]/settings/automations/_components/StatusRenderer.svelte"

  export let automation
  export let onClose = () => {}
  export let onSelectLog = () => {}

  const ERROR = "error",
    SUCCESS = "success",
    STOPPED = "stopped",
    STOPPED_ERROR = "stopped_error"

  let pageInfo = createPaginationStore()
  let runHistory = null
  let status = null
  let timeRange = null
  let loaded = false
  const timeOptions = [
    { value: "1-d", label: "Past day" },
    { value: "1-h", label: "Past 1 hour" },
    { value: "15-m", label: "Past 15 mins" },
    { value: "5-m", label: "Past 5 mins" },
  ]

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
      runHistory = enrichHistory(
        $automationStore.blockDefinitions,
        response.data
      )
    } catch (error) {
      notifications.error("Error fetching automation logs")
      console.error(error)
    }
  }

  function enrichHistory(definitions, runHistory) {
    if (!definitions) {
      return []
    }
    const finalHistory = []
    for (let history of runHistory) {
      if (!history.steps) {
        continue
      }
      let notFound = false
      for (let step of history.steps) {
        const trigger = definitions.TRIGGER[step.stepId],
          action = definitions.ACTION[step.stepId]
        if (!trigger && !action) {
          notFound = true
          break
        }
        step.icon = trigger ? trigger.icon : action.icon
        step.name = trigger ? trigger.name : action.name
      }
      if (!notFound) {
        finalHistory.push(history)
      }
    }
    return finalHistory
  }

  function selectLog(log) {
    onSelectLog(log)
  }

  function _goToPrevPage() {
    if ($pageInfo.page > 0) {
      pageInfo.prevPage()
    }
  }

  function _goToNextPage() {
    if ($pageInfo.hasNextPage) {
      pageInfo.nextPage()
    }
  }

  onMount(async () => {
    await fetchLogs(automation._id, status, 0, timeRange, true)
    loaded = true
  })
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="container" transition:fly|local={{ x: 260, duration: 300 }}>
  <Panel
    title="Logs"
    showCloseButton
    onClickCloseButton={onClose}
    customWidth={400}
    borderLeft
  >
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
                <div class="log-item" on:click={() => selectLog(log)}>
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

  .logs-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }

  .logs-items {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }

  .no-logs {
    padding: var(--spacing-xl);
    color: var(--spectrum-global-color-gray-600);
  }

  .log-item {
    border-bottom: 1px solid var(--spectrum-global-color-gray-300);
    padding: var(--spacing-m);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .log-item:last-child {
    border-bottom: none;
  }

  .log-item:hover {
    background: var(--spectrum-global-color-gray-75);
    border-color: var(--spectrum-global-color-gray-400);
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

  .log-info :global(.spectrum-Body:last-child) {
    color: var(--spectrum-global-color-gray-600);
  }

  .pagination-wrapper {
    display: flex;
    justify-content: center;
    padding: var(--spacing-m) 0;
    border-top: 1px solid var(--spectrum-global-color-gray-300);
    margin-top: var(--spacing-s);
  }
</style>
