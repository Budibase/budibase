const ignoredClasses = [".flatpickr-calendar"]
let clickHandlers = []

/**
 * Handle a body click event
 */
const handleClick = event => {
  // Ignore click if this is an ignored class
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
    const sourceInModal = handler.element.closest(".spectrum-Modal") != null
    const clickInModal = event.target.closest(".spectrum-Modal") != null
    if (clickInModal && !sourceInModal) {
      return
    }

    handler.callback?.(event)
  })
}
document.documentElement.addEventListener("click", handleClick, true)

/**
 * Adds or updates a click handler
 */
const updateHandler = (id, element, callback) => {
  let existingHandler = clickHandlers.find(x => x.id === id)
  if (!existingHandler) {
    clickHandlers.push({ id, element, callback })
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
 */
export default (element, callback) => {
  const id = Math.random()
  updateHandler(id, element, callback)
  return {
    update: newCallback => updateHandler(id, element, newCallback),
    destroy: () => removeHandler(id),
  }
}
