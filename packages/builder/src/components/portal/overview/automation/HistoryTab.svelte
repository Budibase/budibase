<script>
  import { Layout, Table, Select, Pagination, Link } from "@budibase/bbui"
  import DateTimeRenderer from "components/common/renderers/DateTimeRenderer.svelte"
  import StatusRenderer from "./StatusRenderer.svelte"
  import HistoryDetailsPanel from "./HistoryDetailsPanel.svelte"
  import { automationStore } from "builderStore"
  import { createPaginationStore } from "helpers/pagination"
  import { onMount } from "svelte"
  import dayjs from "dayjs"
  import { auth, admin } from "stores/portal"

  const ERROR = "error",
    SUCCESS = "success",
    STOPPED = "stopped"
  export let app

  $: licensePlan = $auth.user?.license?.plan
  $: console.log($auth.user?.license)
  $: upgradeUrl = `${$admin.accountPortalUrl}/portal/upgrade`

  let pageInfo = createPaginationStore()
  let runHistory = null
  let showPanel = false
  let selectedHistory = null
  let automationOptions = []
  let automationId = null
  let status = null
  let timeRange = null

  $: page = $pageInfo.page
  $: fetchLogs(automationId, status, page, timeRange)

  const timeOptions = [
    { value: "1-w", label: "Past week" },
    { value: "1-d", label: "Past day" },
    { value: "1-h", label: "Past 1 hour" },
    { value: "15-m", label: "Past 15 mins" },
    { value: "5-m", label: "Past 5 mins" },
  ]

  $: allowedTimeOptions = timeOptions.filter(option => {
    option.value === "1-d" && licensePlan.type === "free"
  })
  $: console.log(allowedTimeOptions)

  $: parsedOptions = timeOptions.reduce((acc, ele) => {
    if (ele.value !== "1-d" && licensePlan.type === "free") {
      ele = { ...ele, disabled: true }
    }
    acc.push(ele)
    return acc
  }, [])
  $: console.log(parsedOptions)

  const statusOptions = [
    { value: SUCCESS, label: "Success" },
    { value: ERROR, label: "Error" },
    { value: STOPPED, label: "Stopped" },
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

  async function fetchLogs(automationId, status, page, timeRange) {
    let startDate = null
    if (timeRange) {
      const [length, units] = timeRange.split("-")
      startDate = dayjs().subtract(length, units)
    }
    const response = await automationStore.actions.getLogs({
      automationId,
      status,
      page,
      startDate,
    })
    pageInfo.fetched(response.hasNextPage, response.nextPage)
    runHistory = enrichHistory($automationStore.blockDefinitions, response.data)
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
      {#if licensePlan.type === "free"}
        <div>
          Upgrade your budibase installation to unlock additional features.
          <Link size="L" href={upgradeUrl}>Pro</Link>
        </div>
      {/if}
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
          placeholder={allowedTimeOptions[0]?.label}
          label="Date range"
          bind:value={timeRange}
          options={parsedOptions}
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
    page={$pageInfo.pageNumber}
    hasPrevPage={$pageInfo.loading ? false : $pageInfo.hasPrevPage}
    hasNextPage={$pageInfo.loading ? false : $pageInfo.hasNextPage}
    goToPrevPage={pageInfo.prevPage}
    goToNextPage={pageInfo.nextPage}
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
