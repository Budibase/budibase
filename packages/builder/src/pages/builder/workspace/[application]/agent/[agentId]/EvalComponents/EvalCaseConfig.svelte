<script lang="ts">
  import {
    ActionButton,
    Body,
    Divider,
    Input,
    TextArea,
  } from "@budibase/bbui"
  import type { AgentEvalCase } from "@budibase/types"

  type Props = {
    selectedCase: AgentEvalCase
    onUpdateCase: (
      updater: (testCase: AgentEvalCase) => AgentEvalCase
    ) => void
  }

  let { selectedCase, onUpdateCase }: Props = $props()

  const updateAssertionList = (
    key: "contains" | "notContains",
    index: number,
    value: string
  ) => {
    onUpdateCase(testCase => {
      const currentValues = [...(testCase.assertions[key] || [])]
      currentValues[index] = value
      return {
        ...testCase,
        assertions: {
          ...testCase.assertions,
          [key]: currentValues,
        },
      }
    })
  }

  const addAssertionLine = (key: "contains" | "notContains") => {
    onUpdateCase(testCase => ({
      ...testCase,
      assertions: {
        ...testCase.assertions,
        [key]: [...(testCase.assertions[key] || []), ""],
      },
    }))
  }

  const removeAssertionLine = (
    key: "contains" | "notContains",
    index: number
  ) => {
    onUpdateCase(testCase => ({
      ...testCase,
      assertions: {
        ...testCase.assertions,
        [key]: (testCase.assertions[key] || []).filter(
          (_, itemIndex) => itemIndex !== index
        ),
      },
    }))
  }
</script>

<div class="config">
  <div class="config-fields">
    <Input
      label="Case name"
      value={selectedCase.name}
      on:change={event =>
        onUpdateCase(testCase => ({
          ...testCase,
          name: event.detail,
        }))}
    />

    <TextArea
      label="Prompt"
      value={selectedCase.prompt}
      height={140}
      on:change={event =>
        onUpdateCase(testCase => ({
          ...testCase,
          prompt: event.detail,
        }))}
    />

    <Divider size="S" noMargin />

    <TextArea
      label="Exact match"
      value={selectedCase.assertions.exact}
      height={80}
      on:change={event =>
        onUpdateCase(testCase => ({
          ...testCase,
          assertions: {
            ...testCase.assertions,
            exact: event.detail,
          },
        }))}
    />

    <div class="assertion-group">
      <div class="assertion-header">
        <Body size="S" color="var(--spectrum-global-color-gray-900)">
          Contains
        </Body>
        <ActionButton
          quiet
          icon="plus"
          on:click={() => addAssertionLine("contains")}
        >
          Add line
        </ActionButton>
      </div>
      {#each selectedCase.assertions.contains || [] as value, index (index)}
        <div class="assertion-row">
          <Input
            {value}
            on:change={event =>
              updateAssertionList("contains", index, event.detail)}
          />
          <ActionButton
            quiet
            icon="x"
            tooltip="Remove"
            on:click={() => removeAssertionLine("contains", index)}
          />
        </div>
      {/each}
    </div>

    <div class="assertion-group">
      <div class="assertion-header">
        <Body size="S" color="var(--spectrum-global-color-gray-900)">
          Not contains
        </Body>
        <ActionButton
          quiet
          icon="plus"
          on:click={() => addAssertionLine("notContains")}
        >
          Add line
        </ActionButton>
      </div>
      {#each selectedCase.assertions.notContains || [] as value, index (index)}
        <div class="assertion-row">
          <Input
            {value}
            on:change={event =>
              updateAssertionList("notContains", index, event.detail)}
          />
          <ActionButton
            quiet
            icon="x"
            tooltip="Remove"
            on:click={() => removeAssertionLine("notContains", index)}
          />
        </div>
      {/each}
    </div>

    <Divider size="S" noMargin />

    <TextArea
      label="Judge criteria"
      value={selectedCase.assertions.judge?.rubric || ""}
      height={100}
      on:change={event =>
        onUpdateCase(testCase => ({
          ...testCase,
          assertions: {
            ...testCase.assertions,
            judge: event.detail
              ? {
                  rubric: event.detail,
                }
              : undefined,
          },
        }))}
    />
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

  .assertion-group {
    margin-top: var(--spacing-xs);
  }

  .assertion-header,
  .assertion-row {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
  }

  .assertion-header {
    justify-content: space-between;
  }
</style>
