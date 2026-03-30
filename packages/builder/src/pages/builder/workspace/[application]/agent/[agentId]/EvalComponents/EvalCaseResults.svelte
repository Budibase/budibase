<script lang="ts">
  import { Body, Detail, Divider, Heading, StatusLight } from "@budibase/bbui"
  import type { AgentEvalCaseResult, AgentEvalRun } from "@budibase/types"
  import { resultSummary } from "./utils"

  type Props = {
    selectedResult: AgentEvalCaseResult | null
    recentRuns: AgentEvalRun[]
    selectedRunId: string | null
    onSelectRun: (runId: string) => void
  }

  let { selectedResult, recentRuns, selectedRunId, onSelectRun }: Props =
    $props()

  const formatAssertionList = (values?: string[]) => {
    if (!values?.length) {
      return null
    }

    return values.join(", ")
  }
</script>

<div class="results">
  <div class="run-history-section">
    <Heading size="XS">Run history</Heading>
    {#if recentRuns.length > 0}
      <div class="run-history">
        {#each recentRuns as run (run.runId)}
          <button
            class:selected={run.runId === selectedRunId}
            class="run-item"
            type="button"
            onclick={() => onSelectRun(run.runId)}
          >
            <span class="run-item-score">{run.passed}/{run.total}</span>
            <span class="run-item-time">
              {new Date(run.completedAt).toLocaleString()}
            </span>
          </button>
        {/each}
      </div>
    {:else}
      <div class="result-empty">
        <Body size="S" color="var(--spectrum-global-color-gray-600)">
          No runs yet.
        </Body>
      </div>
    {/if}
  </div>

  <Divider size="S" noMargin />

  <div class="result-detail-section">
    <Heading size="XS">Case result</Heading>
    {#if selectedResult}
      <div class="result-status">
        <StatusLight
          positive={selectedResult.status === "passed"}
          negative={selectedResult.status === "failed" ||
            selectedResult.status === "error"}
        >
          {resultSummary(selectedResult)}
        </StatusLight>
      </div>

      {#if selectedResult.error}
        <div class="result-section">
          <Detail>Error</Detail>
          <pre>{selectedResult.error}</pre>
        </div>
      {/if}

      {#if selectedResult.judge}
        <div class="result-section">
          <Detail>Judge result</Detail>
          <StatusLight
            positive={selectedResult.judge.status === "passed"}
            negative={selectedResult.judge.status === "failed" ||
              selectedResult.judge.status === "error"}
          >
            {selectedResult.judge.status === "passed"
              ? "Passed"
              : selectedResult.judge.status === "failed"
                ? "Failed"
                : "Error"}
          </StatusLight>
          {#if selectedResult.judge.reason}
            <Body size="S">{selectedResult.judge.reason}</Body>
          {/if}
          {#if selectedResult.judge.error}
            <pre>{selectedResult.judge.error}</pre>
          {/if}
        </div>
      {/if}

      {#if selectedResult.failures.length > 0}
        <div class="result-section">
          <Detail>Assertion failures</Detail>
          <ul class="failure-list">
            {#each selectedResult.failures as failure (failure.message)}
              <li>{failure.message}</li>
            {/each}
          </ul>
        </div>
      {/if}

      {#if selectedResult.caseSnapshot}
        <div class="result-section">
          <Detail>Evaluated assertions</Detail>
          <div class="assertion-summary">
            {#if selectedResult.caseSnapshot.assertions.exact}
              <div>
                <strong>Exact:</strong>
                {selectedResult.caseSnapshot.assertions.exact}
              </div>
            {/if}
            {#if formatAssertionList(selectedResult.caseSnapshot.assertions.contains)}
              <div>
                <strong>Contains:</strong>
                {formatAssertionList(selectedResult.caseSnapshot.assertions.contains)}
              </div>
            {/if}
            {#if formatAssertionList(selectedResult.caseSnapshot.assertions.notContains)}
              <div>
                <strong>Not contains:</strong>
                {formatAssertionList(selectedResult.caseSnapshot.assertions.notContains)}
              </div>
            {/if}
            {#if selectedResult.caseSnapshot.assertions.judge?.rubric}
              <div>
                <strong>Judge:</strong>
                {selectedResult.caseSnapshot.assertions.judge.rubric}
              </div>
            {/if}
          </div>
        </div>
      {/if}

      <div class="result-section">
        <Detail>Response</Detail>
        <pre>{selectedResult.response || "[No response]"}</pre>
      </div>
    {:else}
      <div class="result-empty">
        <Body size="S" color="var(--spectrum-global-color-gray-600)">
          Run the suite to see pass/fail results for this case.
        </Body>
      </div>
    {/if}
  </div>
</div>

<style>
  .results {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
    padding: var(--spacing-m) 0;
  }

  .run-history-section,
  .result-detail-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }

  .run-history {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .run-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-s);
    width: 100%;
    padding: var(--spacing-s);
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 8px;
    background: var(--background);
    cursor: pointer;
    text-align: left;
    transition:
      border-color 130ms ease,
      background 130ms ease;
  }

  .run-item:hover {
    border-color: var(--spectrum-global-color-gray-400);
  }

  .run-item.selected {
    border-color: var(--bb-blue);
    background: var(--background-alt);
  }

  .run-item-score {
    font-size: 13px;
    font-weight: 600;
    color: var(--spectrum-global-color-gray-900);
  }

  .run-item-time {
    font-size: 12px;
    color: var(--spectrum-global-color-gray-600);
  }

  .result-status {
    display: flex;
  }

  .result-status :global(.spectrum-StatusLight),
  .result-section :global(.spectrum-StatusLight) {
    justify-content: flex-start;
  }

  .result-section {
    margin-top: var(--spacing-s);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .assertion-summary {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 13px;
    color: var(--spectrum-global-color-gray-800);
  }

  .result-section pre {
    white-space: pre-wrap;
    word-break: break-word;
    font-family: "ui-monospace", "SFMono-Regular", monospace;
    font-size: 12px;
    line-height: 1.5;
    background: var(--background);
    border-radius: 8px;
    padding: var(--spacing-s);
    margin: 0;
    border: 1px solid var(--spectrum-global-color-gray-200);
  }

  .failure-list {
    margin: 0;
    padding-left: 18px;
    font-size: 13px;
    color: var(--spectrum-global-color-gray-800);
  }

  .failure-list li {
    margin-bottom: 4px;
  }

  .result-empty {
    padding: var(--spacing-m) 0;
  }
</style>
