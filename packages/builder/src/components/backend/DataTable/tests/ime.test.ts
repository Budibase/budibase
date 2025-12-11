import { fireEvent, render, waitFor } from "@testing-library/svelte"
import { vi } from "vitest"
import TextCellTestWrapper from "./TextCellTestWrapper.svelte"

describe("TextCell IME handling", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("ignores Enter key while composing", async () => {
    let api
    const onChange = vi.fn()
    const { getByRole } = render(TextCellTestWrapper, {
      props: {
        value: "テスト",
        setApi: ref => {
          api = ref
        },
        onChange,
      },
    })
    const input = getByRole("textbox")
    await waitFor(() => {
      if (!api) {
        throw new Error("api is not ready")
      }
    })
    await fireEvent.focus(input)
    await fireEvent.compositionStart(input)

    const blurSpy = vi.spyOn(input, "blur")
    const dispatchSpy = vi.spyOn(document, "dispatchEvent")

    const handled = api.onKeyDown(new KeyboardEvent("keydown", { key: "Enter" }))

    expect(handled).toBe(true)
    expect(blurSpy).not.toHaveBeenCalled()
    expect(dispatchSpy).not.toHaveBeenCalled()
  })

  it("commits the value after composition ends", async () => {
    let api
    const onChange = vi.fn()
    const { getByRole } = render(TextCellTestWrapper, {
      props: {
        value: "テスト",
        setApi: ref => {
          api = ref
        },
        onChange,
      },
    })
    const input = getByRole("textbox")
    await waitFor(() => {
      if (!api) {
        throw new Error("api is not ready")
      }
    })
    await fireEvent.focus(input)
    await fireEvent.compositionStart(input)
    await fireEvent.compositionEnd(input)

    const blurSpy = vi.spyOn(input, "blur")
    const dispatchSpy = vi.spyOn(document, "dispatchEvent")

    const handled = api.onKeyDown(new KeyboardEvent("keydown", { key: "Enter" }))

    expect(handled).toBe(true)
    expect(blurSpy).toHaveBeenCalled()
    expect(dispatchSpy).toHaveBeenCalled()
    const arrowEvent = dispatchSpy.mock.calls[0][0]
    expect(arrowEvent).toBeInstanceOf(KeyboardEvent)
    expect(arrowEvent.key).toBe("ArrowDown")
  })
})
