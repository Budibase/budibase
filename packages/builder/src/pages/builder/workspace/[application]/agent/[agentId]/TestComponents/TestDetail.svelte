<script lang="ts">
  import {
    ActionButton,
    Body,
    Button,
    Divider,
    Icon,
    MarkdownViewer,
    StatusLight,
  } from "@budibase/bbui"
  import type { AgentTestCase, AgentTestCaseResult } from "@budibase/types"
  import {
    formatRunTime,
    getReviewerConfigSummary,
    getReviewerLabel,
    resultSummary,
  } from "./utils"

  type Verdict = "passed" | "failed" | "error" | "idle"

  type Props = {
    selectedCase: AgentTestCase | null
    latestResult: AgentTestCaseResult | null
    hasLatestRun: boolean
    saving: boolean
    running: boolean
    loading: boolean
    onEditCase: () => void
    onRun: () => void
    onDuplicateCase: () => void
    onRemoveCase: () => void
  }

  let {
    selectedCase,
    latestResult,
    hasLatestRun,
    saving,
    running,
    loading,
    onEditCase,
    onRun,
    onDuplicateCase,
    onRemoveCase,
  }: Props = $props()

  let subtitle = $derived(
    latestResult
      ? `Last run ${formatRunTime(latestResult.completedAt)} · ${resultSummary(latestResult)}`
      : hasLatestRun
        ? "Not included in the latest run"
        : "Not run yet"
  )

  let reviewerResultsById = $derived(
    latestResult
      ? new Map(
          latestResult.reviewerResults.map(result => [
            result.reviewerId,
            result,
          ])
        )
      : new Map()
  )

  const verdictLabel = (status?: Verdict) => {
    switch (status) {
      case "passed":
        return "Passed"
      case "failed":
        return "Failed"
      case "error":
        return "Error"
      default:
        return "Not available"
    }
  }
</script>

{#if !selectedCase}
  <div class="detail-empty">
    <Icon name="clock" size="L" color="var(--spectrum-global-color-gray-500)" />
    <Body size="S" color="var(--spectrum-global-color-gray-600)">
      Select a test to edit its configuration
    </Body>
  </div>
{:else}
  <div class="detail-content">
    <div class="detail-header">
      <div class="detail-heading">
        <h3 class="detail-title">{selectedCase.name}</h3>
        <Body size="S" color="var(--spectrum-global-color-gray-600)">
          {subtitle}
        </Body>
      </div>
      <div class="editor-actions">
        <Button
          primary
          disabled={running || saving || loading}
          on:click={onRun}
        >
          {running ? "Running..." : "Run"}
        </Button>
        <ActionButton
          quiet
          icon="copy"
          tooltip="Duplicate"
          disabled={saving || loading || running}
          on:click={onDuplicateCase}
        />
        <ActionButton
          quiet
          icon="trash"
          tooltip="Delete"
          disabled={saving || loading || running}
          on:click={onRemoveCase}
        />
      </div>
    </div>

    <div class="detail-stack">
      <section class="card">
        <div class="card-header">
          <div class="card-eyebrow">
            <Icon name="sliders-horizontal" size="S" />
            <span>Configuration</span>
          </div>
          <Button secondary disabled={saving || loading} on:click={onEditCase}>
            Edit test
          </Button>
        </div>

        <div class="summary-grid">
          <div class="summary-block">
            <span class="eyebrow">Input</span>
            <div class="summary-surface">
              {selectedCase.input || "No input yet"}
            </div>
          </div>

          <div class="summary-block">
            <div class="summary-block-header">
              <span class="eyebrow">Reviewers</span>
              <span class="eyebrow-count">
                {selectedCase.reviewers.length}
              </span>
            </div>

            {#if selectedCase.reviewers.length}
              <ul class="reviewer-summary-list">
                {#each selectedCase.reviewers as reviewer (reviewer.id)}
                  <li class="reviewer-summary-row">
                    <span class="reviewer-type">
                      {getReviewerLabel(reviewer.type)}
                    </span>
                    {#if getReviewerConfigSummary(reviewer)}
                      <span class="reviewer-config">
                        {getReviewerConfigSummary(reviewer)}
                      </span>
                    {/if}
                  </li>
                {/each}
              </ul>
            {:else}
              <Body size="S" color="var(--spectrum-global-color-gray-600)">
                No reviewers configured.
              </Body>
            {/if}
          </div>
        </div>
      </section>

      <section class="card">
        {#if latestResult}
          {#if latestResult.error}
            <div class="result-block">
              <div class="eyebrow error">
                <Icon
                  name="warning-circle"
                  size="XS"
                  color="var(--spectrum-global-color-red-600)"
                />
                <span>Error</span>
              </div>
              <pre class="result-pre">{latestResult.error}</pre>
            </div>

            <Divider noMargin />
          {/if}

          <div class="result-block">
            <div class="eyebrow">
              <span>Reviewer verdicts</span>
              {#if latestResult.caseSnapshot.reviewers.length}
                <span class="eyebrow-count">
                  {latestResult.caseSnapshot.reviewers.length}
                </span>
              {/if}
            </div>
            {#if latestResult.caseSnapshot.reviewers.length}
              <ul class="reviewer-results">
                {#each latestResult.caseSnapshot.reviewers as reviewer (reviewer.id)}
                  {@const reviewerResult = reviewerResultsById.get(reviewer.id)}
                  {@const status = (reviewerResult?.status ??
                    "idle") as Verdict}
                  <li class="reviewer-row">
                    <div class="reviewer-result-row">
                      <div class="reviewer-result-copy">
                        <span class="reviewer-type">
                          {getReviewerLabel(reviewer.type)}
                        </span>
                        {#if reviewerResult?.message}
                          <span class="reviewer-message">
                            {reviewerResult.message}
                          </span>
                        {/if}
                      </div>
                      <div class="reviewer-result-status">
                        <StatusLight
                          size="S"
                          positive={status === "passed"}
                          negative={status === "failed" || status === "error"}
                        >
                          {verdictLabel(status)}
                        </StatusLight>
                      </div>
                    </div>
                  </li>
                {/each}
              </ul>
            {:else}
              <Body size="S" color="var(--spectrum-global-color-gray-600)">
                No reviewers configured at run time.
              </Body>
            {/if}
          </div>

          <Divider noMargin />

          <div class="result-block">
            <div class="eyebrow">
              <span>Final response</span>
            </div>
            {#if latestResult.response}
              <div class="response-surface">
                <MarkdownViewer value={latestResult.response} />
              </div>
            {:else}
              <Body size="S" color="var(--spectrum-global-color-gray-600)">
                No response returned.
              </Body>
            {/if}
          </div>
        {:else}
          <div class="result-empty">
            <Icon
              name={hasLatestRun ? "minus-circle" : "play-circle"}
              size="L"
              color="var(--spectrum-global-color-gray-500)"
            />
            <Body size="S" color="var(--spectrum-global-color-gray-600)">
              {hasLatestRun
                ? "This test wasn't included in the latest run."
                : 'No runs yet. Click "Run" to execute this test.'}
            </Body>
          </div>
        {/if}
      </section>
    </div>
  </div>
{/if}

<style>
  .detail-content {
    padding: var(--spacing-l);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
  }

  .detail-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--spacing-m);
  }

  .detail-heading {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  }

  .detail-title {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--spectrum-global-color-gray-900);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
  }

  .detail-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-m);
    height: 100%;
    padding: var(--spacing-xl);
    min-height: 200px;
  }

  .editor-actions {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: var(--spacing-s);
    flex-shrink: 0;
  }

  .detail-stack {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
    min-width: 0;
  }

  .card {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 10px;
    background: var(--background);
    padding: var(--spacing-l);
    min-width: 0;
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-s);
  }

  .card-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.01em;
    color: var(--spectrum-global-color-gray-900);
  }

  .summary-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
    gap: var(--spacing-l);
  }

  .summary-block {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
    min-width: 0;
  }

  .summary-block-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-s);
  }

  .summary-surface {
    min-height: 120px;
    padding: var(--spacing-m);
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 10px;
    background: var(--background-alt);
    font-size: 13px;
    line-height: 1.55;
    color: var(--spectrum-global-color-gray-900);
    white-space: pre-wrap;
    word-break: break-word;
  }

  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--spectrum-global-color-gray-600);
  }

  .eyebrow.error {
    color: var(--spectrum-global-color-red-600);
  }

  .eyebrow-count {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.04em;
    color: var(--spectrum-global-color-gray-600);
    background: var(--spectrum-global-color-gray-200);
    border-radius: 999px;
    padding: 1px 8px;
  }

  .result-block {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }

  .reviewer-summary-list,
  .reviewer-results {
    display: flex;
    flex-direction: column;
    gap: 0;
    margin: 0;
    padding: 0;
    list-style: none;
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 10px;
    overflow: hidden;
    background: var(--background);
  }

  .reviewer-summary-list {
    background: var(--background-alt);
  }

  .reviewer-summary-row {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: var(--spacing-s) var(--spacing-m);
    border-bottom: 1px solid var(--spectrum-global-color-gray-200);
    background: var(--background-alt);
  }

  .reviewer-summary-row:first-child {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }

  .reviewer-summary-row:last-child {
    border-bottom: none;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }

  .reviewer-row {
    padding: var(--spacing-s) var(--spacing-m);
    border-bottom: 1px solid var(--spectrum-global-color-gray-200);
  }

  .reviewer-row:last-child {
    border-bottom: none;
  }

  .reviewer-result-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-m);
    min-width: 0;
  }

  .reviewer-result-copy {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
    flex: 1;
  }

  .reviewer-result-status {
    flex-shrink: 0;
  }

  .reviewer-type {
    font-size: 13px;
    font-weight: 600;
    color: var(--spectrum-global-color-gray-900);
  }

  .reviewer-config {
    font-size: 12px;
    color: var(--spectrum-global-color-gray-700);
    font-family: "ui-monospace", "SFMono-Regular", monospace;
    word-break: break-word;
  }

  .reviewer-message {
    font-size: 12px;
    color: var(--spectrum-global-color-gray-600);
    line-height: 1.5;
  }

  .result-pre {
    white-space: pre-wrap;
    word-break: break-word;
    font-family: "ui-monospace", "SFMono-Regular", monospace;
    font-size: 12px;
    line-height: 1.55;
    background: color-mix(
      in srgb,
      var(--spectrum-global-color-red-600) 6%,
      var(--background-alt)
    );
    border-radius: 8px;
    padding: var(--spacing-s) var(--spacing-m);
    margin: 0;
    border: 1px solid
      color-mix(
        in srgb,
        var(--spectrum-global-color-red-600) 20%,
        var(--spectrum-global-color-gray-200)
      );
    color: var(--spectrum-global-color-gray-900);
  }

  .response-surface {
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 10px;
    background: var(--background-alt);
    padding: var(--spacing-m);
    max-height: min(480px, 55vh);
    overflow: auto;
    scrollbar-width: thin;
  }

  .response-surface::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  .response-surface::-webkit-scrollbar-track {
    background: transparent;
  }

  .response-surface::-webkit-scrollbar-thumb {
    background: var(--spectrum-global-color-gray-300);
    border-radius: 3px;
  }

  .result-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-s);
    padding: var(--spacing-xl) var(--spacing-m);
    text-align: center;
    border: 1px dashed var(--spectrum-global-color-gray-300);
    border-radius: 10px;
    background: var(--background-alt);
  }

  @media (max-width: 1024px) {
    .summary-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
