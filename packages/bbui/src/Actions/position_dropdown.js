export default function positionDropdown(element, opts) {
  let resizeObserver
  let latestOpts = opts

  // We need a static reference to this function so that we can properly
  // clean up the scroll listener.
  const scrollUpdate = () => {
    updatePosition(latestOpts)
  }

  // Updates the position of the dropdown
  const updatePosition = opts => {
    const {
      anchor,
      align,
      maxHeight,
      maxWidth,
      useAnchorWidth,
      offset = 5,
      customUpdate,
      offsetBelow,
    } = opts
    if (!anchor) {
      return
    }

    // Compute bounds
    const anchorBounds = anchor.getBoundingClientRect()
    const elementBounds = element.getBoundingClientRect()
    let styles = {
      maxHeight: null,
      minWidth: null,
      maxWidth,
      left: null,
      top: null,
    }

    if (typeof customUpdate === "function") {
      styles = customUpdate(anchorBounds, elementBounds, styles)
    } else {
      // Determine vertical styles
      if (align === "right-outside") {
        styles.top = anchorBounds.top
      } else if (
        window.innerHeight - anchorBounds.bottom <
        (maxHeight || 100)
      ) {
        styles.top = anchorBounds.top - elementBounds.height - offset
        styles.maxHeight = maxHeight || 240
      } else {
        styles.top = anchorBounds.bottom + (offsetBelow || offset)
        styles.maxHeight =
          maxHeight || window.innerHeight - anchorBounds.bottom - 20
      }

      // Determine horizontal styles
      if (!maxWidth && useAnchorWidth) {
        styles.maxWidth = anchorBounds.width
      }
      if (useAnchorWidth) {
        styles.minWidth = anchorBounds.width
      }
      if (align === "right") {
        styles.left =
          anchorBounds.left + anchorBounds.width - elementBounds.width
      } else if (align === "right-outside") {
        styles.left = anchorBounds.right + offset
      } else if (align === "left-outside") {
        styles.left = anchorBounds.left - elementBounds.width - offset
      } else {
        styles.left = anchorBounds.left
      }
    }

    // Apply styles
    Object.entries(styles).forEach(([style, value]) => {
      if (value != null) {
        element.style[style] = `${value.toFixed(0)}px`
      } else {
        element.style[style] = null
      }
    })
  }

  // The actual svelte action callback which creates observers on the relevant
  // DOM elements
  const update = newOpts => {
    latestOpts = newOpts

    // Cleanup old state
    if (resizeObserver) {
      resizeObserver.disconnect()
    }

    // Do nothing if no anchor
    const { anchor } = newOpts
    if (!anchor) {
      return
    }

    // Observe both anchor and element and resize the popover as appropriate
    resizeObserver = new ResizeObserver(() => updatePosition(newOpts))
    resizeObserver.observe(anchor)
    resizeObserver.observe(element)
    resizeObserver.observe(document.body)
  }

  // Apply initial styles which don't need to change
  element.style.position = "absolute"
  element.style.zIndex = "9999"

  // Set up a scroll listener
  document.addEventListener("scroll", scrollUpdate, true)

  // Perform initial update
  update(opts)

  return {
    update,
    destroy() {
      // Cleanup
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
      document.removeEventListener("scroll", scrollUpdate, true)
    },
  }
}
