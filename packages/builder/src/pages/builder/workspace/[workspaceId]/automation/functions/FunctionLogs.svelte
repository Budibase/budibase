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
  import type { FunctionRunSummary } from "@budibase/types"
  import { onMount } from "svelte"
  import FunctionRunDetail from "./FunctionRunDetail.svelte"
  import {
    formatFunctionRunDuration,
    formatFunctionRunTimestamp,
    functionEnvironmentLabels,
    functionRunStatusLabels,
  } from "./functionLogs"

  const PAGE_SIZE = 20

  interface Props {
    functionId: string
  }

  let { functionId }: Props = $props()

  let runs = $state<FunctionRunSummary[]>([])
  let loading = $state(false)
  let error = $state("")
  let hasMore = $state(false)
  let nextBookmark = $state<string>()
  let selectedRun = $state<FunctionRunSummary>()
  let detailLoading = $state(false)
  let detailError = $state("")

  const runKey = (run: FunctionRunSummary) => `${run.environment}:${run.runId}`

  const loadRuns = async (bookmark?: string, append = false) => {
    if (loading) {
      return
    }
    loading = true
    error = ""
    try {
      const response = await API.getFunctionRuns(functionId, {
        bookmark,
        limit: PAGE_SIZE,
      })
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
      error = getErrorMessage(loadError) || "Unable to load Function logs"
      if (!append) {
        runs = []
        hasMore = false
        nextBookmark = undefined
        selectedRun = undefined
      }
    } finally {
      loading = false
    }
  }

  const loadMore = async () => {
    if (hasMore && nextBookmark) {
      await loadRuns(nextBookmark, true)
    }
  }

  const selectRun = async (run: FunctionRunSummary) => {
    selectedRun = run
    detailLoading = true
    detailError = ""
    const requestedRunId = run.runId
    try {
      const response = await API.getFunctionRun(functionId, requestedRunId)
      if (selectedRun?.runId === requestedRunId) {
        selectedRun = response.run
      }
    } catch (loadError) {
      if (selectedRun?.runId === requestedRunId) {
        detailError =
          getErrorMessage(loadError) || "Unable to load Function run details"
      }
    } finally {
      if (selectedRun?.runId === requestedRunId) {
        detailLoading = false
      }
    }
  }

  const retrySelectedRun = () => {
    if (selectedRun) {
      selectRun(selectedRun)
    }
  }

  onMount(() => {
    loadRuns()
  })
</script>

<section class="logs" aria-label="Function logs">
  <div class="logs-heading">
    <div>
      <Heading size="M">Logs</Heading>
      <Body size="S" color="var(--spectrum-global-color-gray-600)">
        Sanitized development and published execution history.
      </Body>
    </div>
    <Button secondary disabled={loading} on:click={() => loadRuns()}>
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
      <Button secondary on:click={() => loadRuns()}>Retry</Button>
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
