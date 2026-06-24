<script lang="ts">
  import { ActionButton, Helpers, Icon, notifications } from "@budibase/bbui"

  type Props = {
    title: string
    content: string
    copyTooltip: string
    subtitle?: string
    icon?: string
    variant?: "default" | "thinking" | "error"
  }

  let {
    title,
    content,
    copyTooltip,
    subtitle,
    icon,
    variant = "default",
  }: Props = $props()

  async function copyToClipboard(value: string) {
    await Helpers.copyToClipboard(value)
    notifications.success("Copied to clipboard")
  }
</script>

<div class="content-section">
  <div class="content-section-header">
    <div class="content-section-heading">
      {#if icon}
        <div
          class="section-icon"
          class:section-icon--thinking={variant === "thinking"}
          class:section-icon--error={variant === "error"}
        >
          <Icon name={icon} size="S" />
        </div>
      {/if}
      <div class="section-label-group">
        <h5 class="content-title">{title}</h5>
        {#if subtitle}
          <p class="content-subtitle">{subtitle}</p>
        {/if}
      </div>
    </div>
    <ActionButton
      quiet
      icon="Copy"
      size="S"
      tooltip={copyTooltip}
      on:click={() => copyToClipboard(content)}
    />
  </div>
  <div
    class="content-surface"
    class:content-surface--thinking={variant === "thinking"}
    class:content-surface--error={variant === "error"}
  >
    <pre><code>{content}</code></pre>
  </div>
</div>

<style>
  .content-section,
  .section-label-group {
    display: flex;
    flex-direction: column;
  }

  .content-section,
  .content-section-heading,
  .section-label-group {
    min-width: 0;
  }

  .content-section {
    gap: 8px;
  }

  .content-section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  .content-section-heading {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .section-label-group {
    gap: 2px;
  }

  .section-icon {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: var(--spectrum-global-color-gray-100);
    color: var(--spectrum-global-color-gray-700);
    border: 1px solid var(--spectrum-global-color-gray-200);
  }

  .section-icon--thinking {
    background: rgba(140, 161, 113, 0.14);
    border-color: rgba(140, 161, 113, 0.22);
    color: #6f8157;
  }

  .section-icon--error {
    background: rgba(214, 60, 60, 0.12);
    border-color: rgba(214, 60, 60, 0.2);
    color: var(--spectrum-global-color-red-700);
  }

  .content-title {
    margin: 0;
    font-size: 12px;
    font-weight: 600;
    color: var(--spectrum-global-color-gray-900);
  }

  .content-subtitle {
    margin: 0;
    font-size: 12px;
    color: var(--spectrum-global-color-gray-600);
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

  .content-surface--thinking {
    background: rgba(140, 161, 113, 0.08);
    border-color: rgba(140, 161, 113, 0.2);
  }

  .content-surface--error {
    background: rgba(214, 60, 60, 0.04);
    border-color: rgba(214, 60, 60, 0.2);
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
</style>
