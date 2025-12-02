<script lang="ts">
  import "@spectrum-css/link/dist/index-vars.css"
  import { MarkdownViewer } from "@budibase/bbui"

  export let description: string | undefined = undefined
  export let label: string | undefined = "Description"
  export let placeholder = "No description provided"
  export let baseUrl: string | undefined = undefined

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

  $: descriptionWithLinks = description
    ? replaceLinks(description, baseUrl)
    : ""
</script>

<div>
  {#if label}
    <span class="spectrum-FieldLabel spectrum-FieldLabel--sizeM">{label}</span>
  {/if}
  <div class="description-viewer">
    <MarkdownViewer value={descriptionWithLinks || placeholder} />
  </div>
</div>

<style>
  .description-viewer {
    padding: 12px;
    border: 1px solid var(--grey-3);
    border-radius: 4px;
    overflow: auto;
    color: var(--grey-8);
    background-color: var(--background);
    font-family: monospace;
  }

  /* Links */
  .description-viewer :global(a) {
    color: var(--primaryColor, var(--spectrum-global-color-blue-600));
    text-decoration: none;
  }
  .description-viewer :global(a:hover) {
    color: var(--primaryColorHover, var(--spectrum-global-color-blue-500));
  }
</style>
