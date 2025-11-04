<script lang="ts">
  import { marked } from "marked"

  const HTML_TAG_REGEX = /<([A-Za-z][\w-]*)(\s[^<>]*)?>/i

  export let description: string | undefined = undefined
  export let label: string | undefined = "Description"
  export let placeholder = "No description provided"
  export let maxHeight = "240px"
  export let groupLabel: string | undefined = undefined
  export let ariaLive: "off" | "polite" | "assertive" = "polite"
  export let className = ""

  const toHtml = (value: string | undefined) => {
    const content = (value || "").trim()
    if (!content) {
      return ""
    }
    return HTML_TAG_REGEX.test(content)
      ? content
      : marked.parse(content, { async: false })
  }

  $: descriptionHtml = toHtml(description)
  $: resolvedGroupLabel = groupLabel ?? label ?? undefined
</script>

<div
  class={`${className}`.trim()}
  role={resolvedGroupLabel ? "group" : undefined}
  aria-label={resolvedGroupLabel}
>
  {#if label}
    <span class="spectrum-FieldLabel spectrum-FieldLabel--sizeM">{label}</span>
  {/if}
  {#if descriptionHtml}
    <div
      class="description-content"
      aria-live={ariaLive}
      style:max-height={maxHeight}
    >
      {@html descriptionHtml}
    </div>
  {:else}
    <div class="description-content">{placeholder}</div>
  {/if}
</div>

<style>
  .description-content {
    padding-left: 12px;
    padding-right: 12px;
    border: 1px solid var(--grey-3);
    border-radius: 4px;
    overflow: auto;
    color: var(--grey-8);
    background-color: black;
    font-family: monospace;
  }
</style>
