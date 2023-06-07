const ignoredClasses = [
  ".flatpickr-calendar",
  ".spectrum-Popover",
  ".download-js-link",
]
let clickHandlers = []

/**
 * Handle a body click event
 */
const handleClick = event => {
  // Ignore click if this is an ignored class
  if (event.target.closest('[data-ignore-click-outside="true"]')) {
    return
  }
  for (let className of ignoredClasses) {
    if (event.target.closest(className)) {
      return
    }
  }

  // Process handlers
  clickHandlers.forEach(handler => {
    if (handler.element.contains(event.target)) {
      return
    }

    // Ignore clicks for modals, unless the handler is registered from a modal
    const sourceInModal = handler.anchor.closest(".spectrum-Underlay") != null
    const clickInModal = event.target.closest(".spectrum-Underlay") != null
    if (clickInModal && !sourceInModal) {
      return
    }

    handler.callback?.(event)
  })
}
document.documentElement.addEventListener("click", handleClick, true)
document.documentElement.addEventListener("contextmenu", handleClick, true)

/**
 * Adds or updates a click handler
 */
const updateHandler = (id, element, anchor, callback) => {
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
const removeHandler = id => {
  clickHandlers = clickHandlers.filter(x => x.id !== id)
}

/**
 * Svelte action to apply a click outside handler for a certain element
 * opts.anchor is an optional param specifying the real root source of the
 * component being observed. This is required for things like popovers, where
 * the element using the clickoutside action is the popover, but the popover is
 * rendered at the root of the DOM somewhere, whereas the popover anchor is the
 * element we actually want to consider when determining the source component.
 */
export default (element, opts) => {
  const id = Math.random()
  const update = newOpts => {
    const callback = newOpts?.callback || newOpts
    const anchor = newOpts?.anchor || element
    updateHandler(id, element, anchor, callback)
  }
  update(opts)
  return {
    update,
    destroy: () => removeHandler(id),
  }
}
