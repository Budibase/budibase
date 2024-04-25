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
      minWidth,
      useAnchorWidth,
      offset = 5,
      customUpdate,
      noShrink,
    } = opts
    if (!anchor) {
      return
    }

    // Compute bounds
    const anchorBounds = anchor.getBoundingClientRect()
    const elementBounds = element.getBoundingClientRect()
    const padding = 8
    let styles = {
      maxHeight: null,
      minWidth,
      maxWidth,
      left: null,
      top: null,
    }

    if (typeof customUpdate === "function") {
      styles = customUpdate(anchorBounds, elementBounds, {
        ...styles,
        offset: opts.offset,
      })
    } else {
      // "outside" alignment (popover vertical center = anchor vertical center)
      if (align === "right-outside" || align === "left-outside") {
        styles.top =
          anchorBounds.top + anchorBounds.height / 2 - elementBounds.height / 2
        styles.maxHeight = maxHeight
      }

      // Normal left/right alignment (top popover edge = botom anchor edge)
      else {
        styles.top = anchorBounds.bottom + offset
        styles.maxHeight = maxHeight || window.innerHeight - styles.top
      }

      // Determine horizontal styles
      // Use anchor width if required
      if (!maxWidth && useAnchorWidth) {
        styles.maxWidth = anchorBounds.width
      }
      if (useAnchorWidth) {
        styles.minWidth = anchorBounds.width
      }

      // Right alignment (right popover edge = right anchor edge)
      if (align === "right") {
        styles.left =
          anchorBounds.left + anchorBounds.width - elementBounds.width
      }

      // Right outside alignment (left popover edge = right anchor edge)
      else if (align === "right-outside") {
        styles.left = anchorBounds.right + offset
      }

      // Left outside alignment (right popover edge = left anchor edge)
      else if (align === "left-outside") {
        styles.left = anchorBounds.left - elementBounds.width - offset
      }

      // Left alignment by default (left popover edge = left anchor edge)
      else {
        styles.left = anchorBounds.left
      }

      // Remove max height restriction if we don't want to shrink
      if (noShrink) {
        delete styles.maxHeight
      }

      // Handle screen overflow
      // Check right overflow
      if (styles.left + elementBounds.width > window.innerWidth) {
        styles.left = window.innerWidth - elementBounds.width - padding
      }
      // Check bottom overflow
      if (styles.top + elementBounds.height > window.innerHeight) {
        styles.top = window.innerHeight - elementBounds.height - padding

        // If we overflowed off the bottom and therefore locked to the bottom
        // edge, we might now be covering the anchor. Therefore we can try
        // moving left or right to reveal the full anchor again.
        if (anchorBounds.right + elementBounds.width < window.innerWidth) {
          styles.left = anchorBounds.right
        } else if (anchorBounds.left - elementBounds.width > 0) {
          styles.left = anchorBounds.left - elementBounds.width
        }
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
