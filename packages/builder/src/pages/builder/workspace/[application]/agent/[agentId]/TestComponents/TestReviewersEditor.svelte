<script lang="ts">
  import {
    ActionButton,
    Body,
    DetailSummary,
    Helpers,
    Input,
    Select,
    TextArea,
  } from "@budibase/bbui"
  import type { AgentTestCase, AgentTestReviewer } from "@budibase/types"
  import {
    REVIEWERS,
    REVIEWER_TYPES,
    describeReviewer,
    type ReviewerType,
  } from "@budibase/shared-core"

  type ToolOption = { label: string; value: string }

  type Props = {
    selectedCase: AgentTestCase
    toolOptions: ToolOption[]
    onUpdateCase: (
      _updater: (_testCase: AgentTestCase) => AgentTestCase
    ) => void
  }

  let { selectedCase, toolOptions, onUpdateCase }: Props = $props()

  let reviewerIdsOpenOnAdd = $state<Set<string>>(new Set())

  const updateReviewerField =
    (reviewerId: string, field: string) =>
    (event: CustomEvent<string | undefined>) =>
      onUpdateCase(testCase => ({
        ...testCase,
        reviewers: testCase.reviewers.map((reviewer: AgentTestReviewer) =>
          reviewer.id === reviewerId
            ? ({ ...reviewer, [field]: event.detail } as AgentTestReviewer)
            : reviewer
        ),
      }))

  const addReviewer = (type: ReviewerType) => {
    const reviewer = REVIEWERS[type].create(Helpers.uuid())
    reviewerIdsOpenOnAdd = new Set([...reviewerIdsOpenOnAdd, reviewer.id])
    onUpdateCase(testCase => ({
      ...testCase,
      reviewers: [...testCase.reviewers, reviewer],
    }))
  }

  const removeReviewer = (reviewerId: string) => {
    onUpdateCase(testCase => ({
      ...testCase,
      reviewers: testCase.reviewers.filter(
        (reviewer: AgentTestReviewer) => reviewer.id !== reviewerId
      ),
    }))
  }

  const truncate = (value: string, max: number) =>
    value.length <= max ? value : `${value.slice(0, Math.max(0, max - 1))}…`

  const reviewerSummaryTitle = (reviewer: AgentTestReviewer) => {
    const label = REVIEWERS[reviewer.type].label
    const summary = describeReviewer(reviewer)
    return summary ? `${label} · ${truncate(summary, 48)}` : label
  }
</script>

<div class="reviewers">
  <div class="reviewer-chooser">
    {#each REVIEWER_TYPES as type (type)}
      <button
        class="reviewer-option"
        type="button"
        onclick={() => addReviewer(type)}
      >
        <span class="reviewer-option-title">{REVIEWERS[type].label}</span>
        <span class="reviewer-option-description">
          {REVIEWERS[type].description}
        </span>
      </button>
    {/each}
  </div>

  {#if selectedCase.reviewers.length === 0}
    <div class="reviewer-empty">
      <Body size="S" color="var(--spectrum-global-color-gray-600)">
        No reviewers yet.
      </Body>
    </div>
  {/if}

  {#each selectedCase.reviewers as reviewer (reviewer.id)}
    {@const def = REVIEWERS[reviewer.type]}
    <div class="reviewer-card">
      <DetailSummary
        name={reviewerSummaryTitle(reviewer)}
        initiallyShow={reviewerIdsOpenOnAdd.has(reviewer.id)}
        padded={false}
      >
        <ActionButton
          slot="actions"
          quiet
          icon="trash"
          tooltip="Remove reviewer"
          on:click={() => removeReviewer(reviewer.id)}
        />

        {#if def.inputType === "textarea"}
          <TextArea
            label={reviewer.type === "exact_match"
              ? "Expected final response"
              : reviewer.type === "llm_judge"
                ? "Rubric"
                : "Text"}
            value={reviewer[def.contentField] as string}
            height={reviewer.type === "llm_judge" ? 110 : 90}
            on:change={updateReviewerField(reviewer.id, def.contentField)}
          />
        {:else if def.inputType === "input"}
          <Input
            label="Text to find"
            value={reviewer[def.contentField] as string}
            on:change={updateReviewerField(reviewer.id, def.contentField)}
          />
        {:else if def.inputType === "select"}
          <Select
            label="Tool name"
            value={reviewer[def.contentField] as string}
            options={toolOptions}
            getOptionLabel={o => o.label}
            getOptionValue={o => o.value}
            placeholder="Choose a tool"
            on:change={updateReviewerField(reviewer.id, def.contentField)}
          />
        {/if}
      </DetailSummary>
    </div>
  {/each}
</div>

<style>
  .reviewers {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }

  .reviewer-chooser {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: var(--spacing-s);
  }

  .reviewer-option,
  .reviewer-card {
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 8px;
    background: var(--background-alt);
    overflow: hidden;
  }

  .reviewer-option {
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: flex-start;
    padding: var(--spacing-s);
    cursor: pointer;
    text-align: left;
    transition:
      border-color 130ms ease,
      background 130ms ease;
  }

  .reviewer-option:hover {
    border-color: var(--spectrum-global-color-gray-400);
    background: var(--background);
  }

  .reviewer-option-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--spectrum-global-color-gray-900);
  }

  .reviewer-option-description {
    font-size: 12px;
    color: var(--spectrum-global-color-gray-600);
    line-height: 1.4;
  }

  .reviewer-empty {
    padding: var(--spacing-s);
    border: 1px dashed var(--spectrum-global-color-gray-300);
    border-radius: 8px;
  }

  .reviewer-card :global(.property-group-container) {
    border-bottom: none;
  }

  .reviewer-card :global(.property-group-name) {
    padding: var(--spacing-s) var(--spacing-m);
    min-height: 40px;
  }

  .reviewer-card :global(.property-group-name .name) {
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
  }

  .reviewer-card :global(.property-panel.show) {
    padding: 0 var(--spacing-m) var(--spacing-m);
    gap: var(--spacing-s);
  }
</style>
