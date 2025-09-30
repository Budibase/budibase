<script lang="ts">
  import { automationStore, selectedAutomation, tables } from "@/stores/builder"
  import { ViewMode } from "@/types/automations"
  import { Modal, Icon } from "@budibase/bbui"
  import { sdk } from "@budibase/shared-core"
  import CreateWebhookModal from "@/components/automation/Shared/CreateWebhookModal.svelte"
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
  } from "@budibase/types"
  import { type DragView } from "./FlowChartDnD"

  export let block: AutomationStep | AutomationTrigger
  export let automation: Automation | undefined
  export let draggable: boolean = true
  export let logStepData:
    | AutomationStepResult
    | AutomationTriggerResult
    | null = null
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

  let webhookModal: Modal | undefined
  let blockEle: HTMLDivElement | null
  let positionStyles: string | undefined
  let blockDims: DOMRect | undefined

  $: isTrigger = block.type === AutomationStepType.TRIGGER
  $: viewMode = $automationStore.viewMode

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
  $: dragging = $view?.moveStep && $view?.moveStep?.id === block.id

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

  function onHandleMouseDown(e: MouseEvent) {
    if (isTrigger) {
      e.preventDefault()
      return
    }

    e.stopPropagation()

    updateBlockDims()

    const { clientX, clientY } = e
    view.update((state: DragView) => ({
      ...state,
      moveStep: {
        id: block.id,
        offsetX: $pos.x,
        offsetY: $pos.y,
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
</script>

{#if block.stepId !== "LOOP"}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    id={`block-${block.id}`}
    class={`block ${block.type} hoverable`}
    class:dragging
    class:draggable
    class:selected
    class:unexecuted
  >
    <div class="wrap">
      {#if $view?.dragging && dragging}
        <div class="drag-placeholder" style={placeholderDims} />
      {/if}
      <div
        bind:this={blockEle}
        class="block-content"
        class:dragging={$view?.dragging && dragging}
        style={positionStyles}
      >
        <div class="block-float">
          <FlowItemStatus
            {block}
            branch={undefined}
            hideStatus={$view?.dragging}
            {logStepData}
            {viewMode}
          />
        </div>
        {#if draggable}
          <div
            class="handle"
            class:grabbing={dragging}
            on:mousedown={onHandleMouseDown}
          >
            <Icon name="dots-six-vertical" weight="bold" />
          </div>
        {/if}
        <div
          class="block-core"
          on:click={async () => {
            if (viewMode === ViewMode.EDITOR) {
              await automationStore.actions.selectNode(block.id)
            } else if (viewMode === ViewMode.LOGS && logStepData) {
              onStepSelect(logStepData)
            }
          }}
        >
          <div class="blockSection block-info">
            <BlockHeader
              disabled
              {automation}
              {block}
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

<Modal bind:this={webhookModal}>
  <CreateWebhookModal />
</Modal>

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
    width: 320px;
    font-size: var(--spectrum-global-dimension-font-size-150) !important;
    border-radius: 12px;
    font-weight: 600;
    cursor: default;
  }
  .block .wrap {
    width: 100%;
    position: relative;
  }
  .block.draggable .wrap {
    display: flex;
    flex-direction: row;
  }
  .block.draggable .wrap .handle {
    height: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--grey-1);
    padding: 6px 0;
    color: var(--grey-4);
    cursor: grab;
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
  }
  .block.draggable .wrap .handle.grabbing {
    cursor: grabbing;
  }
  .block.draggable .wrap .handle :global(.drag-handle) {
    width: 6px;
  }
  .block .wrap .block-content {
    width: 100%;
    display: flex;
    flex-direction: row;
    background-color: var(--background);
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 12px;
  }
  .blockSection {
    padding: var(--spacing-xl);
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
    border-radius: 12px;
    display: block;
  }
  .block-core {
    flex: 1;
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
  .block-core {
    cursor: pointer;
  }
  .block.selected .block-content {
    border-color: var(--spectrum-global-color-blue-700);
    transition: border 130ms ease-out;
  }

  .block-info {
    pointer-events: none;
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
