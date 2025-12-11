const DEFAULT_DOUBLE_TAP_DELAY = 400
const DEFAULT_LONG_PRESS_DELAY = 600

export interface InteractionHandlers {
  onDoubleClick?: (event?: Event) => void
  onContextMenu?: (event?: Event) => void
}

type TouchLikeEvent = {
  touches?: { length: number }
  changedTouches?: { length: number }
  preventDefault?: () => void
} & Event

const isSingleTouch = (event: TouchLikeEvent) => {
  return (
    event.touches?.length === 1 &&
    (event.changedTouches == null || event.changedTouches.length === 1)
  )
}

export class InteractionController {
  private handlers: InteractionHandlers
  private doubleTapDelay: number
  private longPressDelay: number
  private lastTouchEnd: number
  private longPressTimer: ReturnType<typeof setTimeout> | null
  private longPressTriggered: boolean
  private suppressDoubleClick: boolean
  private suppressContextMenu: boolean
  private touchStartEvent: TouchLikeEvent | null

  constructor(
    handlers: InteractionHandlers = {},
    config: { doubleTapDelay?: number; longPressDelay?: number } = {}
  ) {
    this.handlers = handlers
    this.doubleTapDelay = config.doubleTapDelay ?? DEFAULT_DOUBLE_TAP_DELAY
    this.longPressDelay = config.longPressDelay ?? DEFAULT_LONG_PRESS_DELAY
    this.lastTouchEnd = -Infinity
    this.longPressTimer = null
    this.longPressTriggered = false
    this.suppressDoubleClick = false
    this.suppressContextMenu = false
    this.touchStartEvent = null
  }

  setHandlers(handlers: InteractionHandlers = {}) {
    this.handlers = handlers
  }

  destroy() {
    this.resetLongPress()
  }

  handleDblClick = (event: Event) => {
    if (this.suppressDoubleClick) {
      this.suppressDoubleClick = false
      return
    }
    this.handlers.onDoubleClick?.(event)
  }

  handleContextMenu = (event: Event) => {
    if (this.suppressContextMenu) {
      this.suppressContextMenu = false
      return
    }
    event.preventDefault?.()
    this.handlers.onContextMenu?.(event)
  }

  handleTouchStart = (event: TouchLikeEvent) => {
    if (!isSingleTouch(event)) {
      this.resetLongPress()
      this.touchStartEvent = null
      return
    }

    this.resetLongPress()
    this.touchStartEvent = event
    this.longPressTimer = globalThis.setTimeout(() => {
      this.longPressTimer = null
      this.longPressTriggered = true
      this.suppressContextMenu = true
      const targetEvent = this.touchStartEvent || event
      targetEvent.preventDefault?.()
      this.handlers.onContextMenu?.(targetEvent)
    }, this.longPressDelay)
  }

  handleTouchMove = () => {
    this.resetLongPress()
  }

  handleTouchCancel = () => {
    this.resetLongPress()
    this.longPressTriggered = false
    this.touchStartEvent = null
  }

  handleTouchEnd = (event: TouchLikeEvent) => {
    this.resetLongPress()
    if (this.longPressTriggered) {
      this.longPressTriggered = false
      this.touchStartEvent = null
      return
    }

    const now = Date.now()
    if (now - this.lastTouchEnd <= this.doubleTapDelay) {
      this.lastTouchEnd = -Infinity
      this.suppressDoubleClick = true
      this.handlers.onDoubleClick?.(event)
    } else {
      this.lastTouchEnd = now
    }
    this.touchStartEvent = null
  }

  private resetLongPress() {
    if (this.longPressTimer != null) {
      globalThis.clearTimeout(this.longPressTimer)
      this.longPressTimer = null
    }
  }
}

export const interactionEvents = (
  node: HTMLElement,
  handlers: InteractionHandlers = {}
) => {
  const controller = new InteractionController(handlers)
  node.addEventListener("dblclick", controller.handleDblClick)
  node.addEventListener("contextmenu", controller.handleContextMenu)
  node.addEventListener("touchstart", controller.handleTouchStart, {
    passive: false,
  })
  node.addEventListener("touchend", controller.handleTouchEnd)
  node.addEventListener("touchmove", controller.handleTouchMove)
  node.addEventListener("touchcancel", controller.handleTouchCancel)

  return {
    update(newHandlers: InteractionHandlers = {}) {
      controller.setHandlers(newHandlers)
    },
    destroy() {
      node.removeEventListener("dblclick", controller.handleDblClick)
      node.removeEventListener("contextmenu", controller.handleContextMenu)
      node.removeEventListener("touchstart", controller.handleTouchStart)
      node.removeEventListener("touchend", controller.handleTouchEnd)
      node.removeEventListener("touchmove", controller.handleTouchMove)
      node.removeEventListener("touchcancel", controller.handleTouchCancel)
      controller.destroy()
    },
  }
}
