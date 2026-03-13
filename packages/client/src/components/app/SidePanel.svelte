<script>
  import { getContext } from "svelte"

  const component = getContext("component")
  const { styleable, sidePanelStore, builderStore, dndIsDragging } =
    getContext("sdk")

  export let onClose
  export let ignoreClicksOutside
  export let size

  // Automatically show and hide the side panel when inside the builder.
  // For some unknown reason, svelte reactivity breaks if we reference the
  // reactive variable "open" inside the following expression, or if we define
  // "open" above this expression.
  $: {
    if ($builderStore.inBuilder) {
      if (
        $component.inSelectedPath &&
        $sidePanelStore.contentId !== $component.id
      ) {
        sidePanelStore.actions.open($component.id)
      } else if (
        !$component.inSelectedPath &&
        $sidePanelStore.contentId === $component.id &&
        !$dndIsDragging
      ) {
        sidePanelStore.actions.close()
      }
    }
  }

  // Derive visibility
  $: open = $sidePanelStore.contentId === $component.id

  // Derive a render key which is only changed whenever this panel is made
  // visible after being hidden. We need to key the content to avoid showing
  // stale data when re-revealed, but we cannot hide the content altogether
  // when hidden as this breaks ejection.
  let renderKey = null
  $: {
    if (open) {
      sidePanelStore.actions.setIgnoreClicksOutside(ignoreClicksOutside)
      renderKey = Math.random()
    }
  }

  // When a side panel instance has a configured default size (from its
  // component settings in the builder), apply it when this panel becomes
  // visible. In the builder we want live-updating when the instance setting
  // is changed, so always apply the instance size while in the builder. In
  // runtime, only apply the instance size if an action didn't explicitly set
  // a size.
  $: if (open && size) {
    if ($builderStore.inBuilder) {
      sidePanelStore.actions.setSize(size)
    } else {
      if ($sidePanelStore.size == null) {
        sidePanelStore.actions.setSize(size)
      }
    }
  }

  const handleSidePanelClose = async () => {
    if (onClose) {
      await onClose()
    }
  }

  // Read the background properties directly from the component style data so
  // we can apply them to the outer container (making the entire panel,
  // including the header, adopt the chosen background). Using Svelte
  // reactivity avoids the infinite-loop issues of a MutationObserver approach.
  $: _normalStyles = $component.styles?.normal || {}
  $: panelBgColor = _normalStyles["background"] || ""
  // Gradient values end with a trailing ";" in the stored data — strip it.
  $: panelBgImage = (_normalStyles["background-image"] || "").replace(
    /;\s*$/,
    ""
  )
  $: hasPanelBg = !!(panelBgColor || panelBgImage)

  // Strip background from the inner element's styles so the container
  // background shows through without being double-applied.
  $: innerStyles = hasPanelBg
    ? {
        ...$component.styles,
        normal: Object.fromEntries(
          Object.entries(_normalStyles).filter(
            ([k]) => k !== "background" && k !== "background-image"
          )
        ),
      }
    : $component.styles

  // Apply / remove background on the container whenever open or bg changes.
  $: applyContainerBackground(open, panelBgColor, panelBgImage)

  function applyContainerBackground(isOpen, bgColor, bgImage) {
    const container = document.getElementById("side-panel-container")
    if (!container) return
    if (isOpen && (bgColor || bgImage)) {
      // Set color and image separately so gradients aren't lost
      if (bgColor) {
        container.style.background = bgColor
      } else {
        container.style.removeProperty("background")
      }
      if (bgImage) {
        container.style.backgroundImage = bgImage
      } else {
        container.style.removeProperty("background-image")
      }
    } else {
      container.style.removeProperty("background")
      container.style.removeProperty("background-image")
    }
  }

  const showInSidePanel = (el, visible) => {
    const update = visible => {
      const target = document.getElementById("side-panel-container")
      const node = el
      if (visible) {
        if (!target.contains(node)) {
          target.appendChild(node)
        }
      } else {
        if (target.contains(node)) {
          target.removeChild(node)
          handleSidePanelClose()
          // Ensure container background is cleared when panel is hidden
          applyContainerBackground(false, "", "")
        }
      }
    }

    // Apply initial visibility
    update(visible)

    return {
      update,
      destroy: () => update(false),
    }
  }
</script>

<div
  use:styleable={innerStyles}
  use:showInSidePanel={open}
  class="side-panel"
  class:open
>
  {#key renderKey}
    <slot />
  {/key}
</div>

<style>
  .side-panel {
    flex: 1 1 auto;
    display: none;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-xl);
  }
  .side-panel.open {
    display: flex;
  }
  .side-panel :global(.component > *) {
    max-width: 100%;
  }
</style>
