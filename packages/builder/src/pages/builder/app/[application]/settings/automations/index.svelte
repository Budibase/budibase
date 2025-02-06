<script>
  import {
    Layout,
    Table,
    Select,
    Pagination,
    Button,
    Body,
    Heading,
    Divider,
    Toggle,
    notifications,
  } from "@budibase/bbui"
  import DateTimeRenderer from "@/components/common/renderers/DateTimeRenderer.svelte"
  import StatusRenderer from "./_components/StatusRenderer.svelte"
  import HistoryDetailsPanel from "./_components/HistoryDetailsPanel.svelte"
  import { automationStore, appStore } from "@/stores/builder"
  import { createPaginationStore } from "@/helpers/pagination"
  import { getContext, onDestroy, onMount } from "svelte"
  import dayjs from "dayjs"
  import { auth, licensing, admin, appsStore } from "@/stores/portal"
  import { Constants } from "@budibase/frontend-core"
  import Portal from "svelte-portal"

  const ERROR = "error",
    SUCCESS = "success",
    STOPPED = "stopped",
    STOPPED_ERROR = "stopped_error"
  const sidePanel = getContext("side-panel")

  let pageInfo = createPaginationStore()
  let runHistory = null
  let selectedHistory = null
  let automationOptions = []
  let automationId = null
  let status = null
  let timeRange = null
  let loaded = false
  $: app = $appsStore.apps.find(app => $appStore.appId?.includes(app.appId))
  $: licensePlan = $auth.user?.license?.plan

  // Reset the page every time that a filter gets updated
  $: pageInfo.reset(), automationId, status, timeRange

  $: page = $pageInfo.page
  $: fetchLogs(automationId, status, page, timeRange)
  $: isCloud = $admin.cloud
  $: chainAutomations = app?.automations?.chainAutomations ?? !isCloud
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
    { value: STOPPED_ERROR, label: "Stopped - Error" },
  ]

  const runHistorySchema = {
    status: { displayName: "Status" },
    automationName: { displayName: "Automation" },
    createdAt: { displayName: "Time" },
  }

  const customRenderers = [
    { column: "createdAt", component: DateTimeRenderer },
    { column: "status", component: StatusRenderer },
  ]

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
    sidePanel.open()
  }

  async function save({ detail }) {
    try {
      await appsStore.save($appStore.appId, {
        automations: {
          chainAutomations: detail,
        },
      })
    } catch (error) {
      notifications.error("Error updating automation chaining setting")
    }
  }

  onMount(async () => {
    await automationStore.actions.fetch()
    const params = new URLSearchParams(window.location.search)
    const shouldOpen = params.get("open") === ERROR
    if (shouldOpen) {
      status = ERROR
    }
    automationOptions = []
    for (let automation of $automationStore.automations) {
      automationOptions.push({ value: automation._id, label: automation.name })
    }
    await fetchLogs(automationId, status, 0, timeRange, true)
    // Open the first automation info if one exists
    if (shouldOpen && runHistory?.[0]) {
      viewDetails({ detail: runHistory[0] })
    }
    loaded = true
  })

  onDestroy(() => {
    sidePanel.close()
  })
</script>

<Layout noPadding>
  <Layout gap="XS" noPadding>
    <Heading>Automations</Heading>
    <Body size="S">See your automation history and edit advanced settings</Body>
  </Layout>
  <Divider />

  <Layout gap="XS" noPadding>
    <Heading size="XS">Chain automations</Heading>
    <Body size="S">Allow automations to trigger from other automations</Body>
    <div class="setting-spacing">
      <Toggle
        text={"Enable chaining"}
        on:change={e => {
          save(e)
        }}
        value={chainAutomations}
      />
    </div>
  </Layout>

  <Divider />
  <Layout gap="XS" noPadding>
    <Heading size="XS">History</Heading>
    {#if licensePlan?.type === Constants.PlanType.FREE}
      <Body size="S">Free plan stores up to 1 day of automation history</Body>
    {/if}
  </Layout>
  <div class="controls">
    <div class="search">
      <div class="select">
        <Select
          placeholder="All"
          label="Status"
          bind:value={status}
          options={statusOptions}
        />
      </div>
      <div class="select">
        <Select
          placeholder="All"
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
    </div>

    {#if (!$licensing.isEnterprisePlan && $auth.user.accountPortalAccess) || !$admin.cloud}
      <Button secondary on:click={$licensing.goToUpgradePage()}>
        Get more history
      </Button>
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

{#if selectedHistory}
  <Portal target="#side-panel">
    <HistoryDetailsPanel
      appId={$appStore.appId}
      bind:history={selectedHistory}
      close={sidePanel.close}
    />
  </Portal>
{/if}

<style>
  .setting-spacing {
    padding-top: var(--spacing-s);
  }
  .controls {
    display: flex;
    flex-direction: row;
    gap: var(--spacing-xl);
    align-items: flex-end;
    flex-wrap: wrap;
  }
  .search {
    display: flex;
    gap: var(--spacing-xl);
    align-items: flex-start;
    flex: 1 0 auto;
    max-width: 100%;
  }
  .select {
    flex: 1 1 0;
    max-width: 150px;
    min-width: 80px;
  }
  .pagination {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin-top: var(--spacing-xl);
  }
</style>
