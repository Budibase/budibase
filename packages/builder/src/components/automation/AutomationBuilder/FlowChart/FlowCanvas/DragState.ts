import { writable, get } from "svelte/store"
import type { Automation, BlockPath, BlockRef } from "@budibase/types"

/**
 * Simplified drag-and-drop state for automation step reordering.
 * Replaces the complex FlowChartDnD.ts (~228 lines) with a minimal reactive store (~120 lines).
 *
 * Key simplifications:
 * - No manual auto-scroll (Svelte Flow handles viewport, user can pan)
 * - No complex interval-based position tracking
 * - Simple dropzone registration via Map
 * - Direct pointer event handling
 */

export interface DragState {
  isDragging: boolean
  draggedStepId: string | null
  dropTarget: string | null
  // Visual position for the dragged element (relative to viewport)
  dragPosition: { x: number; y: number } | null
  // Initial offset from mouse to element corner
  dragOffset: { x: number; y: number } | null
  // Element dimensions for placeholder
  elementDims: { width: number; height: number } | null
}

export interface DropZoneInfo {
  path: BlockPath[]
}

interface DragDeps {
  moveBlock: (args: {
    sourcePath: BlockPath[]
    destPath: BlockPath[]
    automationData: Automation
  }) => Promise<void> | void
  getBlockRefs: () => Record<string, BlockRef> | undefined
  getAutomation: () => Automation | undefined
  getViewportZoom?: () => number
}

const createDragState = () => {
  const state = writable<DragState>({
    isDragging: false,
    draggedStepId: null,
    dropTarget: null,
    dragPosition: null,
    dragOffset: null,
    elementDims: null,
  })

  // Store registered drop zones
  const dropZones = new Map<string, DropZoneInfo>()

  let deps: DragDeps | null = null
  let containerRect: DOMRect | null = null

  const init = (dependencies: DragDeps) => {
    deps = dependencies
  }

  const setContainerRect = (rect: DOMRect | null) => {
    containerRect = rect
  }

  const startDrag = (
    stepId: string,
    mouseX: number,
    mouseY: number,
    elementRect: DOMRect
  ) => {
    state.set({
      isDragging: true,
      draggedStepId: stepId,
      dropTarget: null,
      dragPosition: { x: mouseX, y: mouseY },
      dragOffset: {
        x: mouseX - elementRect.left,
        y: mouseY - elementRect.top,
      },
      elementDims: {
        width: elementRect.width,
        height: elementRect.height,
      },
    })

    // Add global listeners
    document.addEventListener("pointermove", handlePointerMove)
    document.addEventListener("pointerup", handlePointerUp)
  }

  const handlePointerMove = (e: PointerEvent) => {
    const current = get(state)
    if (!current.isDragging || !containerRect) return

    const zoom = deps?.getViewportZoom?.() ?? 1

    // Calculate position relative to container, adjusted for zoom
    const relativeX = (e.clientX - containerRect.left) / zoom
    const relativeY = (e.clientY - containerRect.top) / zoom

    state.update(s => ({
      ...s,
      dragPosition: {
        x: relativeX - (s.dragOffset?.x ?? 0) / zoom,
        y: relativeY - (s.dragOffset?.y ?? 0) / zoom,
      },
    }))

    // Check drop zones
    let foundTarget: string | null = null
    for (const [zoneId, _info] of dropZones) {
      const zoneEl = document.getElementById(`dz-${zoneId}`)
      if (zoneEl) {
        const rect = zoneEl.getBoundingClientRect()
        if (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          foundTarget = zoneId
          break
        }
      }
    }

    if (foundTarget !== current.dropTarget) {
      state.update(s => ({ ...s, dropTarget: foundTarget }))
    }
  }

  const handlePointerUp = async () => {
    document.removeEventListener("pointermove", handlePointerMove)
    document.removeEventListener("pointerup", handlePointerUp)

    const current = get(state)

    if (current.isDragging && current.dropTarget && current.draggedStepId) {
      const dropZone = dropZones.get(current.dropTarget)
      const blockRefs = deps?.getBlockRefs()
      const automation = deps?.getAutomation()

      if (dropZone && blockRefs && automation) {
        const sourceBlock = blockRefs[current.draggedStepId]
        const sourcePath = sourceBlock?.pathTo

        if (sourcePath && dropZone.path) {
          try {
            await deps?.moveBlock({
              sourcePath,
              destPath: dropZone.path,
              automationData: automation,
            })
          } catch (e) {
            console.error("Drag drop move failed", e)
          }
        }
      }
    }

    state.set({
      isDragging: false,
      draggedStepId: null,
      dropTarget: null,
      dragPosition: null,
      dragOffset: null,
      elementDims: null,
    })
  }

  const setDropTarget = (zoneId: string | null) => {
    state.update(s => ({
      ...s,
      dropTarget: zoneId,
    }))
  }

  const cancelDrag = () => {
    document.removeEventListener("pointermove", handlePointerMove)
    document.removeEventListener("pointerup", handlePointerUp)
    state.set({
      isDragging: false,
      draggedStepId: null,
      dropTarget: null,
      dragPosition: null,
      dragOffset: null,
      elementDims: null,
    })
  }

  const registerDropZone = (zoneId: string, info: DropZoneInfo) => {
    dropZones.set(zoneId, info)
  }

  const unregisterDropZone = (zoneId: string) => {
    dropZones.delete(zoneId)
    state.update(s => ({
      ...s,
      dropTarget: s.dropTarget === zoneId ? null : s.dropTarget,
    }))
  }

  return {
    subscribe: state.subscribe,
    init,
    setContainerRect,
    startDrag,
    setDropTarget,
    cancelDrag,
    registerDropZone,
    unregisterDropZone,
  }
}

// Singleton instance for the automation builder
export const dragState = createDragState()
