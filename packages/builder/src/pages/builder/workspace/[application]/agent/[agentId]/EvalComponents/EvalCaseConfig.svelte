<script lang="ts">
  import {
    Body,
    Button,
    Divider,
    Helpers,
    Input,
    Select,
    TextArea,
  } from "@budibase/bbui"
  import type { AgentEvalCase, AgentEvalReviewer } from "@budibase/types"
  import { getReviewerLabel } from "./utils"

  type ToolOption = { label: string; value: string }

  type Props = {
    selectedCase: AgentEvalCase
    toolOptions: ToolOption[]
    onUpdateCase: (
      _updater: (_testCase: AgentEvalCase) => AgentEvalCase
    ) => void
  }

  type ReviewerOption = {
    type: AgentEvalReviewer["type"]
    description: string
  }

  let { selectedCase, toolOptions, onUpdateCase }: Props = $props()

  let reviewerChooserOpen = $state(false)

  const updateField =
    (field: "name" | "input") => (event: CustomEvent<string>) =>
      onUpdateCase(testCase => ({ ...testCase, [field]: event.detail }))

  const updateReviewerField =
    (reviewerId: string, field: string) => (event: CustomEvent<string>) =>
      updateReviewer(
        reviewerId,
        current =>
          ({
            ...current,
            [field]: event.detail,
          }) as AgentEvalReviewer
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
    type: AgentEvalReviewer["type"]
  ): AgentEvalReviewer => {
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
    updater: (_reviewer: AgentEvalReviewer) => AgentEvalReviewer
  ) => {
    onUpdateCase(testCase => ({
      ...testCase,
      reviewers: testCase.reviewers.map(reviewer =>
        reviewer.id === reviewerId ? updater(reviewer) : reviewer
      ),
    }))
  }

  const addReviewer = (type: AgentEvalReviewer["type"]) => {
    onUpdateCase(testCase => ({
      ...testCase,
      reviewers: [...testCase.reviewers, createReviewer(type)],
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
</script>

<div class="config">
  <div class="config-fields">
    <Input
      label="Case name"
      value={selectedCase.name}
      on:change={updateField("name")}
    />

    <TextArea
      label="Input"
      value={selectedCase.input}
      height={140}
      on:change={updateField("input")}
    />

    <Divider size="S" noMargin />

    <div class="reviewer-header">
      <div>
        <Body size="S" color="var(--spectrum-global-color-gray-900)">
          Reviewer list
        </Body>
        <Body size="S" color="var(--spectrum-global-color-gray-600)">
          Add one or more checks for the final response or tool usage.
        </Body>
      </div>
      <Button secondary on:click={() => (reviewerChooserOpen = true)}>
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
        <div class="reviewer-card-header">
          <Body size="S" color="var(--spectrum-global-color-gray-900)">
            {getReviewerLabel(reviewer.type)}
          </Body>
          <button
            class="reviewer-remove"
            type="button"
            onclick={() => removeReviewer(reviewer.id)}
          >
            Remove
          </button>
        </div>

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
      </div>
    {/each}
  </div>
</div>

<style>
  .config {
    padding: var(--spacing-m) 0;
  }

  .config-fields {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }

  .reviewer-header {
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
    background: var(--background);
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
    background: var(--background-alt);
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

  .reviewer-card {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
    padding: var(--spacing-s);
  }

  .reviewer-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-s);
  }

  .reviewer-remove {
    border: none;
    background: transparent;
    color: var(--bb-blue);
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
    padding: 0;
  }
</style>
