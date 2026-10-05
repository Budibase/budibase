<script lang="ts">
  import { API } from "@/api"
  import { Select, Table } from "@budibase/bbui"
  import {
    PLATFORM_ACTION_CONTAINER_STATUSES,
    type ActionSession,
    type ActionSessionsSummary,
    type ActionsPagination,
    type PlatformActionContainerStatus,
    type PlatformActionEnvironment,
  } from "@budibase/types"
  import { onMount } from "svelte"
  import ActionSessionPanel from "./ActionSessionPanel.svelte"
  import ActivityFilters from "./ActivityFilters.svelte"
  import ActivityLoadError from "./ActivityLoadError.svelte"
  import ActivityPage from "./ActivityPage.svelte"
  import ActivityStatusRenderer from "./ActivityStatusRenderer.svelte"
  import ActivitySummaryCards, {
    type SummaryMetric,
  } from "./ActivitySummaryCards.svelte"
  import ActivityTableFooter from "./ActivityTableFooter.svelte"
  import ActivityTablePanel from "./ActivityTablePanel.svelte"
  import ActivityTypeRenderer from "./ActivityTypeRenderer.svelte"
  import {
    ENVIRONMENT_LABELS,
    getActionSessionRowId,
    toActionSessionRow,
    type ActionSessionRow,
  } from "./actionSessionRows"
  import { ACTIVITY_STATUS_LABELS } from "./activityStatus"
  import { getPaginationLabel, PAGE_SIZE } from "./pagination"

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
  interface PageRequest {
    page: number
    bookmark?: string
  }
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
    { label: ENVIRONMENT_LABELS.prod, value: "prod" },
    { label: ENVIRONMENT_LABELS.dev, value: "dev" },
  ]

  let loading = $state(true)
  let loadFailed = $state(false)
  let sessions = $state<ActionSession[]>([])
  let summary = $state<ActionSessionsSummary | null>(null)
  let pagination = $state<ActionsPagination | null>(null)
  let currentPage = $state(1)
  let lastRequest: PageRequest = { page: 1 }
  let selectedSessionId = $state<string | null>(null)
  let statusFilter = $state<StatusFilter>("all")
  let environmentFilter = $state<EnvironmentFilter>("all")
  // Ticks on an interval purely to force updatedLabel to re-derive
  let now = $state(Date.now())

  let rows = $derived(
    sessions.map(session => toActionSessionRow({ session, now }))
  )

  let selectedSession = $derived(
    sessions.find(
      session => getActionSessionRowId(session) === selectedSessionId
    )
  )

  let summaryMetrics = $derived.by<SummaryMetric[]>(() => {
    return [
      { label: "All actions", value: summary?.total ?? null },
      {
        label: ACTIVITY_STATUS_LABELS.completed,
        value: summary?.completed ?? null,
      },
      { label: ACTIVITY_STATUS_LABELS.active, value: summary?.active ?? null },
      {
        label: ACTIVITY_STATUS_LABELS.waiting,
        value: summary?.waiting ?? null,
      },
      { label: ACTIVITY_STATUS_LABELS.failed, value: summary?.failed ?? null },
    ]
  })

  let filteredTotal = $derived.by(() => {
    if (!summary) {
      return 0
    }
    return statusFilter === "all" ? summary.total : summary[statusFilter]
  })

  let hasPrevPage = $derived(
    !!pagination?.hasPreviousPage && !!pagination.previousBookmark
  )
  let hasNextPage = $derived(
    !!pagination?.hasNextPage && !!pagination.nextBookmark
  )

  let paginationLabel = $derived(
    getPaginationLabel({
      page: currentPage,
      pageSize: PAGE_SIZE,
      rowCount: rows.length,
      total: filteredTotal,
    })
  )

  let placeholderText = $derived(
    statusFilter === "all" && environmentFilter === "all"
      ? "No actions tracked yet."
      : "No actions match the selected filters."
  )

  const loadSessions = (() => {
    let requestSequence = 0

    return async function loadSessions(request: PageRequest = { page: 1 }) {
      const sequence = ++requestSequence
      lastRequest = request
      selectedSessionId = null
      loading = true
      loadFailed = false
      try {
        const response = await API.fetchActionSessions({
          env: environmentFilter === "all" ? undefined : environmentFilter,
          status: statusFilter === "all" ? undefined : statusFilter,
          limit: PAGE_SIZE,
          bookmark: request.bookmark,
        })
        if (sequence !== requestSequence) {
          return
        }
        sessions = response.sessions
        summary = response.summary
        pagination = response.pagination
        currentPage = request.page
      } catch (error) {
        if (sequence !== requestSequence) {
          return
        }
        console.error("Failed to fetch action sessions", error)
        sessions = []
        summary = null
        pagination = null
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

  function goToPrevPage() {
    if (loading || !hasPrevPage) {
      return
    }
    loadSessions({
      page: Math.max(1, currentPage - 1),
      bookmark: pagination?.previousBookmark,
    })
  }

  function goToNextPage() {
    if (loading || !hasNextPage) {
      return
    }
    loadSessions({
      page: currentPage + 1,
      bookmark: pagination?.nextBookmark,
    })
  }

  function selectSession(row: ActionSessionRow) {
    selectedSessionId = row._id
  }

  function closeSessionPanel() {
    selectedSessionId = null
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
    <ActivityLoadError
      message="Failed to load actions."
      onRetry={() => loadSessions(lastRequest)}
    />
  {:else}
    <ActivityTablePanel>
      <Table
        quiet
        compact
        {loading}
        disableSorting
        allowClickRows
        allowEditRows={false}
        allowEditColumns={false}
        allowSelectRows={false}
        data={rows}
        schema={tableSchema}
        {customRenderers}
        {placeholderText}
        on:click={({ detail }) => selectSession(detail)}
      />

      {#if rows.length > 0}
        <ActivityTableFooter
          label={paginationLabel}
          page={currentPage}
          {hasPrevPage}
          {hasNextPage}
          onPrevPage={goToPrevPage}
          onNextPage={goToNextPage}
        />
      {/if}
    </ActivityTablePanel>
  {/if}

  <ActionSessionPanel session={selectedSession} onClose={closeSessionPanel} />
</ActivityPage>
