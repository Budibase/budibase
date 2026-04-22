<script lang="ts">
  import {
    ActionButton,
    Button,
    Helpers,
    Input,
    Select,
    TextArea,
  } from "@budibase/bbui"
  import type { AgentTestCase, AgentTestReviewer } from "@budibase/types"
  import {
    REVIEWERS,
    REVIEWER_TYPES,
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

  const reviewerTypeOptions = REVIEWER_TYPES.map(type => ({
    label: REVIEWERS[type].label,
    value: type,
    subtitle: REVIEWERS[type].description,
  }))

  const reviewerContentValue = (reviewer: AgentTestReviewer): string => {
    switch (reviewer.type) {
      case "exact_match":
      case "contains_text":
        return reviewer.text
      case "llm_judge":
        return reviewer.rubric
      case "tool_used":
        return reviewer.tool
    }
  }

  const setReviewerContent = (
    reviewer: AgentTestReviewer,
    value: string
  ): AgentTestReviewer => {
    switch (reviewer.type) {
      case "exact_match":
      case "contains_text":
        return { ...reviewer, text: value }
      case "llm_judge":
        return { ...reviewer, rubric: value }
      case "tool_used":
        return { ...reviewer, tool: value }
    }
  }

  const createReviewerOfType = (
    type: ReviewerType,
    reviewerId: string,
    initialValue = ""
  ): AgentTestReviewer => {
    switch (type) {
      case "exact_match":
        return { id: reviewerId, type, text: initialValue }
      case "contains_text":
        return { id: reviewerId, type, text: initialValue }
      case "llm_judge":
        return { id: reviewerId, type, rubric: initialValue }
      case "tool_used":
        return { id: reviewerId, type, tool: initialValue }
    }
  }

  const fieldLabel = (type: ReviewerType): string => {
    switch (type) {
      case "exact_match":
        return "Expected final response"
      case "contains_text":
        return "Required text"
      case "llm_judge":
        return "Review rubric"
      case "tool_used":
        return "Expected tool"
    }
  }

  const fieldPlaceholder = (type: ReviewerType): string => {
    switch (type) {
      case "exact_match":
        return "Paste the exact response you expect from the agent."
      case "contains_text":
        return "Enter the phrase that should appear in the response."
      case "llm_judge":
        return "Describe what a good answer should include, avoid, or explain."
      case "tool_used":
        return "Choose a tool"
    }
  }

  const updateReviewerField =
    (reviewerId: string) => (event: CustomEvent<string | undefined>) => {
      const nextValue = event.detail ?? ""
      onUpdateCase(testCase => ({
        ...testCase,
        reviewers: testCase.reviewers.map(reviewer =>
          reviewer.id === reviewerId
            ? setReviewerContent(reviewer, nextValue)
            : reviewer
        ),
      }))
    }

  const addReviewer = (type: ReviewerType = "llm_judge") => {
    const reviewer = REVIEWERS[type].create(Helpers.uuid())
    onUpdateCase(testCase => ({
      ...testCase,
      reviewers: [...testCase.reviewers, reviewer],
    }))
  }

  const removeReviewer = (reviewerId: string) => {
    onUpdateCase(testCase => ({
      ...testCase,
      reviewers: testCase.reviewers.filter(reviewer => reviewer.id !== reviewerId),
    }))

  }

  const changeReviewerType =
    (reviewerId: string) => (event: CustomEvent<ReviewerType | undefined>) => {
      const nextType = event.detail
      if (!nextType) return

    onUpdateCase(testCase => ({
      ...testCase,
      reviewers: testCase.reviewers.map(reviewer => {
        if (reviewer.id !== reviewerId || reviewer.type === nextType) {
          return reviewer
        }

        const previousValue = reviewerContentValue(reviewer).trim()
        const nextValue =
          nextType === "tool_used" &&
          !toolOptions.some(option => option.value === previousValue)
            ? ""
            : previousValue

        return createReviewerOfType(nextType, reviewer.id, nextValue)
      }),
    }))
    }
</script>

<div class="reviewers">
  {#if selectedCase.reviewers.length === 0}
    <div class="reviewer-empty">
      <span class="reviewer-empty-title">No test criteria yet</span>
      <span class="reviewer-empty-description">
        Add one or more criteria to check the agent response or required tool usage.
      </span>
    </div>
  {/if}

  {#each selectedCase.reviewers as reviewer (reviewer.id)}
    {@const def = REVIEWERS[reviewer.type]}
    <div class="reviewer-card">
      <div class="reviewer-card-header">
        <div class="reviewer-card-meta">
          <Select
            label="Criteria type"
            value={reviewer.type}
            options={reviewerTypeOptions}
            getOptionLabel={option => option.label}
            getOptionValue={option => option.value}
            getOptionSubtitle={option => option.subtitle}
            on:change={changeReviewerType(reviewer.id)}
          />
        </div>

        <ActionButton
          quiet
          icon="trash"
          tooltip="Remove test criteria"
          on:click={() => removeReviewer(reviewer.id)}
        />
      </div>

      <p class="reviewer-description">{def.description}</p>

      <div class="field">
        {#if def.inputType === "textarea"}
          <TextArea
            label={fieldLabel(reviewer.type)}
            value={reviewerContentValue(reviewer)}
            minHeight={reviewer.type === "llm_judge" ? 112 : 96}
            placeholder={fieldPlaceholder(reviewer.type)}
            updateOnChange
            on:change={updateReviewerField(reviewer.id)}
          />
        {:else if def.inputType === "input"}
          <Input
            label={fieldLabel(reviewer.type)}
            value={reviewerContentValue(reviewer)}
            placeholder={fieldPlaceholder(reviewer.type)}
            on:change={updateReviewerField(reviewer.id)}
          />
        {:else}
          <Select
            label={fieldLabel(reviewer.type)}
            value={reviewerContentValue(reviewer)}
            options={toolOptions}
            getOptionLabel={option => option.label}
            getOptionValue={option => option.value}
            placeholder={fieldPlaceholder(reviewer.type)}
            on:change={updateReviewerField(reviewer.id)}
          />
        {/if}
      </div>
    </div>
  {/each}

  <div class="add-reviewer">
    <Button secondary on:click={() => addReviewer()}>
      Add test criteria
    </Button>
  </div>
</div>

<style>
  .reviewers {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .reviewer-empty,
  .reviewer-card {
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 8px;
    background: var(--background-alt);
  }

  .reviewer-empty {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 14px 16px;
  }

  .reviewer-empty-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--ink);
  }

  .reviewer-empty-description {
    font-size: 12px;
    line-height: 1.5;
    color: var(--spectrum-global-color-gray-600);
  }

  .reviewer-card {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 12px;
    position: relative;
  }

  .reviewer-card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }

  .reviewer-card-meta {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
    flex: 1;
  }

  .reviewer-description {
    margin: 0;
    font-size: 12px;
    line-height: 1.45;
    color: var(--spectrum-global-color-gray-600);
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }

  .field :global(.spectrum-Field),
  .reviewer-card-meta :global(.spectrum-Field) {
    width: 100%;
  }

  .add-reviewer {
    align-self: flex-start;
  }
</style>
