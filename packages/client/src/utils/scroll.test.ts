// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest"
import { scrollVerticallyIntoView } from "./scroll"

const setRect = (element: HTMLElement, top: number, bottom: number) => {
  const rect = element.getBoundingClientRect()
  Object.defineProperties(rect, {
    top: { value: top },
    bottom: { value: bottom },
  })
  vi.spyOn(element, "getBoundingClientRect").mockReturnValue(rect)
}

const setup = () => {
  const element = document.createElement("div")
  const scrollContainer = document.createElement("div")
  const scrollBy = vi.fn()
  Object.defineProperty(scrollContainer, "scrollBy", { value: scrollBy })
  setRect(scrollContainer, 100, 500)
  return { element, scrollContainer, scrollBy }
}

describe("scrollVerticallyIntoView", () => {
  it("scrolls upward when the element is above the visible area", () => {
    const { element, scrollContainer, scrollBy } = setup()
    setRect(element, 150, 170)

    scrollVerticallyIntoView({ element, scrollContainer })

    expect(scrollBy).toHaveBeenCalledWith({ top: -50, behavior: "smooth" })
  })

  it("scrolls downward when the element is below the visible area", () => {
    const { element, scrollContainer, scrollBy } = setup()
    setRect(element, 450, 470)

    scrollVerticallyIntoView({ element, scrollContainer })

    expect(scrollBy).toHaveBeenCalledWith({ top: 70, behavior: "smooth" })
  })

  it("does not scroll when the element is already visible", () => {
    const { element, scrollContainer, scrollBy } = setup()
    setRect(element, 250, 270)

    scrollVerticallyIntoView({ element, scrollContainer })

    expect(scrollBy).not.toHaveBeenCalled()
  })
})
