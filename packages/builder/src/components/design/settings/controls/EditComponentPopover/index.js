export const customPositionHandler = (anchorBounds, eleBounds, cfg) => {
  let { left, top } = cfg
  let percentageOffset = 30
  // left-outside
  left = anchorBounds.left - eleBounds.width - 18

  // shift up from the anchor, if space allows
  let offsetPos = Math.floor(eleBounds.height / 100) * percentageOffset
  let defaultTop = anchorBounds.top - offsetPos

  if (window.innerHeight - defaultTop < eleBounds.height) {
    top = window.innerHeight - eleBounds.height - 5
  } else {
    top = anchorBounds.top - offsetPos
  }

  return { ...cfg, left, top }
}
