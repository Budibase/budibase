interface ScrollVerticallyIntoViewArgs {
  element: HTMLElement
  scrollContainer: HTMLElement
  margin?: number
}

export const scrollVerticallyIntoView = ({
  element,
  scrollContainer,
  margin = 100,
}: ScrollVerticallyIntoViewArgs) => {
  const { top, bottom } = element.getBoundingClientRect()
  const { top: containerTop, bottom: containerBottom } =
    scrollContainer.getBoundingClientRect()

  if (top < containerTop + margin) {
    scrollContainer.scrollBy({
      top: top - containerTop - margin,
      behavior: "smooth",
    })
  } else if (bottom > containerBottom - margin) {
    scrollContainer.scrollBy({
      top: bottom - containerBottom + margin,
      behavior: "smooth",
    })
  }
}
