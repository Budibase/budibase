import { get } from "svelte/store"
import { builderStore } from "../store"

/**
 * Helper to build a CSS string from a style object.
 */
const buildStyleString = (styleObject, customStyles) => {
  let str = ""
  Object.entries(styleObject || {}).forEach(([style, value]) => {
    if (style && value != null) {
      str += `${style}: ${value}; `
    }
  })
  return str + (customStyles || "")
}

/**
 * Applies styles to enrich the builder preview.
 * Applies styles to highlight the selected component, and allows pointer
 * events for any selectable components (overriding the blanket ban on pointer
 * events in the iframe HTML).
 */
const addBuilderPreviewStyles = (node, styleString, componentId) => {
  if (componentId === get(builderStore).selectedComponentId) {
    const style = window.getComputedStyle(node)
    const property = style?.display === "table-row" ? "outline" : "border"
    return styleString + `;${property}: 2px solid #4285f4 !important;`
  } else {
    return styleString
  }
}

/**
 * Svelte action to apply correct component styles.
 * This also applies handlers for selecting components from the builder preview.
 */
export const styleable = (node, styles = {}) => {
  let applyNormalStyles
  let applyHoverStyles
  let selectComponent

  // Creates event listeners and applies initial styles
  const setupStyles = (newStyles = {}) => {
    const componentId = newStyles.id
    const customStyles = newStyles.custom || ""
    const normalStyles = newStyles.normal || {}
    const hoverStyles = {
      ...normalStyles,
      ...(newStyles.hover || {}),
    }

    // Applies a style string to a DOM node
    const applyStyles = styleString => {
      node.style = addBuilderPreviewStyles(node, styleString, componentId)
      node.dataset.componentId = componentId
    }

    // Applies the "normal" style definition
    applyNormalStyles = () => {
      applyStyles(buildStyleString(normalStyles, customStyles))
    }

    // Applies any "hover" styles as well as the base "normal" styles
    applyHoverStyles = () => {
      applyStyles(buildStyleString(hoverStyles, customStyles))
    }

    // Handler to select a component in the builder when clicking it in the
    // builder preview
    selectComponent = event => {
      builderStore.actions.selectComponent(componentId)
      event.preventDefault()
      event.stopPropagation()
      return false
    }

    // Add listeners to toggle hover styles
    node.addEventListener("mouseover", applyHoverStyles)
    node.addEventListener("mouseout", applyNormalStyles)

    // Add builder preview click listener
    if (get(builderStore).inBuilder) {
      node.addEventListener("click", selectComponent, false)
    }

    // Apply initial normal styles
    applyNormalStyles()
  }

  // Removes the current event listeners
  const removeListeners = () => {
    node.removeEventListener("mouseover", applyHoverStyles)
    node.removeEventListener("mouseout", applyNormalStyles)

    // Remove builder preview click listener
    if (get(builderStore).inBuilder) {
      node.removeEventListener("click", selectComponent)
    }
  }

  // Apply initial styles
  setupStyles(styles)

  return {
    // Clean up old listeners and apply new ones on update
    update: newStyles => {
      removeListeners()
      setupStyles(newStyles)
    },
    // Clean up listeners when component is destroyed
    destroy: () => {
      removeListeners()
    },
  }
}
