<script>
  import { Layout, Table, Select, Pagination } from "@budibase/bbui"
  import DateTimeRenderer from "components/common/renderers/DateTimeRenderer.svelte"
  import StatusRenderer from "./StatusRenderer.svelte"
  import HistoryDetailsPanel from "./HistoryDetailsPanel.svelte"
  import { automationStore } from "builderStore"
  import { onMount } from "svelte"

  const ERROR = "error",
    SUCCESS = "success"
  export let app

  let runHistory = null
  let showPanel = false
  let selectedHistory = null
  let automationOptions = []
  let automationId = null
  let status = null
  let timeRange = null
  let prevPage,
    nextPage,
    page,
    hasNextPage,
    pageNumber = 1

  $: fetchLogs(automationId, status, page)

  const timeOptions = [
    { value: "1w", label: "Past week" },
    { value: "1d", label: "Past day" },
    { value: "1h", label: "Past 1 hour" },
    { value: "15m", label: "Past 15 mins" },
    { value: "5m", label: "Past 5 mins" },
  ]

  const statusOptions = [
    { value: SUCCESS, label: "Success" },
    { value: ERROR, label: "Error" },
  ]

  const runHistorySchema = {
    status: { displayName: "Status" },
    createdAt: { displayName: "Time" },
    automationName: { displayName: "Automation" },
  }

  const customRenderers = [
    { column: "createdAt", component: DateTimeRenderer },
    { column: "status", component: StatusRenderer },
  ]

  async function fetchLogs(automationId, status, page) {
    const response = await automationStore.actions.getLogs({
      automationId,
      status,
      page,
    })
    nextPage = response.nextPage
    hasNextPage = response.hasNextPage
    runHistory = enrichHistory($automationStore.blockDefinitions, response.data)
  }

  function goToNextPage() {
    pageNumber++
    prevPage = page
    page = nextPage
  }

  function goToPrevPage() {
    pageNumber--
    nextPage = page
    page = prevPage
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

  function viewDetails({ detail }) {
    selectedHistory = detail
    showPanel = true
  }

  onMount(async () => {
    const params = new URLSearchParams(window.location.search)
    const shouldOpen = params.get("open") === ERROR
    // open with errors, open panel for latest
    if (shouldOpen) {
      status = ERROR
    }
    await automationStore.actions.fetch()
    await fetchLogs(null, status)
    if (shouldOpen) {
      viewDetails({ detail: runHistory[0] })
    }
    automationOptions = []
    for (let automation of $automationStore.automations) {
      automationOptions.push({ value: automation._id, label: automation.name })
    }
  })
</script>

<div class="root" class:panelOpen={showPanel}>
  <Layout paddingX="XL" gap="S" alignContent="start">
    <div class="search">
      <div class="select">
        <Select
          placeholder="All automations"
          label="Automation"
          bind:value={automationId}
          options={automationOptions}
        />
      </div>
      <div class="select">
        <Select
          placeholder="Past 30 days"
          label="Date range"
          bind:value={timeRange}
          options={timeOptions}
        />
      </div>
      <div class="select">
        <Select
          placeholder="All status"
          label="Status"
          bind:value={status}
          options={statusOptions}
        />
      </div>
    </div>
    {#if runHistory}
      <Table
        on:click={viewDetails}
        schema={runHistorySchema}
        allowSelectRows={false}
        allowEditColumns={false}
        allowEditRows={false}
        data={runHistory}
        {customRenderers}
        placeholderText="No history found"
      />
    {/if}
  </Layout>
  <div class="panel" class:panelShow={showPanel}>
    <HistoryDetailsPanel
      appId={app.devId}
      bind:history={selectedHistory}
      close={() => {
        showPanel = false
      }}
    />
  </div>
</div>
<div class="pagination">
  <Pagination
    page={pageNumber}
    hasPrevPage={pageNumber > 1}
    {hasNextPage}
    {goToPrevPage}
    {goToNextPage}
  />
</div>

<style>
  .root {
    display: grid;
    grid-template-columns: 1fr;
    height: 100%;
  }

  .search {
    display: flex;
    gap: var(--spacing-l);
    width: 100%;
    align-items: flex-end;
  }

  .select {
    flex-basis: 150px;
  }

  .pagination {
    position: absolute;
    bottom: 0;
    margin-bottom: var(--spacing-xl);
    margin-left: var(--spacing-l);
  }

  .panel {
    display: none;
    background-color: var(--background);
  }

  .panelShow {
    display: block;
  }

  .panelOpen {
    grid-template-columns: auto 420px;
  }
</style>
