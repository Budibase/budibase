/**
 * Helper to build a CSS string from a style object
 */
const buildStyleString = (styleObject, customStyles, selected) => {
  let str = ""
  Object.entries(styleObject).forEach(([style, value]) => {
    if (style && value != null) {
      str += `${style}: ${value}; `
    }
  })
  str += customStyles || ""
  if (selected) {
    str += ";border: 2px solid #0055ff !important;"
  }
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
    const customStyles = newStyles.custom
    const normalStyles = newStyles.normal || {}
    const hoverStyles = {
      ...normalStyles,
      ...newStyles.hover,
    }

    applyNormalStyles = () => {
      node.style = buildStyleString(normalStyles, customStyles, selected)
    }

    applyHoverStyles = () => {
      node.style = buildStyleString(hoverStyles, customStyles, selected)
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
