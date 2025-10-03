import { writable, get } from "svelte/store"
import type { Automation, BlockPath, BlockRef } from "@budibase/types"

export interface DragViewMoveStep {
  id: string
  offsetX: number
  offsetY: number
  w?: number
  h?: number
  mouse?: { x: number; y: number }
}

export interface DragViewDropzone {
  dims: DOMRect
  path?: BlockPath[]
}

export interface DragView {
  dragging: boolean
  moveStep: DragViewMoveStep | null
  dragSpot: { x: number; y: number } | null
  scale: number
  dropzones: Record<string, DragViewDropzone>
  droptarget: string | null
  focusEle?: HTMLElement
}

type Viewport = { x: number; y: number; zoom: number }

export interface DnDSelectedAutomation {
  blockRefs?: Record<string, BlockRef>
  data?: Automation
}

export interface FlowChartDnDDeps {
  getViewport: () => Viewport | undefined
  setViewport: (vp: Viewport) => void
  moveBlock: ({
    sourcePath,
    destPath,
    automationData,
  }: {
    sourcePath: BlockPath[]
    destPath: BlockPath[]
    automationData: Automation
  }) => Promise<void> | void
  getSelectedAutomation: () => DnDSelectedAutomation
}

export const createFlowChartDnD = (deps: FlowChartDnDDeps) => {
  const view = writable<DragView>({
    dragging: false,
    moveStep: null,
    dragSpot: null,
    scale: 1,
    dropzones: {},
    droptarget: null,
  })

  const viewPos = writable({ x: 0, y: 0 })
  const contentPos = writable({ scrollX: 0, scrollY: 0 })

  let paneEl: HTMLDivElement | null = null
  let paneRect: DOMRect | null = null
  let scrollInterval: NodeJS.Timeout | undefined
  let scrollZones: {
    top: boolean
    bottom: boolean
    left: boolean
    right: boolean
  } | null = null

  const setPaneEl = (el: HTMLDivElement | null) => {
    paneEl = el
  }

  const updatePaneRect = () => {
    if (paneEl) paneRect = paneEl.getBoundingClientRect()
  }

  const clearScrollInterval = () => {
    if (scrollInterval) {
      clearInterval(scrollInterval)
      scrollInterval = undefined
      scrollZones = null
    }
  }

  const handlePointerMove = (e: MouseEvent) => {
    if (!paneEl) return
    if (!paneRect) updatePaneRect()
    if (!paneRect) return

    const localX = Math.round(e.clientX - paneRect.left)
    const localY = Math.round(e.clientY - paneRect.top)
    viewPos.set({ x: Math.max(localX, 0), y: Math.max(localY, 0) })

    const v = get(view)
    if (v.moveStep && !v.dragging) {
      view.update(s => ({ ...s, dragging: true }))
    }

    if (v.dragging && v.moveStep) {
      const vp = deps.getViewport()
      const scale = vp?.zoom || 1
      if (scale !== v.scale) {
        view.update(s => ({ ...s, scale }))
      }

      const adjustedX = (e.clientX - paneRect.left - v.moveStep.offsetX) / scale
      const adjustedY = (e.clientY - paneRect.top - v.moveStep.offsetY) / scale
      view.update(s => ({ ...s, dragSpot: { x: adjustedX, y: adjustedY } }))

      // Hover detection over DragZones
      let hovering = false
      const zones = get(view).dropzones
      for (const [dzKey, dz] of Object.entries(zones)) {
        const rect: DOMRect = dz.dims
        if (
          e.clientX < rect.right &&
          e.clientX > rect.left &&
          e.clientY < rect.bottom &&
          e.clientY > rect.top
        ) {
          hovering = true
          view.update(s => ({ ...s, droptarget: dzKey }))
          break
        }
      }
      if (!hovering && get(view).droptarget) {
        view.update(s => ({ ...s, droptarget: null }))
      }

      // Auto-scroll near edges using Svelte Flow viewport
      const buffer = 100
      const rightEdge = paneRect.width - (v.moveStep.w || 0)
      const zonesState = {
        top: localY < buffer,
        bottom: localY > paneRect.height - buffer,
        left: localX < buffer,
        right: localX > rightEdge,
      }
      const anyActive = Object.values(zonesState).some(Boolean)

      if (anyActive) {
        if (!scrollInterval) {
          scrollZones = zonesState
          scrollInterval = setInterval(() => {
            const active = scrollZones || zonesState
            const bump = 30
            const xInterval = active.right ? -bump : active.left ? bump : 0
            const yInterval = active.bottom ? -bump : active.top ? bump : 0

            const current = deps.getViewport()
            if (current) {
              deps.setViewport({
                x: (current.x || 0) + xInterval,
                y: (current.y || 0) + yInterval,
                zoom: current.zoom,
              })
            }
            contentPos.update(s => ({
              scrollX: s.scrollX + xInterval,
              scrollY: s.scrollY + yInterval,
            }))
          }, 30)
        } else {
          scrollZones = zonesState
        }
      } else {
        clearScrollInterval()
      }
    } else {
      clearScrollInterval()
    }
  }

  const onDocMouseUp = () => {
    const current = get(view)
    const hasMoveStep = Boolean(current.moveStep)
    if (current.dragging || hasMoveStep) {
      if (current.dragging && current.droptarget) {
        try {
          const sel = deps.getSelectedAutomation()
          const sourceBlock = sel.blockRefs?.[current.moveStep?.id as string]
          const sourcePath = sourceBlock?.pathTo
          const drop = current.dropzones[current.droptarget]
          const destPath = drop?.path
          if (sourcePath && destPath && sel.data) {
            deps.moveBlock({ sourcePath, destPath, automationData: sel.data })
          }
        } catch (e) {
          console.error("Drag drop move failed", e)
        }
      }
      view.update(s => ({
        ...s,
        dragging: false,
        moveStep: null,
        dragSpot: null,
        dropzones: {},
        droptarget: null,
      }))
      contentPos.set({ scrollX: 0, scrollY: 0 })
      clearScrollInterval()
    }
  }

  const initDnD = () => {
    document.addEventListener("mouseup", onDocMouseUp)
  }

  const destroyDnD = () => {
    clearScrollInterval()
    document.removeEventListener("mouseup", onDocMouseUp)
  }

  return {
    view,
    viewPos,
    contentPos,
    setPaneEl,
    updatePaneRect,
    handlePointerMove,
    initDnD,
    destroyDnD,
  }
}
