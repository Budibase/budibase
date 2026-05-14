<script lang="ts">
  import {
    Body,
    Icon,
    MarkdownViewer,
    Modal,
    ModalContent,
  } from "@budibase/bbui"
  import type { AgentTestCase, AgentTestCaseResult } from "@budibase/types"
  import { describeReviewer, getReviewerLabel } from "@budibase/shared-core"
  import AnthropicLogo from "assets/llm-icons/anthropic.svg"
  import BudibaseLogo from "assets/llm-icons/bbai.svg"
  import GoogleLogo from "assets/llm-icons/google.svg"
  import GroqLogo from "assets/llm-icons/groq.svg"
  import MistralLogo from "assets/llm-icons/mistral_ai.svg"
  import OpenrouterLogo from "assets/llm-icons/openrouter.svg"
  import OpenAiLogo from "assets/llm-icons/openai.svg"
  import { getVerdictMeta } from "./utils"

  type Props = {
    selectedCase: AgentTestCase | null
    latestResults: AgentTestCaseResult[]
    hasLatestRun: boolean
  }

  let { selectedCase, latestResults, hasLatestRun }: Props = $props()

  const PROVIDER_LOGOS: Record<string, string> = {
    Anthropic: AnthropicLogo,
    Budibase: BudibaseLogo,
    Google_AI_Studio: GoogleLogo,
    Groq: GroqLogo,
    MistralAI: MistralLogo,
    OpenAI: OpenAiLogo,
    Openrouter: OpenrouterLogo,
  }

  const INVERT_ON_LIGHT = new Set(["Anthropic", "Budibase", "OpenAI"])
  const INVERT_ON_DARK = new Set(["Openrouter"])

  const getProviderLogo = (provider?: string) =>
    provider ? PROVIDER_LOGOS[provider] || null : null

  const getProviderThemeClass = (provider?: string) => {
    if (!provider) return ""
    if (INVERT_ON_LIGHT.has(provider)) return "invert-on-light"
    if (INVERT_ON_DARK.has(provider)) return "invert-on-dark"
    return ""
  }

  const getConfigName = (result: AgentTestCaseResult) =>
    result.aiConfig?.name || result.aiConfigId || "AI config"

  const getResultMeta = (result: AgentTestCaseResult) =>
    getVerdictMeta(result.status)

  const formatLatency = (ms: number): string => {
    if (!Number.isFinite(ms) || ms < 0) return "—"
    if (ms < 1000) return `${Math.round(ms)}ms`
    return `${(ms / 1000).toFixed(2)}s`
  }

  const previewText = (markdown: string, max = 220): string => {
    const stripped = markdown
      .replace(/```[\s\S]*?```/g, "")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/[#>*_~-]/g, "")
      .replace(/\s+/g, " ")
      .trim()
    if (stripped.length <= max) return stripped
    return `${stripped.slice(0, max).trimEnd()}…`
  }

  let responseModal = $state<Modal>()
  let activeResponse = $state<{
    title: string
    body: string
  } | null>(null)

  const openResponseModal = (result: AgentTestCaseResult) => {
    if (!result.response) return
    activeResponse = {
      title: getConfigName(result),
      body: result.response,
    }
    responseModal?.show()
  }

  let evaluationModal = $state<Modal>()
  let activeEvaluation = $state<{
    title: string
    items: {
      name: string
      message: string
      icon: string
      color: string
      label: string
    }[]
  } | null>(null)

  const openEvaluationModal = (result: AgentTestCaseResult) => {
    const items = result.caseSnapshot.reviewers.map(reviewer => {
      const reviewerResult = result.reviewerResults.find(
        r => r.reviewerId === reviewer.id
      )
      const meta = getVerdictMeta(reviewerResult?.status)
      return {
        name: getReviewerLabel(reviewer.type),
        message: reviewerResult?.message || "",
        icon: meta.icon,
        color: meta.color,
        label: meta.label,
      }
    })
    activeEvaluation = {
      title: `${getConfigName(result)} — Evaluation`,
      items,
    }
    evaluationModal?.show()
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
      </div>
    </div>

    <div class="detail-stack">
      <section class="card">
        <div class="card-eyebrow">
          <Icon name="sliders-horizontal" size="S" />
          <span>Configuration</span>
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
                  {@const summary = describeReviewer(reviewer)}
                  <li class="reviewer-summary-row">
                    <span class="reviewer-type">
                      {getReviewerLabel(reviewer.type)}
                    </span>
                    {#if summary}
                      <span class="reviewer-config">{summary}</span>
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
        {#if latestResults.length}
          <div class="card-eyebrow">
            <Icon name="play-circle" size="S" />
            <span>Latest run</span>
            {#if latestResults.length > 1}
              <span class="eyebrow-count">{latestResults.length}</span>
            {/if}
          </div>

          <div class="results-grid" class:single={latestResults.length === 1}>
            {#each latestResults as result (result.aiConfigId || result.sessionId)}
              {@const meta = getResultMeta(result)}
              {@const providerLogo = getProviderLogo(result.aiConfig?.provider)}
              {@const providerTheme = getProviderThemeClass(
                result.aiConfig?.provider
              )}
              {@const reviewers = result.caseSnapshot.reviewers}
              <article class="result-card">
                <header class="result-card-header">
                  <div class="identity">
                    {#if providerLogo}
                      <span class={`provider-logo ${providerTheme}`}>
                        <img src={providerLogo} alt="" />
                      </span>
                    {/if}
                    <span class="model-name">
                      {getConfigName(result)}
                    </span>
                  </div>
                  <div class="result-meta">
                    <span class={`status ${meta.tone}`}>
                      <Icon name={meta.icon} size="S" color={meta.color} />
                      <span>{meta.label}</span>
                    </span>
                    <span class="meta-divider" aria-hidden="true">·</span>
                    <span class="latency">
                      {formatLatency(result.durationMs)}
                    </span>
                  </div>
                </header>

                {#if result.error}
                  <pre class="result-error">{result.error}</pre>
                {/if}

                {#if reviewers.length}
                  <div class="hairline" aria-hidden="true"></div>
                  <ul class="verdicts" role="list">
                    {#each reviewers as reviewer (reviewer.id)}
                      {@const reviewerResult = result.reviewerResults.find(
                        r => r.reviewerId === reviewer.id
                      )}
                      {@const reviewerMeta = getVerdictMeta(
                        reviewerResult?.status
                      )}
                      <li class="verdict">
                        <span class="verdict-icon">
                          <Icon
                            name={reviewerMeta.icon}
                            size="S"
                            color={reviewerMeta.color}
                          />
                        </span>
                        <div class="verdict-body">
                          <span class="verdict-name">
                            {getReviewerLabel(reviewer.type)}
                          </span>
                          {#if reviewerResult?.message}
                            <span class="verdict-message">
                              {reviewerResult.message}
                            </span>
                          {/if}
                        </div>
                      </li>
                    {/each}
                  </ul>
                  <button
                    type="button"
                    class="response-link"
                    onclick={() => openEvaluationModal(result)}
                  >
                    <span>View full evaluation</span>
                    <Icon name="arrow-square-out" size="XS" />
                  </button>
                {/if}

                <div class="hairline" aria-hidden="true"></div>

                {#if result.response}
                  <div class="response">
                    <p class="response-preview">
                      {previewText(result.response)}
                    </p>
                    <button
                      type="button"
                      class="response-link"
                      onclick={() => openResponseModal(result)}
                    >
                      <span>View full response</span>
                      <Icon name="arrow-square-out" size="XS" />
                    </button>
                  </div>
                {:else}
                  <Body size="S" color="var(--spectrum-global-color-gray-600)">
                    No response returned.
                  </Body>
                {/if}
              </article>
            {/each}
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

<Modal bind:this={responseModal}>
  <ModalContent
    title={activeResponse?.title || "Response"}
    confirmText="Close"
    showCancelButton={false}
    showCloseIcon
    size="L"
  >
    {#if activeResponse}
      <div class="response-modal-body">
        <MarkdownViewer value={activeResponse.body} />
      </div>
    {/if}
  </ModalContent>
</Modal>

<Modal bind:this={evaluationModal}>
  <ModalContent
    title={activeEvaluation?.title || "Evaluation"}
    confirmText="Close"
    showCancelButton={false}
    showCloseIcon
    size="L"
  >
    {#if activeEvaluation}
      <div class="response-modal-body">
        <ul class="evaluation-list" role="list">
          {#each activeEvaluation.items as item}
            <li class="evaluation-item">
              <div class="evaluation-header">
                <Icon name={item.icon} size="S" color={item.color} />
                <span class="evaluation-name">{item.name}</span>
                <span class="evaluation-label">{item.label}</span>
              </div>
              {#if item.message}
                <p class="evaluation-message">{item.message}</p>
              {:else}
                <p class="evaluation-message empty">No message provided.</p>
              {/if}
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  </ModalContent>
</Modal>

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

  .eyebrow-count {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.04em;
    color: var(--spectrum-global-color-gray-600);
    background: var(--spectrum-global-color-gray-200);
    border-radius: 999px;
    padding: 1px 8px;
  }

  .results-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr));
    gap: var(--spacing-m);
  }

  .results-grid.single {
    grid-template-columns: minmax(0, 1fr);
  }

  .result-card {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
    min-width: 0;
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 12px;
    background: var(--background-alt);
    padding: var(--spacing-l);
  }

  .result-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-m);
    min-width: 0;
  }

  .identity {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    flex: 1 1 auto;
  }

  .provider-logo {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }

  .provider-logo img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  :global(.spectrum--light) .provider-logo.invert-on-light img,
  :global(.spectrum--lightest) .provider-logo.invert-on-light img {
    filter: invert(100%);
  }

  :global(.spectrum--darkest) .provider-logo.invert-on-dark img,
  :global(.spectrum--dark) .provider-logo.invert-on-dark img,
  :global(.spectrum--nord) .provider-logo.invert-on-dark img,
  :global(.spectrum--midnight) .provider-logo.invert-on-dark img {
    filter: invert(100%);
  }

  .model-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: -0.005em;
    color: var(--spectrum-global-color-gray-900);
    min-width: 0;
  }

  .result-meta {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
    white-space: nowrap;
  }

  .meta-divider {
    color: var(--spectrum-global-color-gray-400);
    font-size: 13px;
    line-height: 1;
    user-select: none;
  }

  .latency {
    font-size: 12px;
    font-weight: 500;
    color: var(--spectrum-global-color-gray-600);
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.01em;
  }

  .hairline {
    height: 1px;
    background: var(--spectrum-global-color-gray-200);
  }

  .reviewer-summary-list {
    display: flex;
    flex-direction: column;
    gap: 0;
    margin: 0;
    padding: 0;
    list-style: none;
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 10px;
    overflow: hidden;
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

  .verdicts {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .verdict {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    min-width: 0;
  }

  .verdict-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 18px;
    flex-shrink: 0;
  }

  .verdict-body {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
    flex: 1;
  }

  .verdict-name {
    font-size: 13px;
    font-weight: 500;
    color: var(--spectrum-global-color-gray-900);
    line-height: 1.45;
  }

  .verdict-message {
    font-size: 13px;
    color: var(--spectrum-global-color-gray-600);
    line-height: 1.55;
    word-break: break-word;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .status {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 500;
    white-space: nowrap;
  }

  .status.passed {
    color: var(--color-green-500);
  }

  .status.failed,
  .status.error {
    color: var(--color-orange-500);
  }

  .status.idle {
    color: var(--spectrum-global-color-gray-600);
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

  .result-error {
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

  .response {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
    min-width: 0;
  }

  .response-preview {
    margin: 0;
    font-size: 13px;
    line-height: 1.65;
    color: var(--spectrum-global-color-gray-800);
    word-break: break-word;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .response-link {
    align-self: flex-start;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    color: var(--spectrum-global-color-blue-600);
    transition: color 120ms ease;
  }

  .response-link :global(.spectrum-Icon) {
    transition: transform 160ms cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  .response-link:hover {
    color: var(--spectrum-global-color-blue-700);
  }

  .response-link:hover :global(.spectrum-Icon) {
    transform: translate(2px, -1px);
  }

  .response-link:focus-visible {
    outline: 2px solid var(--spectrum-global-color-blue-500);
    outline-offset: 2px;
    border-radius: 2px;
  }

  .response-modal-body {
    max-height: min(60vh, 540px);
    overflow: auto;
    padding-right: var(--spacing-s);
    scrollbar-width: thin;
  }

  .response-modal-body::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  .response-modal-body::-webkit-scrollbar-track {
    background: transparent;
  }

  .response-modal-body::-webkit-scrollbar-thumb {
    background: var(--spectrum-global-color-gray-300);
    border-radius: 3px;
  }

  .evaluation-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .evaluation-item {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
    padding: var(--spacing-m);
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 10px;
    background: var(--background-alt);
  }

  .evaluation-header {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .evaluation-name {
    font-size: 13px;
    font-weight: 600;
    color: var(--spectrum-global-color-gray-900);
  }

  .evaluation-label {
    font-size: 12px;
    color: var(--spectrum-global-color-gray-600);
    margin-left: auto;
  }

  .evaluation-message {
    margin: 0;
    font-size: 13px;
    line-height: 1.6;
    color: var(--spectrum-global-color-gray-800);
    white-space: pre-wrap;
    word-break: break-word;
  }

  .evaluation-message.empty {
    color: var(--spectrum-global-color-gray-600);
    font-style: italic;
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
