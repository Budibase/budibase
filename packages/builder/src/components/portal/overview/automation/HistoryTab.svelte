<script>
  import { Layout, Table, Select, Pagination, Button } from "@budibase/bbui"
  import DateTimeRenderer from "components/common/renderers/DateTimeRenderer.svelte"
  import StatusRenderer from "./StatusRenderer.svelte"
  import HistoryDetailsPanel from "./HistoryDetailsPanel.svelte"
  import { automationStore } from "builderStore"
  import { createPaginationStore } from "helpers/pagination"
  import { onMount } from "svelte"
  import dayjs from "dayjs"
  import { auth, licensing, admin } from "stores/portal"
  import { Constants } from "@budibase/frontend-core"

  const ERROR = "error",
    SUCCESS = "success",
    STOPPED = "stopped"
  export let app

  $: licensePlan = $auth.user?.license?.plan

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
    { value: "90-d", label: "Past 90 days" },
    { value: "30-d", label: "Past 30 days" },
    { value: "1-w", label: "Past week" },
    { value: "1-d", label: "Past day" },
    { value: "1-h", label: "Past 1 hour" },
    { value: "15-m", label: "Past 15 mins" },
    { value: "5-m", label: "Past 5 mins" },
  ]

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
  <Layout noPadding gap="M" alignContent="start">
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
          placeholder="All"
          label="Date range"
          bind:value={timeRange}
          options={timeOptions}
          isOptionEnabled={x => {
            if (licensePlan?.type === Constants.PlanType.FREE) {
              return ["1-w", "30-d", "90-d"].indexOf(x.value) < 0
            } else if (licensePlan?.type === Constants.PlanType.TEAM) {
              return ["90-d"].indexOf(x.value) < 0
            } else if (licensePlan?.type === Constants.PlanType.PRO) {
              return ["30-d", "90-d"].indexOf(x.value) < 0
            }
            return true
          }}
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
      {#if (licensePlan?.type !== Constants.PlanType.ENTERPRISE && $auth.user.accountPortalAccess) || !$admin.cloud}
        <div class="pro-upgrade">
          <div class="pro-copy">Expand your automation log history</div>
          <Button primary newStyles on:click={$licensing.goToUpgradePage()}>
            Upgrade
          </Button>
        </div>
      {/if}
    </div>
    {#if runHistory}
      <div>
        <Table
          on:click={viewDetails}
          schema={runHistorySchema}
          allowSelectRows={false}
          allowEditColumns={false}
          allowEditRows={false}
          data={runHistory}
          {customRenderers}
          placeholderText="No history found"
          border={false}
        />
        <div class="pagination">
          <Pagination
            page={$pageInfo.pageNumber}
            hasPrevPage={$pageInfo.loading ? false : $pageInfo.hasPrevPage}
            hasNextPage={$pageInfo.loading ? false : $pageInfo.hasNextPage}
            goToPrevPage={pageInfo.prevPage}
            goToNextPage={pageInfo.nextPage}
          />
        </div>
      </div>
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

<style>
  .root {
    display: grid;
    grid-template-columns: 1fr;
    height: 100%;
    padding: var(--spectrum-alias-grid-gutter-medium)
      var(--spectrum-alias-grid-gutter-large);
  }

  .search {
    display: flex;
    gap: var(--spacing-xl);
    width: 100%;
    align-items: flex-end;
  }

  .select {
    flex-basis: 150px;
  }

  .pagination {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin-top: var(--spacing-xl);
  }

  .panel {
    display: none;
    margin-top: calc(-1 * var(--spectrum-alias-grid-gutter-medium));
  }

  .panelShow {
    display: block;
  }

  .panelOpen {
    grid-template-columns: auto 420px;
  }

  .pro-upgrade {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex: 1;
  }

  .pro-copy {
    margin-right: var(--spacing-l);
  }
</style>
