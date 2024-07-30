export const isGridEvent = e => {
  return (
    e.target
      .closest?.(".component")
      ?.parentNode.closest(".component")
      ?.childNodes[0]?.classList?.contains("grid") ||
    e.target.classList.contains("anchor")
  )
}

export const isGridChild = node => {
  return node
    ?.closest(".component")
    ?.parentNode.closest(".component")
    ?.childNodes[0]?.classList?.contains("grid")
}

export const getGridParentID = node => {
  return node?.closest(".grid")?.parentNode.dataset.id
}
