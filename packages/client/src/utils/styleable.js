const buildStyleString = styles => {
  let str = ""
  Object.entries(styles).forEach(([style, value]) => {
    if (style && value) {
      str += `${style}: ${value}; `
    }
  })
  return str
}

/**
 * Svelte action to apply correct component styles.
 */
export const styleable = (node, styles = {}) => {
  const normalStyles = styles.normal || {}
  const hoverStyles = {
    ...normalStyles,
    ...styles.hover,
  }

  function applyNormalStyles() {
    node.style = buildStyleString(normalStyles)
  }

  function applyHoverStyles() {
    node.style = buildStyleString(hoverStyles)
  }

  // Add listeners to toggle hover styles
  node.addEventListener("mouseover", applyHoverStyles)
  node.addEventListener("mouseout", applyNormalStyles)

  // Apply normal styles initially
  applyNormalStyles()

  // Also apply data tags so we know how to reference each component
  node.setAttribute("data-bb-id", styles.id)

  return {
    // Clean up event listeners when component is destroyed
    destroy: () => {
      node.removeEventListener("mouseover", applyHoverStyles)
      node.removeEventListener("mouseout", applyNormalStyles)
    },
  }
}
