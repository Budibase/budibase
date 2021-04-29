export default function clickOutside(element, callbackFunction) {
  function onClick(event) {
    if (!element.contains(event.target)) {
      callbackFunction()
    }
  }

  document.body.addEventListener("click", onClick, true)

  return {
    update(newCallbackFunction) {
      callbackFunction = newCallbackFunction
    },
    destroy() {
      document.body.removeEventListener("click", onClick, true)
    },
  }
}
