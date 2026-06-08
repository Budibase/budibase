<script>
  import { getContext, tick } from "svelte"
  import { get } from "svelte/store"

  const component = getContext("component")
  const { styleable, sidePanelStore, builderStore, dndIsDragging } =
    getContext("sdk")

  export let onClose
  export let ignoreClicksOutside
  export let size
  export let position

  // Register this panel's default position synchronously during setup so that
  // open() can apply it atomically with contentId. The DOM-level forced reflow
  // in Layout.svelte now handles the animation bug, but atomic open still needs
  // the default position for correct initial placement.
  const _initPos = position === ":default" ? null : position
  sidePanelStore.actions.registerDefaultPosition($component.id, _initPos)

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
  // stale data when re-revealing a side panel that was closed, but we cannot
  // hide the content altogether when hidden as this breaks ejection.
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
  //
  // A size value of ":default" means "inherit the component's configured size"
  // and should not override it.
  $: {
    const effectiveSize = size === ":default" ? null : size
    if (open && effectiveSize) {
      if ($builderStore.inBuilder) {
        // Avoid a reactive churn loop by only updating the store if the size
        // actually changes. In builder mode, this block re-runs often as the
        // component re-renders, so re-setting the same value causes unnecessary
        // store updates.
        if ($sidePanelStore.size !== effectiveSize) {
          sidePanelStore.actions.setSize(effectiveSize)
        }
      } else if ($sidePanelStore.size == null) {
        sidePanelStore.actions.setSize(effectiveSize)
      }
    }
  }

  // Same as size: apply configured side panel position when visible unless an
  // action explicitly set an override in runtime.
  //
  // A position value of ":default" means "inherit the component's configured
  // position" and should not override it.
  $: {
    const effectivePosition = position === ":default" ? null : position
    // Keep the registry up-to-date whenever the prop changes (e.g. builder
    // live-edits), so the next open() call uses the current default.
    sidePanelStore.actions.registerDefaultPosition(
      $component.id,
      effectivePosition
    )
    if (open && effectivePosition) {
      if ($builderStore.inBuilder) {
        if ($sidePanelStore.position !== effectivePosition) {
          sidePanelStore.actions.setPosition(effectivePosition)
        }
      }
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

  const handleSidePanelClose = async () => {
    if (onClose) {
      await onClose()
    }
  }

  // When the panel is closed, we need to clear the shared container background so
  // that it doesn't affect other panels that use the same container.
  // We wait until the next tick to clear the background so that if another panel
  // is opening at the same time, it can set the background for the shared
  // container first. If no panel is open after that, clear the shared container
  // background.
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

          // Wait so any other panel that is opening can set its background
          // first. If no panel is open after that, clear the shared container
          // background.
          tick().then(() => {
            if (!get(sidePanelStore).contentId) {
              applyContainerBackground(false, "", "")
            }
          })
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

<!-- switched to use innerstyles for the inner content to avoid double-applying
background styles that are meant to be on the container. This also solves the flickering
that happens whn a closed panel clears its background while a new one is opened. -->
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
