<script lang="ts">
  import type { AgentLogEnvironment } from "@budibase/types"
  import { Body, Button, Select, Table } from "@budibase/bbui"
  import DateRangePicker from "@/components/common/DateRangePicker.svelte"
  import type { Dayjs } from "dayjs"

  export interface SessionTableRow {
    sessionId: string
    environment: AgentLogEnvironment
    environmentLabel: string
    trigger: string
    startTime: string
    operations: number
  }

  type Props = {
    loading: boolean
    sessionTableData: SessionTableRow[]
    hasMore: boolean
    statusFilter?: string
    dateRange?: [Dayjs | null, Dayjs | null]
    triggerFilter?: string
    onSessionRowClick: (_row: { sessionId?: string }) => void
    onLoadMore: () => void | Promise<void>
  }

  let {
    loading,
    sessionTableData,
    hasMore,
    statusFilter = $bindable("all"),
    dateRange = $bindable([null, null]),
    triggerFilter = $bindable("all"),
    onSessionRowClick,
    onLoadMore,
  }: Props = $props()

  const statusOptions = [
    { label: "All statuses", value: "all" },
    { label: "Success", value: "success" },
    { label: "Error", value: "error" },
  ]

  const triggerOptions = [
    { label: "All triggers", value: "all" },
    ...[
      "Automation",
      "Chat",
      "Chat Preview",
      "Discord",
      "Microsoft Teams",
      "Slack",
    ].map(trigger => ({
      label: trigger,
      value: trigger,
    })),
  ]

  const sessionTableSchema = {
    trigger: { width: "0.8fr", displayName: "Trigger" },
    environmentLabel: { width: "0.55fr", displayName: "Environment" },
    startTime: { width: "1fr", displayName: "Start time" },
    // TODO: Rename this key when the underlying API contract changes from operations to actions. This UI change keeps the existing data shape.
    operations: { width: "0.4fr", displayName: "Actions" },
  }
</script>

<div class="filters-bar">
  <div class="filter-group">
    <div class="filter-label">Status</div>
    <Select options={statusOptions} bind:value={statusFilter} />
  </div>
  <div class="filter-group">
    <div class="filter-label">Trigger</div>
    <Select options={triggerOptions} bind:value={triggerFilter} />
  </div>

  <div class="filter-group date-range-group">
    <DateRangePicker
      value={dateRange}
      on:change={e => (dateRange = e.detail)}
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
      <div class="empty-state-content">
        <Body size="S" color="var(--spectrum-global-color-gray-600)">
          No logs found for this time period
        </Body>
        <Body size="XS" color="var(--spectrum-global-color-gray-500)">
          Only sessions indexed after this deployment are shown.
        </Body>
      </div>
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

  {#if hasMore}
    <div class="pagination">
      <Button secondary disabled={loading} on:click={onLoadMore}
        >Load more</Button
      >
    </div>
  {/if}
</div>

<style>
  .filters-bar {
    display: flex;
    flex-direction: row;
    gap: var(--spacing-m);
    padding: var(--spacing-l) var(--spacing-l) var(--spacing-s);
    align-items: flex-end;
  }

  .filter-group {
    flex: 0 0 120px;
    min-width: 0;
  }

  .date-range-group {
    flex: 0 1 420px;
    max-width: 420px;
    display: flex;
    flex-direction: row;
  }

  .date-range-group :global(.date-range-picker),
  .date-range-group :global(.spectrum-Form-item) {
    flex: 1 1 auto;
    width: 0;
  }

  .filter-label {
    font-size: 12px;
    font-weight: 600;
    color: var(--spectrum-global-color-gray-600);
    margin-bottom: var(--spacing-xs);
  }

  .filter-group:not(.date-range-group) :global(.spectrum-Picker) {
    width: 100%;
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

  .empty-state-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
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
