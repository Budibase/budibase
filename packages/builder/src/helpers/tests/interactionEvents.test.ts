import { describe, expect, it, vi, afterEach } from "vitest"
import { InteractionController } from "../../../../client/src/utils/interactionEvents"

type TouchLikeEvent = Parameters<InteractionController["handleTouchEnd"]>[0]

const createTouchEvent = (): TouchLikeEvent => {
  const event = new Event("touchend")
  return Object.assign(event, {
    touches: [{ length: 1 }],
    changedTouches: [{ length: 1 }],
    preventDefault: vi.fn(),
  })
}

describe("InteractionController", () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it("fires onClick once when a double tap is detected while in double click mode", () => {
    vi.useFakeTimers()
    vi.setSystemTime(0)
    const handler = vi.fn()
    const controller = new InteractionController(
      { onClick: handler },
      { clickMode: "onDoubleClick", doubleTapDelay: 200 }
    )
    const touchEvent = createTouchEvent()
    controller.handleTouchEnd(touchEvent)
    vi.setSystemTime(100)
    controller.handleTouchEnd(touchEvent)
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it("does not fire onClick on double tap when left click mode is set to onClick", () => {
    vi.useFakeTimers()
    vi.setSystemTime(0)
    const handler = vi.fn()
    const controller = new InteractionController(
      { onClick: handler },
      { doubleTapDelay: 200 }
    )
    const touchEvent = createTouchEvent()
    controller.handleTouchEnd(touchEvent)
    vi.setSystemTime(100)
    controller.handleTouchEnd(touchEvent)
    expect(handler).toHaveBeenCalledTimes(0)
  })

  it("allows the native context menu when no handler is registered", () => {
    const controller = new InteractionController()
    const event = new MouseEvent("contextmenu")
    const preventDefault = vi.fn()
    Object.assign(event, { preventDefault })
    controller.handleContextMenu(event)
    expect(preventDefault).not.toHaveBeenCalled()
  })

  it("triggers the context menu handler after a long press and ignores the native event", () => {
    vi.useFakeTimers()
    vi.setSystemTime(0)
    const handler = vi.fn()
    const controller = new InteractionController(
      { onContextMenu: handler },
      { longPressDelay: 300 }
    )
    controller.handleTouchStart(createTouchEvent())
    vi.advanceTimersByTime(350)
    expect(handler).toHaveBeenCalledTimes(1)
    controller.handleContextMenu(new MouseEvent("contextmenu"))
    expect(handler).toHaveBeenCalledTimes(1)
  })
})
