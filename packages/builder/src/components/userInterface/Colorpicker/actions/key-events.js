//events: Array<{trigger: fn}>
export default function(node, events = []) {
  const ev = Object.entries(events)
  let fns = []

  for (let [trigger, fn] of ev) {
    let f = addEvent(trigger, fn)
    fns = [...fns, f]
  }

  function _scaffold(trigger, fn) {
    return () => {
      let trig = parseInt(trigger)
      if (trig) {
        if (event.keyCode === trig) {
          fn(event)
        }
      } else {
        if (event.key === trigger) {
          fn(event)
        }
      }
    }
  }

  function addEvent(trigger, fn) {
    let f = _scaffold(trigger, fn)
    node.addEventListener("keydown", f)
    return f
  }

  function removeEvents() {
    fns.forEach(f => node.removeEventListener("keypress", f))
  }

  return {
    destroy() {
      removeEvents()
    },
  }
}
