<script lang="ts">
  import { automationStore, selectedAutomation, tables } from "@/stores/builder"
  import { ViewMode } from "@/types/automations"
  import { sdk } from "@budibase/shared-core"
  import FlowItemStatus from "./FlowItemStatus.svelte"
  import { getContext } from "svelte"
  import { type Writable } from "svelte/store"
  import InfoDisplay from "@/pages/builder/workspace/[application]/design/[workspaceAppId]/[screenId]/[componentId]/_components/Component/InfoDisplay.svelte"
  import BlockHeader from "../../SetupPanel/BlockHeader.svelte"
  import {
    AutomationStepType,
    type Automation,
    type AutomationStep,
    type AutomationTrigger,
    type AutomationStepResult,
    type AutomationTriggerResult,
    type AutomationResults,
  } from "@budibase/types"
  import {
    getRunHighlight,
    isTerminalFailure,
    hasSuccessOutput,
    isAutomationStepResult,
    getRunResults,
    type RunHighlight,
  } from "./FlowCanvas/FlowRunHelpers"
  import { type DragView } from "./FlowCanvas/FlowChartDnD"

  type FlowItemStatusResult =
    | AutomationStepResult
    | AutomationTriggerResult
    | undefined

  export let block: AutomationStep | AutomationTrigger
  export let automation: Automation | undefined
  export let draggable: boolean = true
  export let logStepData:
    | AutomationStepResult
    | AutomationTriggerResult
    | null = null
  export let statusResult: FlowItemStatusResult | null = null
  export let runResults: AutomationResults | undefined = undefined
  export let triggerCompleted: boolean | undefined = undefined
  export let viewMode: ViewMode = ViewMode.EDITOR
  export let selectedLogStepId: string | null = null
  export let unexecuted: boolean = false
  export let onStepSelect: (
    _data: AutomationStepResult | AutomationTriggerResult
  ) => void = () => {}
  const view = getContext<Writable<DragView>>("draggableView")
  const pos = getContext<Writable<{ x: number; y: number }>>("viewPos")
  const contentPos =
    getContext<Writable<{ scrollX: number; scrollY: number }>>("contentPos")
  const focusNodeRequest =
    getContext<Writable<{ nodeId: string; ensureVisible?: boolean } | null>>(
      "focusNodeRequest"
    )

  let blockEle: HTMLDivElement | null
  let positionStyles: string | undefined
  let blockDims: DOMRect | undefined
  let pressingDraggableNode = false
  let draggedDuringPress = false

  $: isTrigger = block.type === AutomationStepType.TRIGGER
  $: viewMode = $automationStore.viewMode
  $: testStatusResult = automationStore.actions.processBlockResults(
    $automationStore.testResults,
    block
  ) as FlowItemStatusResult
  $: resolvedStatusResult = statusResult ?? testStatusResult
  $: resolvedRunResults =
    runResults || getRunResults($automationStore.testResults)
  $: resolvedTriggerCompleted =
    triggerCompleted ??
    (isTrigger &&
      !$view?.dragging &&
      (!!$automationStore.inProgressTest || !!testStatusResult))
  $: blockSuccess = hasSuccessOutput(resolvedStatusResult)
    ? resolvedStatusResult.outputs.success === true
    : isTrigger && resolvedTriggerCompleted
  $: blockFailed = hasSuccessOutput(resolvedStatusResult)
    ? resolvedStatusResult.outputs.success === false
    : false
  $: terminalFailure =
    !isTrigger && isAutomationStepResult(resolvedStatusResult)
      ? isTerminalFailure(resolvedStatusResult)
      : false
  $: continuedFailure = blockFailed && !terminalFailure
  $: runHighlight = getRunHighlight(resolvedRunResults)
  $: blockExecuted = hasSuccessOutput(resolvedStatusResult)
    ? true
    : isTrigger && resolvedTriggerCompleted
  $: successHighlight = blockExecuted
    ? runHighlight
      ? runHighlight === "success"
      : blockSuccess || continuedFailure
    : false
  $: errorHighlight = blockExecuted
    ? runHighlight
      ? runHighlight === "error"
      : terminalFailure
    : false
  $: warnHighlight = blockExecuted ? runHighlight === "stopped" : false
  $: triggerIconColor = getTriggerIconColor({
    selected,
    errorHighlight,
    successHighlight,
    warnHighlight,
    triggerCompleted: resolvedTriggerCompleted,
    runHighlight,
  })
  $: blockRef = block?.id
    ? $selectedAutomation?.blockRefs?.[block.id]
    : undefined
  $: isInsideLoop = blockRef?.pathTo?.some(hop => hop.loopStepId) ?? false

  $: triggerInfo = (() => {
    const automationData = $selectedAutomation.data
    if (!automationData) {
      return undefined
    }
    if (!sdk.automations.isRowAction(automationData)) {
      return undefined
    }
    const triggerInputs = automationData.definition.trigger.inputs
    return {
      title: "Automation trigger",
      tableName: $tables.list.find(x => x._id === triggerInputs.tableId)?.name,
    }
  })()

  $: selectedNodeId = $automationStore.selectedNodeId as string | undefined
  $: selected =
    viewMode === ViewMode.EDITOR
      ? block.id === selectedNodeId
      : viewMode === ViewMode.LOGS && block.id === selectedLogStepId
  $: dragging =
    $view?.dragging && $view?.moveStep && $view?.moveStep?.id === block.id
  $: if (pressingDraggableNode && dragging) {
    draggedDuringPress = true
  }

  $: if (dragging && blockEle) {
    updateBlockDims()
  }

  $: placeholderDims = buildPlaceholderStyles(blockDims)

  // Move the selected item
  // Listen for scrolling in the content. As its scrolled this will be updated
  $: move(
    blockEle,
    $view?.dragSpot,
    dragging,
    $contentPos?.scrollX,
    $contentPos?.scrollY
  )

  function updateBlockDims() {
    if (!blockEle) return
    const rect = blockEle.getBoundingClientRect()
    blockDims = rect
  }

  function move(
    block: HTMLElement | null,
    dragPos: { x: number; y: number } | null,
    dragging: boolean | null,
    scrollX: number,
    scrollY: number
  ) {
    if ((!block && !dragging) || !dragPos) {
      return
    }
    positionStyles = `
      --blockPosX: ${Math.round(dragPos.x - scrollX / $view.scale)}px;
      --blockPosY: ${Math.round(dragPos.y - scrollY / $view.scale)}px;
    `
  }

  function buildPlaceholderStyles(dims?: DOMRect) {
    if (!dims) {
      return ""
    }
    const { width, height } = dims
    return `--pswidth: ${Math.round(width)}px;
            --psheight: ${Math.round(height)}px;`
  }

  function onNodeMouseDown(e: MouseEvent) {
    if (!draggable || isTrigger || isInsideLoop) {
      e.preventDefault()
      return
    }

    e.stopPropagation()
    pressingDraggableNode = true
    draggedDuringPress = false

    updateBlockDims()

    const { clientX, clientY } = e
    view.update((state: DragView) => ({
      ...state,
      moveStep: {
        id: block.id,
        offsetX: $pos.x,
        offsetY: $pos.y,
        startX: clientX,
        startY: clientY,
        w: blockDims?.width,
        h: blockDims?.height,
        mouse: {
          x: Math.max(Math.round(clientX - (blockDims?.left || 0)), 0),
          y: Math.max(Math.round(clientY - (blockDims?.top || 0)), 0),
        },
      },
    }))
  }

  function handleHeaderUpdate(e: CustomEvent) {
    automationStore.actions.updateBlockTitle(block, e.detail)
  }

  function getTriggerIconColor({
    selected,
    errorHighlight,
    successHighlight,
    warnHighlight,
    triggerCompleted,
    runHighlight,
  }: {
    selected: boolean
    errorHighlight: boolean
    successHighlight: boolean
    warnHighlight: boolean
    triggerCompleted: boolean
    runHighlight: RunHighlight | undefined
  }) {
    if (selected && errorHighlight) {
      return "var(--spectrum-semantic-negative-color-status)"
    }
    if (selected && successHighlight) {
      return "var(--spectrum-semantic-positive-color-status)"
    }
    if ((selected || triggerCompleted) && warnHighlight) {
      return "var(--spectrum-global-color-orange-500)"
    }
    if (triggerCompleted && runHighlight !== "error") {
      return "var(--spectrum-semantic-positive-color-status)"
    }
    if (selected) {
      return "var(--spectrum-global-color-blue-700)"
    }
    return "var(--spectrum-global-color-gray-500)"
  }
</script>

<svelte:window
  on:mouseup={() => {
    pressingDraggableNode = false
  }}
/>

{#if block.stepId !== "LOOP"}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    id={`block-${block.id}`}
    class={`block ${block.type} hoverable`}
    class:dragging
    class:pressingDraggableNode
    class:draggable={draggable && !isInsideLoop}
    class:selected
    class:success={successHighlight}
    class:error={errorHighlight}
    class:warn={warnHighlight}
    class:unexecuted
  >
    <div class="wrap">
      {#if $view?.dragging && dragging}
        <div class="drag-placeholder" style={placeholderDims}></div>
      {/if}
      <div
        bind:this={blockEle}
        class="block-content"
        class:dragging={$view?.dragging && dragging}
        style={positionStyles}
        on:mousedown={onNodeMouseDown}
      >
        <div class="block-float">
          <FlowItemStatus
            {block}
            branch={undefined}
            hideStatus={$view?.dragging}
            {logStepData}
            {viewMode}
            showFlowStatus={false}
          />
        </div>
        {#if !isTrigger}
          <div class="block-status">
            <FlowItemStatus
              {block}
              branch={undefined}
              hideStatus={$view?.dragging}
              {logStepData}
              {viewMode}
              showBlockType={false}
              iconOnly
            />
          </div>
        {/if}
        <div
          class="block-core"
          class:has-status={!isTrigger}
          on:click={async () => {
            if (draggedDuringPress) {
              draggedDuringPress = false
              return
            }

            if (viewMode === ViewMode.EDITOR) {
              await automationStore.actions.selectNode(block.id)
              focusNodeRequest.set({ nodeId: block.id, ensureVisible: true })
            } else if (viewMode === ViewMode.LOGS && logStepData) {
              onStepSelect(logStepData)
            }
          }}
        >
          <div class="blockSection block-info">
            <BlockHeader
              disabled
              compact
              {automation}
              {block}
              showTriggerIcon={isTrigger}
              {triggerIconColor}
              on:update={handleHeaderUpdate}
            />
          </div>

          {#if isTrigger && triggerInfo}
            <div class="blockSection">
              <InfoDisplay
                title={triggerInfo.title}
                body="This trigger is tied to your '{triggerInfo.tableName}' table"
                icon="info"
              />
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .unexecuted {
    opacity: 0.5;
  }
  .delete-padding {
    padding-left: 30px;
  }
  .block-options {
    justify-content: flex-end;
    align-items: center;
    display: flex;
    gap: var(--spacing-m);
  }
  .center-items {
    display: flex;
    align-items: center;
  }
  .splitHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .iconAlign {
    padding: 0 0 0 var(--spacing-m);
    display: inline-block;
  }
  .block {
    width: 100%;
    max-width: 100%;
    font-size: var(--spectrum-global-dimension-font-size-150) !important;
    border-radius: 32px;
    font-weight: 600;
    cursor: default;
  }
  .block .wrap {
    width: 100%;
    min-width: 100%;
    position: relative;
  }
  .block.draggable .wrap {
    display: block;
  }
  .block .wrap .block-content {
    width: 100%;
    max-width: 100%;
    display: flex;
    flex-direction: row;
    position: relative;
    background-color: var(--automation-flow-item-background, var(--background));
    border: 0.5px solid var(--spectrum-global-color-gray-200);
    border-radius: 16px;
    box-sizing: border-box;
  }
  .blockSection {
    padding: 0;
  }
  .separator {
    width: 1px;
    height: 25px;
    border-left: 1px dashed var(--grey-4);
    color: var(--grey-4);
    align-self: center;
  }
  .blockTitle {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
  }
  .drag-placeholder {
    height: calc(var(--psheight) - 2px);
    width: var(--pswidth);
    background-color: rgba(92, 92, 92, 0.1);
    border: 1px dashed #5c5c5c;
    border-radius: 8px;
    display: block;
  }
  .block-core {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 100%;
    min-width: 0;
  }
  .block-core.has-status {
    padding-right: 32px;
  }
  .block-core.dragging {
    pointer-events: none;
  }
  .block-content.dragging {
    position: absolute;
    z-index: 3;
    top: var(--blockPosY);
    left: var(--blockPosX);
  }
  .block-float {
    pointer-events: none;
    width: 100%;
    position: absolute;
    top: -35px;
    left: 0;
  }
  .block-status {
    pointer-events: none;
    width: 26px;
    height: 26px;
    position: absolute;
    right: 13px;
    top: 50%;
    transform: translateY(calc(-50% + 3px));
    z-index: 1;
  }
  .block-core {
    cursor: pointer;
  }
  .block.draggable .block-content {
    cursor: pointer;
  }
  .block.draggable .block-core {
    cursor: pointer;
  }
  .block.draggable.pressingDraggableNode .block-content,
  .block.draggable.pressingDraggableNode .block-core {
    cursor: grab;
  }
  .block.draggable .block-content.dragging {
    cursor: grabbing;
  }
  .block.draggable .block-content.dragging .block-core {
    cursor: grabbing;
  }
  .block.selected .block-content {
    border-color: var(--spectrum-global-color-blue-600);
    border-width: 2px;
  }
  .block.success .block-content {
    border-color: var(--spectrum-semantic-positive-color-status);
    border-width: 2px;
  }
  .block.success.selected .block-content {
    border-width: 3px;
  }
  .block.error .block-content {
    border-color: var(--spectrum-semantic-negative-color-status);
    border-width: 2px;
  }
  .block.error.selected .block-content {
    border-width: 3px;
  }

  .block.warn .block-content {
    border-color: var(--spectrum-global-color-orange-500);
    border-width: 2px;
  }
  .block.warn.selected .block-content {
    border-width: 3px;
  }

  .block-info {
    pointer-events: none;
    width: 100%;
    height: 100%;
  }
  .block-info :global(.block-details.compact) {
    width: 100%;
    max-width: 100%;
    flex: 1 1 auto;
  }
  .block-info :global(.heading.compact) {
    flex: 1 1 auto;
  }

  .log-status-badge {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    margin-top: var(--spacing-s);
    padding: var(--spacing-xs) var(--spacing-s);
    border-radius: 4px;
    font-size: 12px;
  }

  .status-indicator {
    font-weight: bold;
    font-size: 14px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }

  .status-indicator.status-success {
    background: var(--spectrum-global-color-green-600);
  }

  .status-indicator.status-error {
    background: var(--spectrum-global-color-red-600);
  }

  .status-text {
    font-weight: 600;
    text-transform: uppercase;
  }
</style>
