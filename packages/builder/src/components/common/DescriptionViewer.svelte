<script lang="ts">
  import { onMount } from "svelte"
  import "@spectrum-css/link/dist/index-vars.css"
  import { MarkdownViewer } from "@budibase/bbui"

  const COLLAPSED_HEIGHT_EM = 5

  export let description: string | undefined = undefined
  export let label: string | undefined = "Description"
  export let placeholder = "No description provided"
  export let baseUrl: string | undefined = undefined

  let contentEl: HTMLDivElement | null = null
  let collapsible = false
  let expanded = false
  let resizeObserver: ResizeObserver | undefined

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

  interface LinkEnhancerParams {
    baseUrl?: string
    contentKey?: string
    onMutate?: () => void
  }

  const getCollapsedHeightPx = () => {
    if (!contentEl) {
      return COLLAPSED_HEIGHT_EM * 16
    }
    const fontSize = parseFloat(getComputedStyle(contentEl).fontSize || "16")
    if (Number.isNaN(fontSize)) {
      return COLLAPSED_HEIGHT_EM * 16
    }
    return fontSize * COLLAPSED_HEIGHT_EM
  }

  const updateCollapsible = () => {
    if (!contentEl) {
      collapsible = false
      expanded = false
      return
    }
    const shouldCollapse = contentEl.scrollHeight > getCollapsedHeightPx()
    if (shouldCollapse !== collapsible) {
      collapsible = shouldCollapse
    }
    if (!shouldCollapse) {
      expanded = false
    }
  }

  const toggleExpanded = () => {
    if (!collapsible) {
      return
    }
    expanded = !expanded
  }

  onMount(() => {
    resizeObserver = new ResizeObserver(() => updateCollapsible())
    if (contentEl) {
      resizeObserver.observe(contentEl)
      updateCollapsible()
    }
    return () => {
      resizeObserver?.disconnect()
    }
  })

  $: if (resizeObserver && contentEl) {
    resizeObserver.disconnect()
    resizeObserver.observe(contentEl)
    updateCollapsible()
  }

  const replaceWithSpan = (anchor: HTMLAnchorElement) => {
    const span = anchor.ownerDocument?.createElement("span")
    if (!span) {
      return
    }
    while (anchor.firstChild) {
      span.appendChild(anchor.firstChild)
    }
    anchor.replaceWith(span)
  }

  const isHashLink = (href?: string | null) =>
    typeof href === "string" && href.trim().startsWith("#")

  const enhanceLinks = (node: HTMLElement, params: LinkEnhancerParams = {}) => {
    let { baseUrl: currentBase, onMutate } = params

    const apply = () => {
      const resolvedBase = resolveBaseUrl(currentBase)
      node.querySelectorAll("a").forEach(anchor => {
        const href = anchor.getAttribute("href") || undefined
        if (isHashLink(href)) {
          replaceWithSpan(anchor)
          return
        }
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
      onMutate?.()
    }

    const observer = new MutationObserver(apply)
    observer.observe(node, { childList: true, subtree: true })
    apply()

    return {
      update(newParams?: LinkEnhancerParams) {
        currentBase = newParams?.baseUrl
        onMutate = newParams?.onMutate
        apply()
      },
      destroy() {
        observer.disconnect()
      },
    }
  }
</script>

<div>
  {#if label}
    <span class="spectrum-FieldLabel spectrum-FieldLabel--sizeM">{label}</span>
  {/if}
  <div
    class="description-viewer"
    class:description-viewer--expanded={expanded}
    style={`--description-collapsed-height: ${COLLAPSED_HEIGHT_EM}em;`}
  >
    <div
      class="description-content"
      class:description-content--collapsed={!expanded && collapsible}
      bind:this={contentEl}
      use:enhanceLinks={{
        baseUrl,
        contentKey: description,
        onMutate: updateCollapsible,
      }}
    >
      <MarkdownViewer value={description || placeholder} />
    </div>
    {#if collapsible}
      <div
        class="description-viewer__fade"
        aria-hidden={!expanded}
        hidden={expanded}
      />
      <button
        type="button"
        class="description-viewer__toggle"
        on:click={toggleExpanded}
      >
        {#if expanded}
          Show less
        {:else}
          Show more
        {/if}
      </button>
    {/if}
  </div>
</div>

<style>
  .description-viewer {
    position: relative;
    padding: 12px;
    border: 1px solid var(--grey-3);
    border-radius: 4px;
    color: var(--grey-8);
    background-color: var(--background);
    font-family: monospace;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .description-content {
    overflow: auto;
  }

  .description-content--collapsed {
    max-height: var(--description-collapsed-height);
    overflow: hidden;
    -webkit-mask-image: linear-gradient(
      180deg,
      rgba(0, 0, 0, 1) 65%,
      rgba(0, 0, 0, 0) 100%
    );
    mask-image: linear-gradient(
      180deg,
      rgba(0, 0, 0, 1) 65%,
      rgba(0, 0, 0, 0) 100%
    );
  }

  .description-viewer__fade {
    position: absolute;
    pointer-events: none;
    inset: calc(var(--description-collapsed-height) - 2em) 0 auto 0;
    height: 2em;
    background: linear-gradient(180deg, transparent 0%, var(--background) 100%);
  }

  .description-viewer__toggle {
    align-self: flex-end;
    border: none;
    background: none;
    color: var(--primaryColor, var(--spectrum-global-color-blue-600));
    cursor: pointer;
    font-weight: 500;
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
