export default function clickOutside(element, callbackFunction) {
  function onClick(event) {
    if (!element.contains(event.target)) {
      callbackFunction()
    }
  }

  document.body.addEventListener("mousedown", onClick, true)

  return {
    update(newCallbackFunction) {
      callbackFunction = newCallbackFunction
    },
    destroy() {
      document.body.removeEventListener("mousedown", onClick, true)
    },
  }
}
