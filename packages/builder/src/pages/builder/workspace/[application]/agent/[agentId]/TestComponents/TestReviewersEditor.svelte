<script lang="ts">
  import {
    ActionButton,
    Button,
    Helpers,
    Input,
    Select,
    TextArea,
  } from "@budibase/bbui"
  import type { AgentTestCase } from "@budibase/types"
  import {
    REVIEWERS,
    REVIEWER_TYPES,
    createReviewer,
    readReviewerContent,
    writeReviewerContent,
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
  }))

  const FIELD_LABEL: Record<ReviewerType, string> = {
    exact_match: "Expected final response",
    contains_text: "Required text",
    llm_judge: "Expected behaviour",
    tool_used: "Expected tool",
  }

  const FIELD_PLACEHOLDER: Record<ReviewerType, string> = {
    exact_match: "Paste the exact response you expect from the agent.",
    contains_text: "Enter the phrase that should appear in the response.",
    llm_judge: "Describe what a good answer should include, avoid, or explain.",
    tool_used: "Choose a tool",
  }

  const updateReviewerField =
    (reviewerId: string) => (event: CustomEvent<string | undefined>) => {
      const nextValue = event.detail ?? ""
      onUpdateCase(testCase => ({
        ...testCase,
        reviewers: testCase.reviewers.map(reviewer =>
          reviewer.id === reviewerId
            ? writeReviewerContent(reviewer, nextValue)
            : reviewer
        ),
      }))
    }

  const addReviewer = (type: ReviewerType = "llm_judge") => {
    onUpdateCase(testCase => ({
      ...testCase,
      reviewers: [
        ...testCase.reviewers,
        REVIEWERS[type].create(Helpers.uuid()),
      ],
    }))
  }

  const removeReviewer = (reviewerId: string) => {
    onUpdateCase(testCase => ({
      ...testCase,
      reviewers: testCase.reviewers.filter(
        reviewer => reviewer.id !== reviewerId
      ),
    }))
  }

  const changeReviewerType =
    (reviewerId: string) => (event: CustomEvent<ReviewerType | undefined>) => {
      const nextType = event.detail
      if (!nextType) return

      onUpdateCase(testCase => ({
        ...testCase,
        reviewers: testCase.reviewers.map(reviewer => {
          if (reviewer.id !== reviewerId) return reviewer

          const previousValue = readReviewerContent(reviewer).trim()
          const nextValue =
            nextType === "tool_used" &&
            !toolOptions.some(option => option.value === previousValue)
              ? ""
              : previousValue

          return createReviewer(nextType, reviewer.id, nextValue)
        }),
      }))
    }
</script>

<div class="reviewers">
  {#if selectedCase.reviewers.length === 0}
    <div class="reviewer-empty">
      <span class="reviewer-empty-title">No test criteria yet</span>
      <span class="reviewer-empty-description">
        Add one or more criteria to check the agent response or required tool
        usage.
      </span>
    </div>
  {/if}

  {#each selectedCase.reviewers as reviewer (reviewer.id)}
    {@const def = REVIEWERS[reviewer.type]}
    {@const label = FIELD_LABEL[reviewer.type]}
    {@const placeholder = FIELD_PLACEHOLDER[reviewer.type]}
    {@const value = readReviewerContent(reviewer)}
    <div class="reviewer-card">
      <div class="reviewer-card-header">
        <div class="reviewer-card-meta">
          <Select
            label="Criteria type"
            value={reviewer.type}
            options={reviewerTypeOptions}
            getOptionLabel={option => option.label}
            getOptionValue={option => option.value}
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

      <div class="field">
        {#if def.inputType === "textarea"}
          <TextArea
            {label}
            {value}
            minHeight={reviewer.type === "llm_judge" ? 112 : 96}
            {placeholder}
            updateOnChange
            on:change={updateReviewerField(reviewer.id)}
          />
        {:else if def.inputType === "input"}
          <Input
            {label}
            {value}
            {placeholder}
            on:change={updateReviewerField(reviewer.id)}
          />
        {:else}
          <Select
            {label}
            {value}
            options={toolOptions}
            getOptionLabel={option => option.label}
            getOptionValue={option => option.value}
            {placeholder}
            on:change={updateReviewerField(reviewer.id)}
          />
        {/if}
      </div>
    </div>
  {/each}

  <div class="add-reviewer">
    <Button secondary on:click={() => addReviewer()}>Add test criteria</Button>
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
    gap: 4px;
    padding: 12px;
    position: relative;
  }

  .reviewer-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .reviewer-card-meta {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
    flex: 0 1 50%;
    max-width: 50%;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .field :global(.spectrum-Field),
  .reviewer-card-meta :global(.spectrum-Field) {
    width: 100%;
  }

  .reviewer-card :global(.spectrum-Form-item.above) {
    gap: 4px;
  }

  .add-reviewer {
    align-self: flex-start;
  }
</style>
