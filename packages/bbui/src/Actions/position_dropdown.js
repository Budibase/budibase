export default function positionDropdown(
  element,
  { anchor, align, maxWidth, useAnchorWidth, offset = 5 }
) {
  const update = () => {
    if (!anchor) {
      return
    }
    const anchorBounds = anchor.getBoundingClientRect()
    const elementBounds = element.getBoundingClientRect()
    let styles = {
      maxHeight: null,
      minWidth: null,
      maxWidth,
      left: null,
      top: null,
    }

    // Determine vertical styles
    if (align === "right-outside") {
      styles.top = anchorBounds.top
    } else if (window.innerHeight - anchorBounds.bottom < 100) {
      styles.top = anchorBounds.top - elementBounds.height - offset
    } else {
      styles.top = anchorBounds.bottom + offset
      styles.maxHeight = window.innerHeight - anchorBounds.bottom - 20
    }

    // Determine horizontal styles
    if (!maxWidth && useAnchorWidth) {
      styles.maxWidth = anchorBounds.width
    }
    if (useAnchorWidth) {
      styles.minWidth = anchorBounds.width
    }
    if (align === "right") {
      styles.left = anchorBounds.left + anchorBounds.width - elementBounds.width
    } else if (align === "right-outside") {
      styles.left = anchorBounds.right + offset
    } else {
      styles.left = anchorBounds.left
    }

    // Apply styles
    Object.entries(styles).forEach(([style, value]) => {
      if (value) {
        element.style[style] = `${value.toFixed(0)}px`
      } else {
        element.style[style] = null
      }
    })
  }

  // Apply initial styles which don't need to change
  element.style.position = "absolute"
  element.style.zIndex = "9999"

  // Observe both anchor and element and resize the popover as appropriate
  const resizeObserver = new ResizeObserver(entries => {
    entries.forEach(update)
  })
  if (anchor) {
    resizeObserver.observe(anchor)
  }
  resizeObserver.observe(element)
  resizeObserver.observe(document.body)

  document.addEventListener("scroll", update, true)

  return {
    destroy() {
      resizeObserver.disconnect()
      document.removeEventListener("scroll", update, true)
    },
  }
}
