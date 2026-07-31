import { fireEvent, render, screen, waitFor } from "@testing-library/svelte"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import SharePointQuickAddModal from "./SharePointQuickAddModal.svelte"

if (!Element.prototype.animate) {
  Element.prototype.animate = () => {
    const animation = Object.create(null) as Animation
    animation.cancel = () => {}
    Object.defineProperty(animation, "finished", {
      value: Promise.resolve(animation),
    })
    Object.defineProperty(animation, "onfinish", {
      set: (callback: Animation["onfinish"]) => {
        if (callback) {
          queueMicrotask(() =>
            callback.call(
              animation,
              new Event("finish") as AnimationPlaybackEvent
            )
          )
        }
      },
    })
    return animation
  }
}

beforeEach(() => {
  const modalContainer = document.createElement("div")
  modalContainer.classList.add("modal-container")
  document.body.appendChild(modalContainer)
})

afterEach(() => {
  document.querySelectorAll(".modal-container").forEach(element => {
    element.remove()
  })
})

describe("SharePointQuickAddModal", () => {
  it("cannot be dismissed while saving", async () => {
    const { component } = render(SharePointQuickAddModal, {
      saving: true,
      onSubmit: vi.fn(),
    })
    component.show()

    await screen.findByText("Connect SharePoint")
    await fireEvent.keyDown(document, { key: "Escape" })
    expect(screen.getByText("Connect SharePoint")).toBeInTheDocument()

    const closeIcon = screen.getByLabelText("x")
    await fireEvent.click(closeIcon)
    expect(screen.getByText("Connect SharePoint")).toBeInTheDocument()

    const underlay = document.querySelector(".spectrum-Underlay")
    expect(underlay).not.toBeNull()
    await fireEvent.mouseDown(underlay!)
    expect(screen.getByText("Connect SharePoint")).toBeInTheDocument()

    component.hide()
  })

  it("can be dismissed when not saving", async () => {
    const { component } = render(SharePointQuickAddModal, {
      saving: false,
      onSubmit: vi.fn(),
    })
    component.show()
    await screen.findByText("Connect SharePoint")

    const underlay = document.querySelector(".spectrum-Underlay")
    expect(underlay).not.toBeNull()
    await fireEvent.mouseDown(underlay!)

    await waitFor(() => {
      expect(screen.queryByText("Connect SharePoint")).not.toBeInTheDocument()
    })
  })
})
