<script lang="ts">
  import { ActionButton, Helpers, Icon, notifications } from "@budibase/bbui"
  import { formatToolName } from "@budibase/frontend-core"
  import LogStepPill from "./LogStepPill.svelte"
  import { formatStructuredContent } from "./utils"

  type ToolItem = {
    name: string
    displayName?: string
    toolCallId?: string
  }

  type Props = {
    item: ToolItem
    content: string
    kindLabel?: string
    copyTooltip?: string
  }

  let {
    item,
    content,
    kindLabel,
    copyTooltip = "Copy content",
  }: Props = $props()
  let displayName = $derived(formatToolName(item.name, item.displayName))
  let formattedContent = $derived(formatStructuredContent(content))

  async function copyToClipboard(value: string) {
    await Helpers.copyToClipboard(value)
    notifications.success("Copied to clipboard")
  }
</script>

<article class="tool-card">
  <div class="tool-card-header">
    <div class="tool-card-meta">
      <div class="tool-card-title">
        <Icon name="Wrench" size="S" />
        <span class="tool-card-name">{displayName.primary}</span>
      </div>
      {#if displayName.secondary}
        <span class="tool-card-subtitle">{displayName.secondary}</span>
      {/if}
      {#if item.toolCallId}
        <span class="tool-card-id" title={item.toolCallId}>
          {item.toolCallId}
        </span>
      {/if}
    </div>
    <div class="tool-card-actions">
      {#if kindLabel}
        <LogStepPill>{kindLabel}</LogStepPill>
      {/if}
      <ActionButton
        quiet
        icon="Copy"
        size="S"
        tooltip={copyTooltip}
        on:click={() => copyToClipboard(formattedContent)}
      />
    </div>
  </div>
  <div class="content-surface">
    <pre><code>{formattedContent}</code></pre>
  </div>
</article>

<style>
  .tool-card,
  .tool-card-meta {
    display: flex;
    flex-direction: column;
  }

  .tool-card,
  .tool-card-header,
  .tool-card-meta,
  .tool-card-id {
    min-width: 0;
  }

  .tool-card-id {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .tool-card-subtitle,
  .tool-card-id {
    font-size: 11px;
    color: var(--spectrum-global-color-gray-600);
  }

  .tool-card {
    gap: 8px;
  }

  .tool-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  .tool-card-actions {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
  }

  .tool-card-meta {
    align-items: flex-start;
    gap: 6px;
  }

  .tool-card-title {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
  }

  .tool-card-name {
    font-size: 12px;
    font-weight: 600;
    color: var(--spectrum-global-color-gray-800);
  }

  .tool-card-id {
    max-width: 240px;
  }

  .content-surface {
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 6px;
    overflow: auto;
    max-height: 220px;
    background: var(--background);
    scrollbar-width: thin;
  }

  .content-surface::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  .content-surface::-webkit-scrollbar-track {
    background: transparent;
  }

  .content-surface::-webkit-scrollbar-thumb {
    background: var(--spectrum-global-color-gray-300);
    border-radius: 3px;
  }

  .content-surface pre {
    margin: 0;
    padding: 10px;
    font-size: 12px;
    line-height: 1.55;
    color: var(--spectrum-global-color-gray-800);
    font-family: var(--font-mono, "SF Mono", "Fira Code", monospace);
    white-space: pre-wrap;
    word-break: break-word;
  }

  @media (max-width: 900px) {
    .tool-card-header {
      align-items: flex-start;
      flex-direction: column;
    }

    .tool-card-meta {
      width: 100%;
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
    }

    .tool-card-id {
      max-width: 100%;
    }
  }
</style>
