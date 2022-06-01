<script>
  import { Layout, Table, Select, Pagination } from "@budibase/bbui"
  import DateTimeRenderer from "components/common/renderers/DateTimeRenderer.svelte"
  import StatusRenderer from "./StatusRenderer.svelte"
  import HistoryDetailsPanel from "./HistoryDetailsPanel.svelte"
  import { automationStore } from "builderStore"
  import { onMount } from "svelte"

  export let appId

  let runHistory = []
  let showPanel = false
  let selectedHistory = null
  let automationOptions = []
  let automationId = null
  let status = null
  let prevPage,
    nextPage,
    page,
    hasNextPage,
    pageNumber = 1

  $: fetchLogs(automationId, status, page)

  const statusOptions = [
    { value: "success", label: "Success" },
    { value: "error", label: "Error" },
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
    await automationStore.actions.fetch()
    await fetchLogs()
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
        <Select placeholder="Past 30 days" label="Date range" />
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
      />
    {/if}
  </Layout>
  <div class="panel" class:panelShow={showPanel}>
    <HistoryDetailsPanel
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

  .panelOpen {
    grid-template-columns: auto 420px;
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
    position: absolute;
    right: 0;
    height: 100%;
    width: 420px;
    overflow: hidden;
    background-color: var(--background);
  }

  .panelShow {
    display: block;
  }
</style>
