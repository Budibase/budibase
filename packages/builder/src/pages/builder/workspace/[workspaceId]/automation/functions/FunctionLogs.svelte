<svelte:options runes={true} />

<script lang="ts">
  import { API } from "@/api"
  import { getErrorMessage } from "@/helpers/errors"
  import {
    Badge,
    Body,
    Button,
    Heading,
    Icon,
    ProgressCircle,
  } from "@budibase/bbui"
  import type {
    FetchFunctionRunResponse,
    FetchFunctionRunsResponse,
    FunctionRunSummary,
  } from "@budibase/types"
  import { untrack } from "svelte"
  import FunctionRunDetail from "./FunctionRunDetail.svelte"
  import {
    formatFunctionRunDuration,
    formatFunctionRunTimestamp,
    functionEnvironmentLabels,
    functionRunStatusLabels,
  } from "./functionLogs"

  const PAGE_SIZE = 20

  export interface Props {
    functionId: string
    compact?: boolean
  }

  let { functionId, compact = false }: Props = $props()

  let runs = $state<FunctionRunSummary[]>([])
  let loading = $state(false)
  let error = $state("")
  let hasMore = $state(false)
  let nextBookmark = $state<string>()
  let selectedRun = $state<FunctionRunSummary>()
  let detailLoading = $state(false)
  let detailError = $state("")
  let currentRunsRequest: Promise<FetchFunctionRunsResponse> | undefined
  let currentDetailRequest: Promise<FetchFunctionRunResponse> | undefined

  const runKey = (run: FunctionRunSummary) => `${run.environment}:${run.runId}`

  const loadRuns = async ({
    requestedFunctionId,
    bookmark,
    append = false,
  }: {
    requestedFunctionId: string
    bookmark?: string
    append?: boolean
  }) => {
    if (loading) {
      return
    }
    loading = true
    error = ""
    const pendingRequest = API.getFunctionRuns(requestedFunctionId, {
      bookmark,
      limit: PAGE_SIZE,
    })
    currentRunsRequest = pendingRequest
    try {
      const response = await pendingRequest
      if (currentRunsRequest !== pendingRequest) {
        return
      }
      if (append) {
        const existingKeys = new Set(runs.map(runKey))
        runs = [
          ...runs,
          ...response.runs.filter(run => !existingKeys.has(runKey(run))),
        ]
      } else {
        runs = response.runs
        selectedRun = undefined
      }
      hasMore = response.hasMore
      nextBookmark = response.nextBookmark
    } catch (loadError) {
      if (currentRunsRequest !== pendingRequest) {
        return
      }
      error = getErrorMessage(loadError) || "Unable to load Function logs"
      if (!append) {
        runs = []
        hasMore = false
        nextBookmark = undefined
        selectedRun = undefined
      }
    } finally {
      if (currentRunsRequest === pendingRequest) {
        loading = false
      }
    }
  }

  const loadMore = async () => {
    if (hasMore && nextBookmark) {
      await loadRuns({
        requestedFunctionId: functionId,
        bookmark: nextBookmark,
        append: true,
      })
    }
  }

  const selectRun = async (run: FunctionRunSummary) => {
    selectedRun = run
    detailLoading = true
    detailError = ""
    const pendingRequest = API.getFunctionRun(functionId, run.runId)
    currentDetailRequest = pendingRequest
    try {
      const response = await pendingRequest
      if (currentDetailRequest === pendingRequest) {
        selectedRun = response.run
      }
    } catch (loadError) {
      if (currentDetailRequest === pendingRequest) {
        detailError =
          getErrorMessage(loadError) || "Unable to load Function run details"
      }
    } finally {
      if (currentDetailRequest === pendingRequest) {
        detailLoading = false
      }
    }
  }

  const retrySelectedRun = () => {
    if (selectedRun) {
      selectRun(selectedRun)
    }
  }

  $effect(() => {
    const requestedFunctionId = functionId
    currentRunsRequest = undefined
    currentDetailRequest = undefined
    runs = []
    loading = false
    error = ""
    hasMore = false
    nextBookmark = undefined
    selectedRun = undefined
    detailLoading = false
    detailError = ""
    untrack(() => {
      void loadRuns({ requestedFunctionId })
    })
    return () => {
      currentRunsRequest = undefined
      currentDetailRequest = undefined
    }
  })
</script>

<section class="logs" class:compact aria-label="Function logs">
  <div class="logs-heading">
    <div>
      {#if compact}
        <Body size="S" weight="500">Logs</Body>
      {:else}
        <Heading size="M">Logs</Heading>
      {/if}
      <Body size="S" color="var(--spectrum-global-color-gray-600)">
        Sanitized development and published execution history.
      </Body>
    </div>
    <Button
      secondary
      size="S"
      disabled={loading}
      on:click={() => loadRuns({ requestedFunctionId: functionId })}
    >
      Refresh
    </Button>
  </div>

  {#if loading && !runs.length}
    <div class="state" data-testid="function-logs-loading">
      <ProgressCircle size="M" />
      <Body size="S">Loading Function logs...</Body>
    </div>
  {:else if error && !runs.length}
    <div class="state" data-testid="function-logs-error" role="alert">
      <Icon name="warning-circle" size="L" />
      <Heading size="S">Unable to load Function logs</Heading>
      <Body size="S" color="var(--spectrum-global-color-gray-600)">
        {error}
      </Body>
      <Button
        secondary
        on:click={() => loadRuns({ requestedFunctionId: functionId })}
        >Retry</Button
      >
    </div>
  {:else if !runs.length}
    <div class="state" data-testid="function-logs-empty">
      <Icon name="clock" size="L" />
      <Heading size="S">No Function runs yet</Heading>
      <Body size="S" color="var(--spectrum-global-color-gray-600)">
        Runs will appear here after this Function is invoked.
      </Body>
    </div>
  {:else}
    {#if error}
      <div class="pagination-error" role="alert">
        <Body size="S">{error}</Body>
        <Button secondary on:click={loadMore}>Retry</Button>
      </div>
    {/if}
    {#if compact}
      <div class="run-list">
        {#each runs as run (runKey(run))}
          <button
            type="button"
            class="run-row"
            aria-label={`View ${functionRunStatusLabels[run.status]} run from ${formatFunctionRunTimestamp(run.startedAt)}`}
            onclick={() => selectRun(run)}
          >
            <Badge
              size="S"
              green={run.status === "success"}
              red={run.status === "error"}
              orange={run.status === "running"}
              grey={run.status === "stopped"}
            >
              {functionRunStatusLabels[run.status]}
            </Badge>
            <span class="run-row-info">
              <time datetime={run.startedAt}
                >{formatFunctionRunTimestamp(run.startedAt)}</time
              >
              <small
                >{functionEnvironmentLabels[run.environment]} · {formatFunctionRunDuration(
                  run.durationMs
                )}</small
              >
            </span>
            <Icon name="caret-right" size="S" />
          </button>
        {/each}
        {#if hasMore}
          <div class="pagination">
            <Button secondary size="S" disabled={loading} on:click={loadMore}>
              {loading ? "Loading..." : "Load more"}
            </Button>
          </div>
        {/if}
      </div>
      {#if selectedRun}
        <FunctionRunDetail
          run={selectedRun}
          loading={detailLoading}
          error={detailError}
          onretry={retrySelectedRun}
          onclose={() => {
            selectedRun = undefined
            detailError = ""
          }}
        />
      {/if}
    {:else}
      <div class:with-detail={selectedRun} class="logs-content">
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Status</th>
                <th>Started</th>
                <th>Environment</th>
                <th>Duration</th>
                <th><span class="visually-hidden">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {#each runs as run (runKey(run))}
                <tr data-status={run.status} data-environment={run.environment}>
                  <td>
                    <Badge
                      size="S"
                      green={run.status === "success"}
                      red={run.status === "error"}
                      orange={run.status === "running"}
                      grey={run.status === "stopped"}
                    >
                      {functionRunStatusLabels[run.status]}
                    </Badge>
                  </td>
                  <td>
                    <time datetime={run.startedAt}>
                      {formatFunctionRunTimestamp(run.startedAt)}
                    </time>
                  </td>
                  <td>{functionEnvironmentLabels[run.environment]}</td>
                  <td>{formatFunctionRunDuration(run.durationMs)}</td>
                  <td>
                    <Button secondary on:click={() => selectRun(run)}>
                      View details
                    </Button>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>

          {#if hasMore}
            <div class="pagination">
              <Button secondary disabled={loading} on:click={loadMore}>
                {loading ? "Loading..." : "Load more"}
              </Button>
            </div>
          {/if}
        </div>

        {#if selectedRun}
          <FunctionRunDetail
            run={selectedRun}
            loading={detailLoading}
            error={detailError}
            onretry={retrySelectedRun}
            onclose={() => {
              selectedRun = undefined
              detailError = ""
            }}
          />
        {/if}
      </div>
    {/if}
  {/if}
</section>

<style>
  .logs,
  .table-wrapper {
    display: flex;
    min-width: 0;
    flex-direction: column;
  }
  .logs {
    gap: var(--spacing-l);
  }
  .logs-heading,
  .pagination-error {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-m);
  }
  .logs-heading > div {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }
  .compact .logs-heading {
    align-items: flex-start;
    flex-direction: column;
  }
  .run-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .run-row {
    display: flex;
    width: 100%;
    align-items: center;
    gap: var(--spacing-s);
    padding: var(--spacing-s);
    border: 0;
    border-radius: 4px;
    background: var(--background-alt);
    color: inherit;
    text-align: left;
    cursor: pointer;
  }
  .run-row-info {
    display: flex;
    min-width: 0;
    flex: 1;
    flex-direction: column;
    gap: 2px;
    font-size: 12px;
  }
  .run-row-info small {
    color: var(--spectrum-global-color-gray-600);
  }
  .logs-content {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: var(--spacing-l);
  }
  .logs-content.with-detail {
    grid-template-columns: minmax(0, 1fr) minmax(320px, 0.45fr);
  }
  .table-wrapper {
    overflow-x: auto;
    gap: var(--spacing-m);
  }
  table {
    width: 100%;
    border-spacing: 0;
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: var(--radius-m);
  }
  th,
  td {
    padding: var(--spacing-s) var(--spacing-m);
    border-bottom: 1px solid var(--spectrum-global-color-gray-200);
    text-align: left;
    white-space: nowrap;
  }
  th {
    color: var(--spectrum-global-color-gray-600);
    font-size: 12px;
    font-weight: 600;
  }
  td {
    font-size: 13px;
  }
  tbody tr:last-child td {
    border-bottom: 0;
  }
  tbody tr[data-status="error"] {
    background: var(--spectrum-global-color-red-100);
  }
  tbody tr[data-status="success"] {
    background: var(--spectrum-global-color-green-100);
  }
  .state {
    display: flex;
    min-height: 280px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-s);
    text-align: center;
  }
  .pagination,
  .pagination-error {
    padding: var(--spacing-s);
  }
  .pagination {
    display: flex;
    justify-content: center;
  }
  .pagination-error {
    border: 1px solid var(--spectrum-global-color-red-300);
    border-radius: var(--radius-m);
    color: var(--spectrum-global-color-red-700);
  }
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  @media (max-width: 1100px) {
    .logs-content.with-detail {
      grid-template-columns: minmax(0, 1fr);
    }
  }
</style>
