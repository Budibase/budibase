import { describe, expect, it, vi, afterEach } from "vitest"
import { InteractionController } from "../../../../client/src/utils/interactionEvents"

const createTouchEvent = () => ({
  touches: [{}],
  changedTouches: [{}],
  preventDefault: vi.fn(),
})

describe("InteractionController", () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it("executes the handler for dblclick events", () => {
    const handler = vi.fn()
    const controller = new InteractionController({ onDoubleClick: handler })
    controller.handleDblClick(new MouseEvent("dblclick"))
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it("fires double-click once when a double tap is detected and suppresses native dblclick", () => {
    vi.useFakeTimers()
    vi.setSystemTime(0)
    const handler = vi.fn()
    const controller = new InteractionController(
      { onDoubleClick: handler },
      { doubleTapDelay: 200 }
    )
    const touchEvent = createTouchEvent()
    controller.handleTouchEnd(touchEvent)
    vi.setSystemTime(100)
    controller.handleTouchEnd(touchEvent)
    expect(handler).toHaveBeenCalledTimes(1)
    controller.handleDblClick(new MouseEvent("dblclick"))
    expect(handler).toHaveBeenCalledTimes(1)
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
