type ClickOutsideCallback = (event: MouseEvent) => void | undefined

interface ClickOutsideOpts {
  callback?: ClickOutsideCallback
  anchor?: HTMLElement
}

interface Handler {
  id: number
  element: HTMLElement
  anchor: HTMLElement
  callback?: ClickOutsideCallback
}

// These class names will never trigger a callback if clicked, no matter what
const ignoredClasses = [
  ".download-js-link",
  ".spectrum-Menu",
  ".date-time-popover",
]

// These class names will only trigger a callback when clicked if the registered
// component is not nested inside them. For example, clicking inside a modal
// will not close the modal, or clicking inside a popover will not close the
// popover.
const conditionallyIgnoredClasses = [
  ".spectrum-Underlay",
  ".drawer-wrapper",
  ".spectrum-Popover",
]
let clickHandlers: Handler[] = []
let candidateTarget: HTMLElement | undefined

// Processes a "click outside" event and invokes callbacks if our source element
// is valid
const handleClick = (e: MouseEvent) => {
  const target = (e.target || e.relatedTarget) as HTMLElement

  // Ignore click if this is an ignored class
  if (target.closest('[data-ignore-click-outside="true"]')) {
    return
  }
  for (let className of ignoredClasses) {
    if (target.closest(className)) {
      return
    }
  }

  // Process handlers
  clickHandlers.forEach(handler => {
    // Check that the click isn't inside the target
    if (handler.element.contains(target)) {
      return
    }

    // Ignore clicks for certain classes unless we're nested inside them
    for (let className of conditionallyIgnoredClasses) {
      const sourceInside = handler.anchor.closest(className) != null
      const clickInside = target.closest(className) != null
      if (clickInside && !sourceInside) {
        return
      }
    }

    handler.callback?.(e)
  })
}

// On mouse up we only trigger a "click outside" callback if we targetted the
// same element that we did on mouse down. This fixes all sorts of issues where
// we get annoying callbacks firing when we drag to select text.
const handleMouseUp = (e: MouseEvent) => {
  if (candidateTarget === e.target) {
    handleClick(e)
  }
  candidateTarget = undefined
}

// On mouse down we store which element was targetted for comparison later
const handleMouseDown = (e: MouseEvent) => {
  // Only handle the primary mouse button here.
  // We handle context menu (right click) events in another handler.
  if (e.button !== 0) {
    return
  }
  candidateTarget = e.target as HTMLElement

  // Clear any previous listeners in case of multiple down events, and register
  // a single mouse up listener
  document.removeEventListener("click", handleMouseUp)
  document.addEventListener("click", handleMouseUp, true)
}

// Handle iframe clicks by detecting a loss of focus on the main window
const handleBlur = () => {
  if (
    document.activeElement &&
    ["IFRAME", "BODY"].includes(document.activeElement.tagName)
  ) {
    handleClick(
      new MouseEvent("click", { relatedTarget: document.activeElement })
    )
  }
}

// Global singleton listeners for our events
document.addEventListener("mousedown", handleMouseDown)
document.addEventListener("contextmenu", handleClick)
window.addEventListener("blur", handleBlur)

/**
 * Adds or updates a click handler
 */
const updateHandler = (
  id: number,
  element: HTMLElement,
  anchor: HTMLElement,
  callback: ClickOutsideCallback | undefined
) => {
  let existingHandler = clickHandlers.find(x => x.id === id)
  if (!existingHandler) {
    clickHandlers.push({ id, element, anchor, callback })
  } else {
    existingHandler.callback = callback
  }
}

/**
 * Removes a click handler
 */
const removeHandler = (id: number) => {
  clickHandlers = clickHandlers.filter(x => x.id !== id)
}

/**
 * Svelte action to apply a click outside handler for a certain element.
 * opts.anchor is an optional param specifying the real root source of the
 * component being observed. This is required for things like popovers, where
 * the element using the clickoutside action is the popover, but the popover is
 * rendered at the root of the DOM somewhere, whereas the popover anchor is the
 * element we actually want to consider when determining the source component.
 */
export default (
  element: HTMLElement,
  opts?: ClickOutsideOpts | ClickOutsideCallback
) => {
  const id = Math.random()

  const isCallback = (
    opts?: ClickOutsideOpts | ClickOutsideCallback
  ): opts is ClickOutsideCallback => {
    return typeof opts === "function"
  }

  const isOpts = (
    opts?: ClickOutsideOpts | ClickOutsideCallback
  ): opts is ClickOutsideOpts => {
    return opts != null && typeof opts === "object"
  }

  const update = (newOpts?: ClickOutsideOpts | ClickOutsideCallback) => {
    let callback: ClickOutsideCallback | undefined
    let anchor = element
    if (isCallback(newOpts)) {
      callback = newOpts
    } else if (isOpts(newOpts)) {
      callback = newOpts.callback
      if (newOpts.anchor) {
        anchor = newOpts.anchor
      }
    }
    updateHandler(id, element, anchor, callback)
  }

  update(opts)

  return {
    update,
    destroy: () => removeHandler(id),
  }
}
