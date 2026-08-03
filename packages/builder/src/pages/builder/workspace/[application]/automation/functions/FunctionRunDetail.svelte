<svelte:options runes={true} />

<script lang="ts">
  import { Badge, Body, Button, Heading, ProgressCircle } from "@budibase/bbui"
  import type { FunctionRunSummary } from "@budibase/types"
  import {
    formatFunctionRunDuration,
    formatFunctionRunTimestamp,
    functionEnvironmentLabels,
    functionRunStatusLabels,
  } from "./functionLogs"

  interface Props {
    run: FunctionRunSummary
    loading?: boolean
    error?: string
    onretry?: () => void
    onclose?: () => void
  }

  let {
    run,
    loading = false,
    error = "",
    onretry = () => {},
    onclose = () => {},
  }: Props = $props()
</script>

<aside class="run-detail" aria-label="Function run details">
  <div class="detail-heading">
    <div>
      <Heading size="S">Run details</Heading>
      <Body size="XS" color="var(--spectrum-global-color-gray-600)">
        Sanitized execution summary
      </Body>
    </div>
    <Button secondary on:click={onclose}>Close</Button>
  </div>

  {#if loading}
    <div class="detail-state" data-testid="function-run-detail-loading">
      <ProgressCircle size="S" />
      <Body size="S">Loading details...</Body>
    </div>
  {:else if error}
    <div class="detail-state error" role="alert">
      <Body size="S">{error}</Body>
      <Button secondary on:click={onretry}>Retry</Button>
    </div>
  {:else}
    <dl>
      <div>
        <dt>Status</dt>
        <dd>
          <Badge
            size="S"
            green={run.status === "success"}
            red={run.status === "error"}
            orange={run.status === "running"}
            grey={run.status === "stopped"}
          >
            {functionRunStatusLabels[run.status]}
          </Badge>
        </dd>
      </div>
      <div>
        <dt>Environment</dt>
        <dd>{functionEnvironmentLabels[run.environment]}</dd>
      </div>
      <div>
        <dt>Started</dt>
        <dd>
          <time datetime={run.startedAt}>
            {formatFunctionRunTimestamp(run.startedAt)}
          </time>
        </dd>
      </div>
      {#if run.finishedAt}
        <div>
          <dt>Finished</dt>
          <dd>
            <time datetime={run.finishedAt}>
              {formatFunctionRunTimestamp(run.finishedAt)}
            </time>
          </dd>
        </div>
      {/if}
      <div>
        <dt>Duration</dt>
        <dd>{formatFunctionRunDuration(run.durationMs)}</dd>
      </div>
      <div>
        <dt>Invocation source</dt>
        <dd>Automation</dd>
      </div>
      <div>
        <dt>Automation ID</dt>
        <dd><code>{run.invocation.automationId}</code></dd>
      </div>
      <div>
        <dt>Step ID</dt>
        <dd><code>{run.invocation.stepId}</code></dd>
      </div>
      <div>
        <dt>Query count</dt>
        <dd>{run.queryCount}</dd>
      </div>
      <div>
        <dt>Source hash</dt>
        <dd><code>{run.sourceHash}</code></dd>
      </div>
      {#if run.error}
        <div>
          <dt>Error code</dt>
          <dd><code>{run.error.code}</code></dd>
        </div>
        <div>
          <dt>Error message</dt>
          <dd class="error-message">{run.error.message}</dd>
        </div>
      {/if}
    </dl>
  {/if}
</aside>

<style>
  .run-detail {
    display: flex;
    min-width: 0;
    flex-direction: column;
    gap: var(--spacing-l);
    padding: var(--spacing-l);
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: var(--radius-m);
    background: var(--spectrum-global-color-gray-50);
  }
  .detail-heading,
  .detail-state {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-s);
  }
  .detail-heading > div {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }
  .detail-state {
    justify-content: flex-start;
    padding: var(--spacing-l) 0;
  }
  .detail-state.error {
    flex-wrap: wrap;
    color: var(--spectrum-global-color-red-700);
  }
  dl {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
    margin: 0;
  }
  dl > div {
    display: grid;
    grid-template-columns: minmax(100px, 0.75fr) minmax(0, 1fr);
    gap: var(--spacing-m);
  }
  dt {
    color: var(--spectrum-global-color-gray-600);
    font-size: 12px;
  }
  dd {
    min-width: 0;
    margin: 0;
    overflow-wrap: anywhere;
    font-size: 13px;
  }
  code {
    font-size: 12px;
  }
  .error-message {
    color: var(--spectrum-global-color-red-700);
  }
</style>
