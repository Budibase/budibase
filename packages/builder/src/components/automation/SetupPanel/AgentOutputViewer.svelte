<script lang="ts">
  import {
    Badge,
    Body,
    DetailSummary,
    Helpers,
    Icon,
    List,
    ListItem,
    MarkdownViewer,
    notifications,
  } from "@budibase/bbui"
  import JSONViewer, {
    type JSONViewerClickEvent,
  } from "@/components/common/JSONViewer.svelte"
  import type { AgentStepOutputs } from "@budibase/types"
  import type { ContentPart, ToolCallDisplay } from "@budibase/types"

  export let outputs: AgentStepOutputs

  function hasErrorOutput(output: unknown): boolean {
    return (
      typeof output === "object" &&
      output !== null &&
      "error" in output &&
      !("success" in output && (output as { success: boolean }).success)
    )
  }

  $: response = outputs.response || ""
  $: steps = outputs.steps || []
  $: allContentParts = steps.flatMap(
    step => (step.content || []) as ContentPart[]
  )

  $: toolCallParts = allContentParts.filter(
    (part): part is Extract<ContentPart, { type: "tool-call" }> =>
      part.type === "tool-call"
  )
  $: toolResultParts = allContentParts.filter(
    (part): part is Extract<ContentPart, { type: "tool-result" }> =>
      part.type === "tool-result"
  )

  $: toolResultsMap = new Map(
    toolResultParts.map(result => [result.toolCallId, result])
  )

  $: toolCallsDisplay = toolCallParts.map((call): ToolCallDisplay => {
    const result = toolResultsMap.get(call.toolCallId)
    const output = result?.output

    let status: ToolCallDisplay["status"]
    if (!result) {
      status = "failed"
    } else if (hasErrorOutput(output)) {
      status = "error"
    } else {
      status = "completed"
    }

    return {
      toolCallId: call.toolCallId,
      toolName: call.toolName,
      displayName: humanizeToolName(call.toolName),
      input: call.input,
      output,
      status,
    }
  })

  $: reasoningParts = allContentParts.filter(
    (part): part is Extract<ContentPart, { type: "reasoning" }> =>
      part.type === "reasoning"
  )
  $: console.log(steps)
  $: hasReasoning =
    reasoningParts.length > 0 || steps.some(step => step.reasoningText)

  function humanizeToolName(toolName: string): string {
    return toolName
      .replace(/_/g, " ")
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, str => str.toUpperCase())
      .trim()
  }

  function getReasoningText(): string {
    const parts: string[] = []
    // Get reasoning from content parts
    for (const part of reasoningParts) {
      parts.push(part.text)
    }
    // Also check step-level reasoningText
    for (const step of steps) {
      if (step.reasoningText) {
        parts.push(step.reasoningText)
      }
    }
    return parts.join("\n\n")
  }

  function copyToClipboard(text: string) {
    Helpers.copyToClipboard(text)
    notifications.success("Copied to clipboard")
  }

  const copyJsonValue = (event: JSONViewerClickEvent) => {
    try {
      const { value } = event.detail
      const serialised =
        typeof value === "string" ? value : JSON.stringify(value, null, 2)
      Helpers.copyToClipboard(serialised)
      notifications.success("Copied to clipboard")
    } catch (error) {
      notifications.error("Unable to copy value")
    }
  }

  const getStatusLabel = (status: ToolCallDisplay["status"]): string => {
    switch (status) {
      case "completed":
        return "Completed"
      case "error":
        return "Error"
      case "failed":
        return "Failed"
    }
  }

  const getStatusColor = (status: ToolCallDisplay["status"]): string => {
    switch (status) {
      case "completed":
        return "var(--spectrum-global-color-static-green-500)"
      case "error":
      case "failed":
        return "var(--spectrum-global-color-static-red-500)"
    }
  }

  let expandedTools = new Set<string>()

  function toggleTool(toolCallId: string) {
    if (expandedTools.has(toolCallId)) {
      expandedTools.delete(toolCallId)
    } else {
      expandedTools.add(toolCallId)
    }
    expandedTools = new Set(expandedTools)
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="agent-output-viewer">
  {#if response}
    <DetailSummary name="Agent response" initiallyShow padded>
      <div class="response-section">
        <div class="response-header">
          <Body size="S" weight="600">Final response</Body>
          <Icon
            name="copy"
            size="XS"
            hoverable
            on:click={() => copyToClipboard(response)}
            title="Copy response"
          />
        </div>
        <div class="response-text">
          <MarkdownViewer value={response} />
        </div>
      </div>
    </DetailSummary>
  {/if}

  {#if toolCallsDisplay.length > 0}
    <DetailSummary
      name={`Steps (${toolCallsDisplay.length})`}
      initiallyShow
      padded
    >
      <div class="steps-section">
        <List title={null}>
          {#each toolCallsDisplay as toolCall, index (toolCall.toolCallId)}
            {@const isExpanded = expandedTools.has(toolCall.toolCallId)}
            <div class="step-item" class:expanded={isExpanded}>
              <ListItem
                icon="StatusLight"
                iconColor={getStatusColor(toolCall.status)}
                title={toolCall.displayName}
                subtitle={toolCall.toolName}
                hoverable
                selected={isExpanded}
                on:click={() => toggleTool(toolCall.toolCallId)}
              >
                <svelte:fragment slot="right">
                  <Badge
                    size="S"
                    green={toolCall.status === "completed"}
                    red={toolCall.status === "failed" ||
                      toolCall.status === "error"}
                  >
                    {getStatusLabel(toolCall.status)}
                  </Badge>
                </svelte:fragment>
              </ListItem>
              {#if isExpanded}
                <div class="step-details">
                  <div class="detail-section">
                    <div class="detail-label">Input</div>
                    <JSONViewer
                      value={toolCall.input}
                      showCopyIcon
                      on:click-copy={copyJsonValue}
                    />
                  </div>
                  {#if toolCall.output !== undefined}
                    <div class="detail-section">
                      <div class="detail-label">Output</div>
                      <JSONViewer
                        value={toolCall.output}
                        showCopyIcon
                        on:click-copy={copyJsonValue}
                      />
                    </div>
                  {/if}
                </div>
              {/if}
            </div>
          {/each}
        </List>
      </div>
    </DetailSummary>
  {/if}

  {#if hasReasoning}
    <DetailSummary name="Reasoning" padded initiallyShow={false}>
      <div class="reasoning-text">
        <Body size="S">{getReasoningText()}</Body>
      </div>
    </DetailSummary>
  {/if}
</div>

<style>
  .agent-output-viewer {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
  }

  .response-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }

  .response-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .response-text {
    background-color: var(--spectrum-global-color-gray-75);
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: var(--border-radius-s);
    padding: var(--spacing-m);
    white-space: pre-wrap;
    word-break: break-word;
  }

  .step-item {
    display: flex;
    flex-direction: column;
    margin-bottom: var(--spacing-xs);
  }

  .step-details {
    padding: var(--spacing-m) var(--spacing-l) var(--spacing-l) var(--spacing-l);
    background-color: var(--spectrum-global-color-gray-50);
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-top: none;
    border-bottom-left-radius: var(--border-radius-s);
    border-bottom-right-radius: var(--border-radius-s);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
  }

  .step-item.expanded :global(.list-item) {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .steps-section :global(.list-item) {
    background: var(--spectrum-global-color-gray-75);
  }

  .detail-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .detail-label {
    color: var(--spectrum-global-color-gray-600);
    text-transform: uppercase;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  .reasoning-text {
    padding: var(--spacing-m);
    background-color: var(--spectrum-global-color-gray-75);
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: var(--border-radius-s);
    white-space: pre-wrap;
    word-break: break-word;
  }
</style>
