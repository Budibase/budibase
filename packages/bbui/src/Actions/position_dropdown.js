export default function positionDropdown(element, { anchor, align }) {
  let positionSide = "top"
  let maxHeight = 0
  let dimensions = getDimensions(anchor)

  function getDimensions() {
    const {
      bottom,
      top: spaceAbove,
      left,
      width,
    } = anchor.getBoundingClientRect()
    const spaceBelow = window.innerHeight - bottom
    const containerRect = element.getBoundingClientRect()

    let y

    if (spaceAbove > spaceBelow) {
      positionSide = "bottom"
      maxHeight = spaceAbove - 20
      y = window.innerHeight - spaceAbove
    } else {
      positionSide = "top"
      y = bottom
      maxHeight = spaceBelow - 20
    }

    return {
      [positionSide]: y,
      left,
      width,
      containerWidth: containerRect.width,
    }
  }

  function calcLeftPosition() {
    return align === "right"
      ? dimensions.left + dimensions.width - dimensions.containerWidth
      : dimensions.left
  }

  element.style.position = "absolute"
  element.style.zIndex = "9999"
  element.style.minWidth = `${dimensions.width}px`
  element.style.maxHeight = `${maxHeight.toFixed(0)}px`
  element.style.transformOrigin = `center ${positionSide}`
  element.style[positionSide] = `${dimensions[positionSide]}px`
  element.style.left = `${calcLeftPosition(dimensions).toFixed(0)}px`

  const resizeObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
      dimensions = getDimensions()
      element.style[positionSide] = `${dimensions[positionSide]}px`
      element.style.left = `${calcLeftPosition(dimensions).toFixed(0)}px`
    }
  })

  resizeObserver.observe(anchor)
  resizeObserver.observe(element)

  return {
    destroy() {
      resizeObserver.disconnect()
    },
  }
}
