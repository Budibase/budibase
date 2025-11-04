<script lang="ts">
  import "@spectrum-css/link/dist/index-vars.css"
  import { marked } from "marked"
  import sanitizeHtml from "sanitize-html"
  import type { IOptions } from "sanitize-html"

  const HTML_TAG_REGEX = /<([A-Za-z][\w-]*)(\s[^<>]*)?>/i

  const ALLOWED_TAGS = [
    "a",
    "abbr",
    "b",
    "blockquote",
    "br",
    "code",
    "del",
    "em",
    "hr",
    "i",
    "img",
    "li",
    "ol",
    "p",
    "pre",
    "span",
    "strong",
    "sub",
    "sup",
    "table",
    "tbody",
    "td",
    "th",
    "thead",
    "tr",
    "u",
    "ul",
  ]

  const ALLOWED_ATTRIBUTES: IOptions["allowedAttributes"] = {
    a: ["href", "target", "rel", "class"],
    span: ["class"],
    p: ["class"],
    code: ["class"],
    pre: ["class"],
    table: ["class"],
    img: ["src", "alt", "title"],
  }

  export let description: string | undefined = undefined
  export let label: string | undefined = "Description"
  export let placeholder = "No description provided"
  export let maxHeight = "240px"
  export let groupLabel: string | undefined = undefined
  export let ariaLive: "off" | "polite" | "assertive" = "polite"
  export let baseUrl: string | undefined = undefined
  export let className = ""

  const resolveBaseUrl = (value: string | undefined) => {
    const url = (value || "").trim()
    if (!url) {
      return undefined
    }
    try {
      return new URL(url).toString()
    } catch (_error) {
      return undefined
    }
  }

  const toAbsoluteUrl = (
    href: string | null | undefined,
    resolvedBase?: string
  ) => {
    if (!href) {
      return undefined
    }
    try {
      if (resolvedBase) {
        return new URL(href, resolvedBase).toString()
      }
      return new URL(href).toString()
    } catch (_error) {
      if (resolvedBase) {
        try {
          return new URL(href, resolvedBase).toString()
        } catch (_err) {
          return undefined
        }
      }
      return undefined
    }
  }

  const replaceLinks = (html: string, base?: string): string => {
    if (!html) {
      return html
    }
    const template = document.createElement("template")
    template.innerHTML = html

    const resolvedBase = resolveBaseUrl(base)

    template.content.querySelectorAll("a").forEach(anchor => {
      const href = anchor.getAttribute("href") || undefined
      if (resolvedBase) {
        const absolute = toAbsoluteUrl(href, resolvedBase)
        if (absolute) {
          anchor.setAttribute("href", absolute)
        }
      }
      anchor.setAttribute("target", "_blank")
      anchor.setAttribute("rel", "noopener noreferrer")
      anchor.classList.add("spectrum-Link", "spectrum-Link--sizeM")
    })

    return template.innerHTML
  }

  const toHtml = (value: string | undefined, base?: string) => {
    const content = (value || "").trim()
    if (!content) {
      return ""
    }
    const html = HTML_TAG_REGEX.test(content)
      ? content
      : marked.parse(content, { async: false })
    const withLinks = replaceLinks(html, base)
    return sanitizeHtml(withLinks, {
      allowedTags: ALLOWED_TAGS,
      allowedAttributes: ALLOWED_ATTRIBUTES,
      allowedSchemes: ["http", "https", "mailto", "tel"],
      allowProtocolRelative: false,
    })
  }

  $: descriptionHtml = toHtml(description, baseUrl)
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
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
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
