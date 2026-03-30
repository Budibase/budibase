<script lang="ts">
  import { Body, Detail, Heading, StatusLight } from "@budibase/bbui"
  import type { AgentEvalCaseResult } from "@budibase/types"
  import {
    getReviewerConfigSummary,
    getReviewerLabel,
    resultSummary,
  } from "./utils"

  type Props = {
    selectedResult: AgentEvalCaseResult
  }

  let { selectedResult }: Props = $props()

  let caseSnapshot = $derived(selectedResult.caseSnapshot)
  let snapshotReviewers = $derived(caseSnapshot.reviewers)

  let reviewerResultsById = $derived(
    new Map(
      selectedResult.reviewerResults.map(result => [result.reviewerId, result])
    )
  )

  const getVerdictLabel = (status?: "passed" | "failed" | "error") => {
    if (status === "passed") {
      return "Passed"
    }
    if (status === "failed") {
      return "Failed"
    }
    if (status === "error") {
      return "Error"
    }
    return "Not available"
  }
</script>

<div class="results">
  <div class="result-detail-section">
    <Heading size="XS">Result for selected run</Heading>
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

    <div class="result-section">
      <Detail>Executed tools</Detail>
      {#if selectedResult.toolCalls.length > 0}
        <div class="tool-list">
          {#each selectedResult.toolCalls as toolName, index (`${toolName}-${index}`)}
            <div class="tool-item">{toolName}</div>
          {/each}
        </div>
      {:else}
        <Body size="S" color="var(--spectrum-global-color-gray-600)">
          No tools executed.
        </Body>
      {/if}
    </div>

    <div class="result-section">
      <Detail>Reviewer verdicts</Detail>
      {#if snapshotReviewers.length}
        <div class="reviewer-results">
          {#each snapshotReviewers as reviewer (reviewer.id)}
            {@const reviewerResult = reviewerResultsById.get(reviewer.id)}
            <div class="reviewer-result-card">
              <div class="reviewer-result-header">
                <strong>{getReviewerLabel(reviewer.type)}</strong>
                <StatusLight
                  positive={reviewerResult?.status === "passed"}
                  negative={reviewerResult?.status === "failed" ||
                    reviewerResult?.status === "error"}
                >
                  {getVerdictLabel(reviewerResult?.status)}
                </StatusLight>
              </div>
              <Body size="S">{getReviewerConfigSummary(reviewer)}</Body>
              {#if reviewerResult?.message}
                <Body size="S" color="var(--spectrum-global-color-gray-600)">
                  {reviewerResult.message}
                </Body>
              {/if}
            </div>
          {/each}
        </div>
      {:else}
        <Body size="S" color="var(--spectrum-global-color-gray-600)">
          No stored reviewers for this run.
        </Body>
      {/if}
    </div>

    <div class="result-section">
      <Detail>Stored case snapshot</Detail>
      <div class="snapshot-grid">
        <div>
          <strong>Input</strong>
          <pre>{caseSnapshot.input}</pre>
        </div>
        {#if caseSnapshot.context}
          <div>
            <strong>Context</strong>
            <pre>{caseSnapshot.context}</pre>
          </div>
        {/if}
        <div>
          <strong>Reviewers</strong>
          <div class="snapshot-reviewers">
            {#each snapshotReviewers as reviewer (reviewer.id)}
              <div class="snapshot-reviewer">
                <span>{getReviewerLabel(reviewer.type)}</span>
                <span>{getReviewerConfigSummary(reviewer)}</span>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>

    <div class="result-section">
      <Detail>Final response</Detail>
      <pre>{selectedResult.response || "[No response]"}</pre>
    </div>
  </div>
</div>

<style>
  .results {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
    padding: var(--spacing-m) 0;
  }

  .result-detail-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }

  .result-status {
    display: flex;
  }

  .result-status :global(.spectrum-StatusLight),
  .reviewer-result-header :global(.spectrum-StatusLight) {
    justify-content: flex-start;
  }

  .result-section {
    margin-top: var(--spacing-s);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .tool-list,
  .reviewer-results,
  .snapshot-reviewers {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .tool-item,
  .reviewer-result-card,
  .snapshot-reviewer {
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 8px;
    background: var(--background);
    padding: var(--spacing-s);
  }

  .reviewer-result-card {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .reviewer-result-header,
  .snapshot-reviewer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-s);
  }

  .snapshot-grid {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
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
</style>
