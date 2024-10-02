/**
 * Valid alignment options are
 * - left
 * - right
 * - left-outside
 * - right-outside
 **/

// Strategies are defined as [Popover]To[Anchor].
// They can apply for both horizontal and vertical alignment.
const Strategies = {
  StartToStart: "StartToStart", // e.g. left alignment
  EndToEnd: "EndToEnd", // e.g. right alignment
  StartToEnd: "StartToEnd", // e.g. right-outside alignment
  EndToStart: "EndToStart", // e.g. left-outside alignment
  MidPoint: "MidPoint", // centers relative to midpoints
  ScreenEdge: "ScreenEdge", // locks to screen edge
}

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
      resizable,
      wrap,
    } = opts
    if (!anchor) {
      return
    }

    // Compute bounds
    const anchorBounds = anchor.getBoundingClientRect()
    const elementBounds = element.getBoundingClientRect()
    const winWidth = window.innerWidth
    const winHeight = window.innerHeight
    const screenOffset = 8
    let styles = {
      maxHeight,
      minWidth: useAnchorWidth ? anchorBounds.width : minWidth,
      maxWidth: useAnchorWidth ? anchorBounds.width : maxWidth,
      left: null,
      top: null,
    }

    // Ignore all our logic for custom logic
    if (typeof customUpdate === "function") {
      styles = customUpdate(anchorBounds, elementBounds, {
        ...styles,
        offset: opts.offset,
      })
    }

    // Otherwise position ourselves as normal
    else {
      // Checks if we overflow off the screen. We only report that we overflow
      // when the alternative dimension is larger than the one we are checking.
      const doesXOverflow = () => {
        const overflows = styles.left + elementBounds.width > winWidth
        return overflows && anchorBounds.left > winWidth - anchorBounds.right
      }
      const doesYOverflow = () => {
        const overflows = styles.top + elementBounds.height > winHeight
        return overflows && anchorBounds.top > winHeight - anchorBounds.bottom
      }

      // Applies a dynamic max height constraint if appropriate
      const applyMaxHeight = height => {
        if (!styles.maxHeight && resizable) {
          styles.maxHeight = height
        }
      }

      // Applies the X strategy to our styles
      const applyXStrategy = strategy => {
        switch (strategy) {
          case Strategies.StartToStart:
          default:
            styles.left = anchorBounds.left
            break
          case Strategies.EndToEnd:
            styles.left = anchorBounds.right - elementBounds.width
            break
          case Strategies.StartToEnd:
            styles.left = anchorBounds.right + offset
            break
          case Strategies.EndToStart:
            styles.left = anchorBounds.left - elementBounds.width - offset
            break
          case Strategies.MidPoint:
            styles.left =
              anchorBounds.left +
              anchorBounds.width / 2 -
              elementBounds.width / 2
            break
          case Strategies.ScreenEdge:
            styles.left = winWidth - elementBounds.width - screenOffset
            break
        }
      }

      // Applies the Y strategy to our styles
      const applyYStrategy = strategy => {
        switch (strategy) {
          case Strategies.StartToStart:
            styles.top = anchorBounds.top
            applyMaxHeight(winHeight - anchorBounds.top - screenOffset)
            break
          case Strategies.EndToEnd:
            styles.top = anchorBounds.bottom - elementBounds.height
            applyMaxHeight(anchorBounds.bottom - screenOffset)
            break
          case Strategies.StartToEnd:
          default:
            styles.top = anchorBounds.bottom + offset
            applyMaxHeight(winHeight - anchorBounds.bottom - screenOffset)
            break
          case Strategies.EndToStart:
            styles.top = anchorBounds.top - elementBounds.height - offset
            applyMaxHeight(anchorBounds.top - screenOffset)
            break
          case Strategies.MidPoint:
            styles.top =
              anchorBounds.top +
              anchorBounds.height / 2 -
              elementBounds.height / 2
            break
          case Strategies.ScreenEdge:
            styles.top = winHeight - elementBounds.height - screenOffset
            applyMaxHeight(winHeight - 2 * screenOffset)
            break
        }
      }

      // Determine X strategy
      if (align === "right") {
        applyXStrategy(Strategies.EndToEnd)
      } else if (align === "right-outside" || align === "right-context-menu") {
        applyXStrategy(Strategies.StartToEnd)
      } else if (align === "left-outside" || align === "left-context-menu") {
        applyXStrategy(Strategies.EndToStart)
      } else if (align === "center") {
        applyXStrategy(Strategies.MidPoint)
      } else {
        applyXStrategy(Strategies.StartToStart)
      }

      // Determine Y strategy
      if (align === "right-outside" || align === "left-outside") {
        applyYStrategy(Strategies.MidPoint)
      } else if (
        align === "right-context-menu" ||
        align === "left-context-menu"
      ) {
        applyYStrategy(Strategies.StartToStart)
        styles.top -= 5 // Manual adjustment for action menu padding
      } else {
        applyYStrategy(Strategies.StartToEnd)
      }

      // Handle screen overflow
      if (doesXOverflow()) {
        // Swap left to right
        if (align === "left") {
          applyXStrategy(Strategies.EndToEnd)
        }
        // Swap right-outside to left-outside
        else if (align === "right-outside") {
          applyXStrategy(Strategies.EndToStart)
        }
      }
      if (doesYOverflow()) {
        // If wrapping, lock to the bottom of the screen and also reposition to
        // the side to not block the anchor
        if (wrap) {
          applyYStrategy(Strategies.MidPoint)
          if (doesYOverflow()) {
            applyYStrategy(Strategies.ScreenEdge)
          }
          applyXStrategy(Strategies.StartToEnd)
          if (doesXOverflow()) {
            applyXStrategy(Strategies.EndToStart)
          }
        }
        // Othewise invert as normal
        else {
          // If using an outside strategy then lock to the bottom of the screen
          if (align === "left-outside" || align === "right-outside") {
            applyYStrategy(Strategies.ScreenEdge)
          }
          // Otherwise flip above
          else {
            applyYStrategy(Strategies.EndToStart)
          }
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
  element.style.position = "fixed"
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
