const getResizeActions = (
  cssProperty,
  mouseMoveEventProperty,
  elementProperty,
  initialValue,
  setValue = () => {}
) => {
  let element = null

  const elementAction = node => {
    element = node

    if (initialValue != null) {
      element.style[cssProperty] = `${initialValue}px`
    }

    return {
      destroy() {
        element = null
      },
    }
  }

  const dragHandleAction = node => {
    let startProperty = null
    let startPosition = null

    const handleMouseMove = e => {
      e.preventDefault() // Prevent highlighting while dragging
      const change = e[mouseMoveEventProperty] - startPosition
      element.style[cssProperty] = `${startProperty + change}px`
    }

    const handleMouseUp = e => {
      e.preventDefault() // Prevent highlighting while dragging
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)

      element.style.removeProperty("transition") // remove temporary transition override
      for (let item of document.getElementsByTagName("iframe")) {
        item.style.removeProperty("pointer-events")
      }

      setValue(element[elementProperty])
    }

    const handleMouseDown = e => {
      if (e.detail > 1) {
        // e.detail is the number of rapid clicks, so e.detail = 2 is
        // a double click. We want to prevent default behaviour in
        // this case as it highlights nearby selectable elements, which
        // then interferes with the resizing mousemove.
        // Putting this on the double click handler doesn't seem to
        // work, so it must go here.
        e.preventDefault()
      }

      if (
        e.target.hasAttribute("disabled") &&
        e.target.getAttribute("disabled") !== "false"
      ) {
        return
      }

      element.style.transition = `${cssProperty} 0ms` // temporarily override any height transitions

      // iframes swallow mouseup events if your cursor ends up over it during a drag, so make them
      // temporarily non-interactive
      for (let item of document.getElementsByTagName("iframe")) {
        item.style.pointerEvents = "none"
      }

      startProperty = element[elementProperty]
      startPosition = e[mouseMoveEventProperty]

      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
    }

    const handleDoubleClick = () => {
      element.style.removeProperty(cssProperty)
    }

    node.addEventListener("mousedown", handleMouseDown)
    node.addEventListener("dblclick", handleDoubleClick)

    return {
      destroy() {
        node.removeEventListener("mousedown", handleMouseDown)
        node.removeEventListener("dblclick", handleDoubleClick)
      },
    }
  }

  return [elementAction, dragHandleAction]
}

export const getVerticalResizeActions = (initialValue, setValue = () => {}) => {
  return getResizeActions(
    "height",
    "pageY",
    "clientHeight",
    initialValue,
    setValue
  )
}

export const getHorizontalResizeActions = (
  initialValue,
  setValue = () => {}
) => {
  return getResizeActions(
    "width",
    "pageX",
    "clientWidth",
    initialValue,
    setValue
  )
}
