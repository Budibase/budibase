<script>
  import { automationStore, selectedAutomation, tables } from "@/stores/builder"
  import { Modal } from "@budibase/bbui"
  import { sdk } from "@budibase/shared-core"
  import CreateWebhookModal from "@/components/automation/Shared/CreateWebhookModal.svelte"
  import { ActionStepID } from "@/constants/backend/automations"
  import { AutomationStepType } from "@budibase/types"
  import FlowItemActions from "./FlowItemActions.svelte"
  import FlowItemStatus from "./FlowItemStatus.svelte"
  import DragHandle from "@/components/design/settings/controls/DraggableList/drag-handle.svelte"
  import { getContext } from "svelte"
  import DragZone from "./DragZone.svelte"
  import InfoDisplay from "@/pages/builder/app/[application]/design/[screenId]/[componentId]/_components/Component/InfoDisplay.svelte"
  import BlockHeader from "../../SetupPanel/BlockHeader.svelte"

  export let block
  export let blockRef
  export let automation
  export let draggable = true

  const view = getContext("draggableView")
  const pos = getContext("viewPos")
  const contentPos = getContext("contentPos")

  let webhookModal
  let blockEle
  let positionStyles
  let blockDims

  $: pathSteps = loadSteps(blockRef)

  $: collectBlockExists = pathSteps.some(
    step => step.stepId === ActionStepID.COLLECT
  )

  $: isTrigger = block.type === AutomationStepType.TRIGGER
  $: lastStep = blockRef?.terminating

  $: triggerInfo = sdk.automations.isRowAction($selectedAutomation?.data) && {
    title: "Automation trigger",
    tableName: $tables.list.find(
      x =>
        x._id === $selectedAutomation.data?.definition?.trigger?.inputs?.tableId
    )?.name,
  }

  $: selectedNodeId = $automationStore.selectedNodeId
  $: selected = block.id === selectedNodeId
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

  const updateBlockDims = () => {
    if (!blockEle) {
      return
    }
    const { width, height, top, left } = blockEle.getBoundingClientRect()
    blockDims = {
      width: width / $view.scale,
      height: height / $view.scale,
      top,
      left,
    }
  }

  const loadSteps = blockRef => {
    return blockRef
      ? automationStore.actions.getPathSteps(blockRef.pathTo, automation)
      : []
  }

  const move = (block, dragPos, dragging, scrollX, scrollY) => {
    if ((!block && !dragging) || !dragPos) {
      return
    }
    positionStyles = `
      --blockPosX: ${Math.round(dragPos.x - scrollX / $view.scale)}px;
      --blockPosY: ${Math.round(dragPos.y - scrollY / $view.scale)}px;
    `
  }

  const buildPlaceholderStyles = dims => {
    if (!dims) {
      return ""
    }
    const { width, height } = dims
    return `--pswidth: ${Math.round(width)}px;
            --psheight: ${Math.round(height)}px;`
  }

  const onHandleMouseDown = e => {
    if (isTrigger) {
      e.preventDefault()
      return
    }

    e.stopPropagation()

    updateBlockDims()

    const { clientX, clientY } = e
    view.update(state => ({
      ...state,
      moveStep: {
        id: block.id,
        offsetX: $pos.x,
        offsetY: $pos.y,
        w: blockDims.width,
        h: blockDims.height,
        mouse: {
          x: Math.max(Math.round(clientX - blockDims.left), 0),
          y: Math.max(Math.round(clientY - blockDims.top), 0),
        },
      },
    }))
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
  >
    <div class="wrap">
      {#if $view.dragging && dragging}
        <div class="drag-placeholder" style={placeholderDims} />
      {/if}
      <div
        bind:this={blockEle}
        class="block-content"
        class:dragging={$view.dragging && dragging}
        style={positionStyles}
        on:mousedown={e => {
          e.stopPropagation()
        }}
      >
        <div class="block-float">
          <FlowItemStatus {block} {automation} hideStatus={$view?.dragging} />
        </div>
        {#if draggable}
          <div
            class="handle"
            class:grabbing={dragging}
            on:mousedown={onHandleMouseDown}
          >
            <DragHandle />
          </div>
        {/if}
        <div
          class="block-core"
          on:click={async () => {
            await automationStore.actions.selectNode(block.id)
          }}
        >
          <div class="blockSection block-info">
            <BlockHeader
              disabled
              {automation}
              {block}
              on:update={e =>
                automationStore.actions.updateBlockTitle(block, e.detail)}
            />
          </div>

          {#if isTrigger && triggerInfo}
            <div class="blockSection">
              <InfoDisplay
                title={triggerInfo.title}
                body="This trigger is tied to your '{triggerInfo.tableName}' table"
                icon="InfoOutline"
              />
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
  {#if !collectBlockExists || !lastStep}
    <div class="separator" />
    {#if $view.dragging}
      <DragZone path={blockRef?.pathTo} />
    {:else}
      <FlowItemActions
        {block}
        on:branch={() => {
          automationStore.actions.branchAutomation(
            $selectedAutomation.blockRefs[block.id].pathTo,
            automation
          )
        }}
      />
    {/if}
    {#if !lastStep}
      <div class="separator" />
    {/if}
  {/if}
{/if}

<Modal bind:this={webhookModal} width="30%">
  <CreateWebhookModal />
</Modal>

<style>
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
    width: 360px;
    font-size: 16px;
    border-radius: 4px;
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
    background-color: var(--grey-3);
    padding: 6px;
    color: var(--grey-6);
    cursor: grab;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
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
    border: 1px solid var(--grey-3);
    border-radius: 4px;
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
    border-radius: 4px;
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
    left: 0px;
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
</style>
