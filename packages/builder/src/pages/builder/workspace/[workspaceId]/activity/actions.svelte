<script lang="ts">
  import { API } from "@/api"
  import { Body, Button, Select, Table } from "@budibase/bbui"
  import {
    PLATFORM_ACTION_CONTAINER_STATUSES,
    type ActionSession,
    type ActionSessionsSummary,
    type PlatformActionContainerStatus,
    type PlatformActionEnvironment,
  } from "@budibase/types"
  import { onMount } from "svelte"
  import ActivityFilters from "./ActivityFilters.svelte"
  import ActivityPage from "./ActivityPage.svelte"
  import ActivityStatusRenderer from "./ActivityStatusRenderer.svelte"
  import ActivitySummaryCards, {
    type SummaryMetric,
  } from "./ActivitySummaryCards.svelte"
  import ActivityTablePanel from "./ActivityTablePanel.svelte"
  import ActivityTypeRenderer from "./ActivityTypeRenderer.svelte"
  import { toActionSessionRow } from "./actionSessionRows"
  import { ACTIVITY_STATUS_LABELS } from "./activityStatus"

  const PAGE_SIZE = 20
  const RELATIVE_TIME_REFRESH_MS = 30000

  const tableSchema = {
    typeLabel: { type: "string", displayName: "Type", width: "180px" },
    assetLabel: {
      type: "string",
      displayName: "Asset",
      width: "minmax(200px, 1.5fr)",
    },
    triggeredByLabel: {
      type: "string",
      displayName: "Triggered by",
      width: "minmax(160px, 1fr)",
    },
    statusLabel: { type: "string", displayName: "Status", width: "150px" },
    actionCount: { type: "number", displayName: "Actions", width: "100px" },
    updatedLabel: { type: "string", displayName: "Updated", width: "130px" },
  }
  const customRenderers = [
    { column: "typeLabel", component: ActivityTypeRenderer },
    { column: "statusLabel", component: ActivityStatusRenderer },
  ]

  type StatusFilter = PlatformActionContainerStatus | "all"
  type EnvironmentFilter = PlatformActionEnvironment | "all"

  const statusFilterOptions: { label: string; value: StatusFilter }[] = [
    { label: "All statuses", value: "all" },
    ...PLATFORM_ACTION_CONTAINER_STATUSES.map(status => ({
      label: ACTIVITY_STATUS_LABELS[status],
      value: status,
    })),
  ]
  const environmentFilterOptions: {
    label: string
    value: EnvironmentFilter
  }[] = [
    { label: "All environments", value: "all" },
    { label: "Production", value: "prod" },
    { label: "Development", value: "dev" },
  ]

  let loading = $state(true)
  let loadFailed = $state(false)
  let sessions = $state<ActionSession[]>([])
  let summary = $state<ActionSessionsSummary | null>(null)
  let statusFilter = $state<StatusFilter>("all")
  let environmentFilter = $state<EnvironmentFilter>("all")
  // Ticks on an interval purely to force updatedLabel to re-derive
  let now = $state(Date.now())

  let rows = $derived(
    sessions.map(session => toActionSessionRow({ session, now }))
  )

  let summaryMetrics = $derived.by<SummaryMetric[]>(() => {
    const counts = summary || {
      total: 0,
      active: 0,
      waiting: 0,
      completed: 0,
      failed: 0,
    }
    return [
      { label: "All actions", value: counts.total },
      { label: ACTIVITY_STATUS_LABELS.completed, value: counts.completed },
      { label: ACTIVITY_STATUS_LABELS.active, value: counts.active },
      { label: ACTIVITY_STATUS_LABELS.waiting, value: counts.waiting },
      { label: ACTIVITY_STATUS_LABELS.failed, value: counts.failed },
    ]
  })

  let placeholderText = $derived(
    statusFilter === "all"
      ? "No actions tracked yet."
      : "No actions match the selected filters."
  )

  const loadSessions = (() => {
    let requestSequence = 0

    return async function loadSessions() {
      const sequence = ++requestSequence
      loading = true
      loadFailed = false
      try {
        const response = await API.fetchActionSessions({
          env: environmentFilter === "all" ? undefined : environmentFilter,
          status: statusFilter === "all" ? undefined : statusFilter,
          limit: PAGE_SIZE,
        })
        if (sequence !== requestSequence) {
          return
        }
        sessions = response.sessions
        summary = response.summary
      } catch (error) {
        if (sequence !== requestSequence) {
          return
        }
        console.error("Failed to fetch action sessions", error)
        sessions = []
        summary = null
        loadFailed = true
      } finally {
        if (sequence === requestSequence) {
          loading = false
        }
      }
    }
  })()

  function changeStatusFilter(nextFilter: StatusFilter) {
    if (nextFilter === statusFilter) {
      return
    }
    statusFilter = nextFilter
    loadSessions()
  }

  function changeEnvironmentFilter(nextFilter: EnvironmentFilter) {
    if (nextFilter === environmentFilter) {
      return
    }
    environmentFilter = nextFilter
    loadSessions()
  }

  onMount(() => {
    loadSessions()
  })

  $effect(() => {
    const interval = setInterval(() => {
      now = Date.now()
    }, RELATIVE_TIME_REFRESH_MS)
    return () => clearInterval(interval)
  })
</script>

<ActivityPage>
  <ActivitySummaryCards metrics={summaryMetrics} />

  <ActivityFilters>
    <Select
      size="M"
      autoWidth
      placeholder={false}
      options={statusFilterOptions}
      value={statusFilter}
      on:change={({ detail }) => changeStatusFilter(detail)}
    />
    <Select
      size="M"
      autoWidth
      placeholder={false}
      options={environmentFilterOptions}
      value={environmentFilter}
      on:change={({ detail }) => changeEnvironmentFilter(detail)}
    />
  </ActivityFilters>

  {#if loadFailed}
    <div class="load-error" role="alert">
      <Body size="S">Failed to load actions.</Body>
      <Button secondary size="S" on:click={loadSessions}>Try again</Button>
    </div>
  {:else}
    <ActivityTablePanel>
      <Table
        quiet
        compact
        {loading}
        disableSorting
        allowClickRows={false}
        allowEditRows={false}
        allowEditColumns={false}
        allowSelectRows={false}
        data={rows}
        schema={tableSchema}
        {customRenderers}
        {placeholderText}
      />
    </ActivityTablePanel>
  {/if}
</ActivityPage>

<style>
  .load-error {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-m);
    padding: var(--spacing-l);
    border-radius: var(--border-radius-s);
    background: var(--spectrum-global-color-gray-100);
  }
</style>
