<script lang="ts">
  import {
    ActionButton,
    Body,
    Button,
    DetailSummary,
    Helpers,
    Input,
    Select,
    TextArea,
  } from "@budibase/bbui"
  import type { AgentTestCase, AgentTestReviewer } from "@budibase/types"
  import { getReviewerLabel } from "./utils"

  type ToolOption = { label: string; value: string }

  type Props = {
    selectedCase: AgentTestCase
    toolOptions: ToolOption[]
    onUpdateCase: (
      _updater: (_testCase: AgentTestCase) => AgentTestCase
    ) => void
  }

  type ReviewerOption = {
    type: AgentTestReviewer["type"]
    description: string
  }

  let { selectedCase, toolOptions, onUpdateCase }: Props = $props()

  let reviewerChooserOpen = $state(false)
  let reviewerIdsOpenOnAdd = $state<Set<string>>(new Set())

  const updateReviewerField =
    (reviewerId: string, field: string) =>
    (event: CustomEvent<string | undefined>) =>
      updateReviewer(
        reviewerId,
        current =>
          ({
            ...current,
            [field]: event.detail,
          }) as AgentTestReviewer
      )

  const reviewerOptions: ReviewerOption[] = [
    {
      type: "exact_match",
      description: "Require the final response to exactly match some text.",
    },
    {
      type: "contains_text",
      description: "Require the final response to include some text.",
    },
    {
      type: "llm_judge",
      description: "Grade the response against a free-form rubric.",
    },
    {
      type: "tool_used",
      description: "Pass when a specific tool was used during the run.",
    },
  ]

  const createReviewer = (
    type: AgentTestReviewer["type"]
  ): AgentTestReviewer => {
    const id = Helpers.uuid()

    switch (type) {
      case "exact_match":
      case "contains_text":
        return {
          id,
          type,
          text: "",
        }
      case "llm_judge":
        return {
          id,
          type,
          rubric: "",
        }
      case "tool_used":
        return {
          id,
          type,
          tool: "",
        }
    }
  }

  const updateReviewer = (
    reviewerId: string,
    updater: (_reviewer: AgentTestReviewer) => AgentTestReviewer
  ) => {
    onUpdateCase(testCase => ({
      ...testCase,
      reviewers: testCase.reviewers.map(reviewer =>
        reviewer.id === reviewerId ? updater(reviewer) : reviewer
      ),
    }))
  }

  const addReviewer = (type: AgentTestReviewer["type"]) => {
    const reviewer = createReviewer(type)
    reviewerIdsOpenOnAdd = new Set([...reviewerIdsOpenOnAdd, reviewer.id])
    onUpdateCase(testCase => ({
      ...testCase,
      reviewers: [...testCase.reviewers, reviewer],
    }))
    reviewerChooserOpen = false
  }

  const removeReviewer = (reviewerId: string) => {
    onUpdateCase(testCase => ({
      ...testCase,
      reviewers: testCase.reviewers.filter(
        reviewer => reviewer.id !== reviewerId
      ),
    }))
  }

  const truncate = (value: string, max: number) => {
    const t = value.trim()
    if (t.length <= max) {
      return t
    }
    return `${t.slice(0, Math.max(0, max - 1))}…`
  }

  const reviewerSummaryTitle = (reviewer: AgentTestReviewer) => {
    const label = getReviewerLabel(reviewer.type)
    switch (reviewer.type) {
      case "tool_used":
        return reviewer.tool ? `${label} · ${reviewer.tool}` : label
      case "exact_match":
      case "contains_text":
        return reviewer.text
          ? `${label} · ${truncate(reviewer.text, 48)}`
          : label
      case "llm_judge":
        return reviewer.rubric
          ? `${label} · ${truncate(reviewer.rubric, 48)}`
          : label
      default:
        return label
    }
  }
</script>

<div class="reviewers">
  <div class="reviewer-toolbar">
    <Body size="S" color="var(--spectrum-global-color-gray-600)">
      Add checks for the final response or tool usage.
    </Body>
    <Button
      secondary
      on:click={() => (reviewerChooserOpen = !reviewerChooserOpen)}
    >
      Add reviewer
    </Button>
  </div>

  {#if reviewerChooserOpen}
    <div class="reviewer-chooser">
      {#each reviewerOptions as option (option.type)}
        <button
          class="reviewer-option"
          type="button"
          onclick={() => addReviewer(option.type)}
        >
          <span class="reviewer-option-title">
            {getReviewerLabel(option.type)}
          </span>
          <span class="reviewer-option-description">
            {option.description}
          </span>
        </button>
      {/each}
    </div>
  {/if}

  {#if selectedCase.reviewers.length === 0}
    <div class="reviewer-empty">
      <Body size="S" color="var(--spectrum-global-color-gray-600)">
        No reviewers yet.
      </Body>
    </div>
  {/if}

  {#each selectedCase.reviewers as reviewer (reviewer.id)}
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

        {#if reviewer.type === "exact_match"}
          <TextArea
            label="Expected final response"
            value={reviewer.text}
            height={90}
            on:change={updateReviewerField(reviewer.id, "text")}
          />
        {:else if reviewer.type === "contains_text"}
          <Input
            label="Text to find"
            value={reviewer.text}
            on:change={updateReviewerField(reviewer.id, "text")}
          />
        {:else if reviewer.type === "llm_judge"}
          <TextArea
            label="Rubric"
            value={reviewer.rubric}
            height={110}
            on:change={updateReviewerField(reviewer.id, "rubric")}
          />
        {:else if reviewer.type === "tool_used"}
          <Select
            label="Tool name"
            value={reviewer.tool}
            options={toolOptions}
            getOptionLabel={o => o.label}
            getOptionValue={o => o.value}
            placeholder="Choose a tool"
            on:change={updateReviewerField(reviewer.id, "tool")}
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

  .reviewer-toolbar {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--spacing-m);
  }

  .reviewer-chooser {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
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
