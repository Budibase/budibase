import type { Readable } from "svelte/store"

type TransitionDirection = "in" | "out"

interface MoveToExpandedConfig {
  expanded: Readable<boolean>
  collapsedTargetSelector: string
  expandedTargetSelector: string
}

interface LandscapeTransitionConfig {
  getCollapsedElement: () => HTMLElement | undefined
  onTransitioningChange?: (isTransitioning: boolean) => void
}

interface LandscapeTransitionParams {
  direction: TransitionDirection
}

export const LANDSCAPE_EXPANDED_MARGIN = 0.15
export const LANDSCAPE_EXPANDED_SIZE = 0.7
export const LANDSCAPE_EXPANSION_DURATION = 260

export const createMoveToExpandedAction = ({
  expanded,
  collapsedTargetSelector,
  expandedTargetSelector,
}: MoveToExpandedConfig) => {
  return (node: HTMLElement) => {
    let initialized = false

    const unsubscribe = expanded.subscribe(isExpanded => {
      // Skip the initial subscription call to avoid moving the node on mount.
      if (!initialized) {
        initialized = true
        return
      }

      if (isExpanded) {
        // Move into the expanded container after it has rendered.
        setTimeout(() => {
          const expandedTarget = document.querySelector(expandedTargetSelector)
          if (expandedTarget && node.parentNode !== expandedTarget) {
            expandedTarget.appendChild(node)
          }
        }, 0)
        return
      }

      const collapsedTarget = document.querySelector(collapsedTargetSelector)
      if (collapsedTarget && node.parentNode !== collapsedTarget) {
        collapsedTarget.appendChild(node)
      }
    })

    return {
      destroy() {
        unsubscribe()
      },
    }
  }
}

export const createLandscapeTransition = ({
  getCollapsedElement,
  onTransitioningChange,
}: LandscapeTransitionConfig) => {
  return (_node: HTMLElement, params: LandscapeTransitionParams) => {
    const collapsedElement = getCollapsedElement()
    if (!collapsedElement) {
      return { duration: LANDSCAPE_EXPANSION_DURATION }
    }

    const rect = collapsedElement.getBoundingClientRect()
    const startTop = rect.top
    const startRight = window.innerWidth - rect.right
    const startWidth = rect.width
    const startHeight = rect.height

    const endTop = window.innerHeight * LANDSCAPE_EXPANDED_MARGIN
    const endRight = window.innerWidth * LANDSCAPE_EXPANDED_MARGIN
    const endWidth = window.innerWidth * LANDSCAPE_EXPANDED_SIZE
    const endHeight = window.innerHeight * LANDSCAPE_EXPANDED_SIZE

    onTransitioningChange?.(true)

    if (params.direction === "out") {
      setTimeout(() => {
        onTransitioningChange?.(false)
      }, LANDSCAPE_EXPANSION_DURATION)
    }

    return {
      duration: LANDSCAPE_EXPANSION_DURATION,
      css: (t: number) => {
        // Ease in-out function and duration, taken from Drawer component.
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
        const currentTop = startTop + (endTop - startTop) * eased
        const currentRight = startRight + (endRight - startRight) * eased
        const currentWidth = startWidth + (endWidth - startWidth) * eased
        const currentHeight = startHeight + (endHeight - startHeight) * eased

        return `
          top: ${currentTop}px;
          right: ${currentRight}px;
          width: ${currentWidth}px;
          height: ${currentHeight}px;
        `
      },
    }
  }
}
