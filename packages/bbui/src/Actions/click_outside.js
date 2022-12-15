const ignoredClasses = [".flatpickr-calendar", ".modal-container"]
let clickHandlers = []

/**
 * Handle a body click event
 */
const handleClick = event => {
  // Ignore click if needed
  for (let className of ignoredClasses) {
    if (event.target.closest(className)) {
      return
    }
  }

  // Process handlers
  clickHandlers.forEach(handler => {
    if (!handler.element.contains(event.target)) {
      handler.callback?.(event)
    }
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
