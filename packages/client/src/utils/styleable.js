import { get } from "svelte/store"
import { builderStore } from "../store"

const selectedComponentWidth = 2
const selectedComponentColor = "#4285f4"

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
const addBuilderPreviewStyles = (styleString, componentId, selectable) => {
  let str = styleString

  // Apply extra styles if we're in the builder preview
  const state = get(builderStore)
  if (state.inBuilder) {
    // Allow pointer events and always enable cursor
    if (selectable) {
      str += ";pointer-events: all !important; cursor: pointer !important;"
    }

    // Highlighted selected element
    if (componentId === state.selectedComponentId) {
      str += `;border: ${selectedComponentWidth}px solid ${selectedComponentColor} !important;`
    }
  }

  return str
}

/**
 * Svelte action to apply correct component styles.
 * This also applies handlers for selecting components from the builder preview.
 */
export const styleable = (node, styles = {}) => {
  let applyNormalStyles
  let applyHoverStyles
  let selectComponent

  // Kill JS even bubbling
  const blockEvent = event => {
    event.preventDefault()
    event.stopPropagation()
    return false
  }

  // Creates event listeners and applies initial styles
  const setupStyles = (newStyles = {}) => {
    const componentId = newStyles.id
    const selectable = !!newStyles.allowSelection
    const customStyles = newStyles.custom || ""
    const normalStyles = newStyles.normal || {}
    const hoverStyles = {
      ...normalStyles,
      ...(newStyles.hover || {}),
    }

    // Applies a style string to a DOM node, enriching it for the builder
    // preview
    const applyStyles = styleString => {
      node.style = addBuilderPreviewStyles(styleString, componentId, selectable)
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
      return blockEvent(event)
    }

    // Add listeners to toggle hover styles
    node.addEventListener("mouseover", applyHoverStyles)
    node.addEventListener("mouseout", applyNormalStyles)

    // Add builder preview click listener
    if (get(builderStore).inBuilder) {
      node.addEventListener("click", selectComponent, false)

      // Kill other interaction events
      node.addEventListener("mousedown", blockEvent)
      node.addEventListener("mouseup", blockEvent)
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
      node.removeEventListener("mousedown", blockEvent)
      node.removeEventListener("mouseup", blockEvent)
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
