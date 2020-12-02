/**
 * Helper to build a CSS string from a style object
 */
const buildStyleString = (styles, selected) => {
  let str = ""
  if (selected) {
    styles.border = "2px solid #0055ff !important"
  }
  Object.entries(styles).forEach(([style, value]) => {
    if (style && value != null) {
      str += `${style}: ${value}; `
    }
  })
  return str
}

/**
 * Svelte action to apply correct component styles.
 */
export const styleable = (node, styles = {}) => {
  let applyNormalStyles
  let applyHoverStyles

  // Creates event listeners and applies initial styles
  const setupStyles = newStyles => {
    const selected = newStyles.selected
    const normalStyles = newStyles.normal || {}
    const hoverStyles = {
      ...normalStyles,
      ...newStyles.hover,
    }

    applyNormalStyles = () => {
      node.style = buildStyleString(normalStyles, selected)
    }

    applyHoverStyles = () => {
      node.style = buildStyleString(hoverStyles, selected)
    }

    // Add listeners to toggle hover styles
    node.addEventListener("mouseover", applyHoverStyles)
    node.addEventListener("mouseout", applyNormalStyles)

    // Apply initial normal styles
    applyNormalStyles()
  }

  // Removes the current event listeners
  const removeListeners = () => {
    node.removeEventListener("mouseover", applyHoverStyles)
    node.removeEventListener("mouseout", applyNormalStyles)
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
