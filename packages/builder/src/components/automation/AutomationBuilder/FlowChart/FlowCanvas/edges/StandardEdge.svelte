<script lang="ts">
  import {
    getSmoothStepPath,
    BaseEdge,
    type Position,
  } from "@xyflow/svelte"
  import { type LayoutDirection } from "@budibase/types"
  import { ActionStepID } from "@/constants/backend/automations"
  import {
    ViewMode,
    type EdgeData,
    type FlowBlockContext,
  } from "@/types/automations"
  import { selectedAutomation, automationStore } from "@/stores/builder"
  import StandardEdgeLabel from "./StandardEdgeLabel.svelte"
  import { dragState } from "../DragState"

  interface Props {
    data: EdgeData
    sourceX: number
    sourceY: number
    targetX: number
    targetY: number
    sourcePosition: Position
    targetPosition: Position
  }

  let {
    data,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  }: Props = $props()

  const deriveBlockContext = (
    edgeData: EdgeData | undefined
  ): FlowBlockContext | undefined => {
    if (edgeData && "loopStepId" in edgeData) {
      const loopChildInsertIndex = edgeData.loopChildInsertIndex
      return {
        ...edgeData.block,
        insertIntoLoopV2: true,
        loopStepId: edgeData.loopStepId,
        ...(loopChildInsertIndex !== undefined ? { loopChildInsertIndex } : {}),
      } as any
    }
    return edgeData?.block
  }

  const resolveBlockId = (ctx: FlowBlockContext | undefined) => {
    if (!ctx) return undefined
    if ("branchNode" in ctx && ctx.branchNode) return ctx.branchStepId
    return ctx.id
  }

  const clamp = (v: number, min: number, max: number) =>
    Math.max(min, Math.min(max, v))

  let viewMode = $derived($automationStore.viewMode as ViewMode)
  let block = $derived(deriveBlockContext(data))
  let direction = $derived((data?.direction || "TB") as LayoutDirection)
  let passedPathTo = $derived(data?.pathTo)
  let automation = $derived($selectedAutomation?.data)

  let basePath = $derived(
    getSmoothStepPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
      sourcePosition,
      targetPosition,
      borderRadius: 12,
    })
  )

  let isSubflowEdge = $derived(data.isSubflowEdge === true)

  let labelX = $derived(basePath[1])
  let labelY = $derived(basePath[2])
  let path = $derived(basePath)

  let blockId = $derived(
    resolveBlockId(data?.block as FlowBlockContext | undefined)
  )
  let blockRef = $derived(
    blockId ? $selectedAutomation?.blockRefs?.[blockId] : undefined
  )
  let sourcePathForDrop = $derived(passedPathTo || blockRef?.pathTo)

  let collectBlockExists = $derived(
    viewMode === ViewMode.EDITOR && blockRef && $selectedAutomation?.data
      ? automationStore.actions
          .getPathSteps(blockRef.pathTo, $selectedAutomation.data)
          .some(step => step.stepId === ActionStepID.COLLECT)
      : false
  )
  let hideEdge = $derived(viewMode === ViewMode.EDITOR && collectBlockExists)

  let showEdgeActions = $derived(
    viewMode === ViewMode.EDITOR &&
      !$dragState.isDragging &&
      !isSubflowEdge
  )

  let showEdgeDrop = $derived(
    viewMode === ViewMode.EDITOR &&
      $dragState.isDragging &&
      !isSubflowEdge
  )

  let isLR = $derived(direction === "LR")
  let dx = $derived(Math.abs((targetX ?? 0) - (sourceX ?? 0)))
  let dzWidth = $derived(isLR ? clamp(Math.round(dx - 140), 160, 320) : 320)
  let baseOffset = $derived(isLR ? -18 : 0)
  let nudge = $derived(isLR ? ((Math.round(sourceX + targetX) % 3) - 1) * 6 : 0)
  let dzOffsetY = $derived(baseOffset + nudge)

  const handleBranch = () => {
    const targetPath = blockRef?.pathTo
    if (targetPath && automation) {
      automationStore.actions.branchAutomation(targetPath, automation)
    }
  }
</script>

{#if !hideEdge}
  <BaseEdge path={path[0]} />
{/if}

<StandardEdgeLabel
  {labelX}
  {labelY}
  {showEdgeActions}
  {showEdgeDrop}
  {collectBlockExists}
  {sourcePathForDrop}
  {block}
  {handleBranch}
  {dzWidth}
  {dzOffsetY}
/>
