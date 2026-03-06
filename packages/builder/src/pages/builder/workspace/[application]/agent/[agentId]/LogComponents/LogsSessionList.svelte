<script lang="ts">
  import { Body, Pagination, Select, Table } from "@budibase/bbui"

  export interface SessionTableRow {
    sessionId: string
    trigger: string
    startTime: string
    operations: number
  }

  type TimeRange = "1h" | "8h" | "24h" | "7d" | "30d"

  type Props = {
    loading: boolean
    sessionTableData: SessionTableRow[]
    hasMore: boolean
    currentPage: number
    statusFilter?: string
    timeRange?: TimeRange
    triggerFilter?: string
    onSessionRowClick: (_row: { sessionId?: string }) => void
    onPrevPage: () => void
    onNextPage: () => void
  }

  let {
    loading,
    sessionTableData,
    hasMore,
    currentPage,
    statusFilter = $bindable("all"),
    timeRange = $bindable("7d"),
    triggerFilter = $bindable("all"),
    onSessionRowClick,
    onPrevPage,
    onNextPage,
  }: Props = $props()

  const statusOptions = [
    { label: "All statuses", value: "all" },
    { label: "Success", value: "success" },
    { label: "Error", value: "error" },
  ]

  const timeRangeOptions = [
    { label: "Last hour", value: "1h" },
    { label: "Last 8 hours", value: "8h" },
    { label: "Last 24 hours", value: "24h" },
    { label: "Last 7 days", value: "7d" },
    { label: "Last 30 days", value: "30d" },
  ]

  let triggerOptions = $derived.by(() => [
    { label: "All triggers", value: "all" },
    ...Array.from(new Set(sessionTableData.map(row => row.trigger))).map(
      trigger => ({
        label: trigger,
        value: trigger,
      })
    ),
  ])

  const sessionTableSchema = {
    trigger: { width: "0.8fr", displayName: "Trigger" },
    startTime: { width: "1fr", displayName: "Start time" },
    operations: { width: "0.4fr", displayName: "Operations" },
  }
</script>

<div class="filters-bar">
  <div class="filter-group">
    <Select
      quiet
      options={statusOptions}
      bind:value={statusFilter}
      placeholder="All statuses"
    />
  </div>
  <div class="filter-group">
    <Select
      quiet
      options={timeRangeOptions}
      bind:value={timeRange}
      placeholder="Last 7 days"
    />
  </div>
  <div class="filter-group">
    <Select
      quiet
      options={triggerOptions}
      bind:value={triggerFilter}
      placeholder="All triggers"
    />
  </div>
</div>

<div class="table-wrapper">
  {#if loading && !sessionTableData.length}
    <div class="empty-state">
      <Body size="S" color="var(--spectrum-global-color-gray-600)">
        Loading logs...
      </Body>
    </div>
  {:else if !sessionTableData.length}
    <div class="empty-state">
      <Body size="S" color="var(--spectrum-global-color-gray-600)">
        No logs found for this time period
      </Body>
    </div>
  {:else}
    <div class="table-host">
      <Table
        schema={sessionTableSchema}
        data={sessionTableData}
        allowEditColumns={false}
        allowEditRows={false}
        allowSelectRows={false}
        on:click={({ detail }) => onSessionRowClick(detail)}
      />
    </div>
  {/if}

  {#if hasMore || currentPage > 0}
    <div class="pagination">
      <Pagination
        page={currentPage + 1}
        hasPrevPage={currentPage > 0}
        hasNextPage={hasMore}
        goToPrevPage={onPrevPage}
        goToNextPage={onNextPage}
      />
    </div>
  {/if}
</div>

<style>
  .filters-bar {
    display: flex;
    gap: var(--spacing-m);
    padding: var(--spacing-xl) var(--spacing-l) var(--spacing-m);
  }

  .filter-group {
    min-width: 100px;
  }

  .filter-group :global(.spectrum-Picker) {
    background: var(--spectrum-global-color-gray-100) !important;
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 6px;
  }

  .table-wrapper {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    min-height: 0;
    overflow: hidden;
    padding: 0 var(--spacing-l) var(--spacing-l);
  }

  .table-host {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    scrollbar-width: thin;
  }

  .table-host::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  .table-host::-webkit-scrollbar-track {
    background: transparent;
  }

  .table-host::-webkit-scrollbar-thumb {
    background: var(--spectrum-global-color-gray-300);
    border-radius: 3px;
  }

  .empty-state {
    padding: 40px 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-s) 0;
    border-top: 1px solid var(--spectrum-global-color-gray-200);
    flex-shrink: 0;
  }
</style>
