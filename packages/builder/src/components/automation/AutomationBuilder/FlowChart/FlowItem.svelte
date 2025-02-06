<script>
  import {
    automationStore,
    permissions,
    selectedAutomation,
    tables,
  } from "@/stores/builder"
  import {
    Icon,
    Divider,
    Layout,
    Detail,
    Modal,
    Label,
    AbsTooltip,
  } from "@budibase/bbui"
  import { sdk } from "@budibase/shared-core"
  import AutomationBlockSetup from "../../SetupPanel/AutomationBlockSetup.svelte"
  import CreateWebhookModal from "@/components/automation/Shared/CreateWebhookModal.svelte"
  import FlowItemHeader from "./FlowItemHeader.svelte"
  import RoleSelect from "@/components/design/settings/controls/RoleSelect.svelte"
  import { ActionStepID, TriggerStepID } from "@/constants/backend/automations"
  import { AutomationStepType } from "@budibase/types"
  import FlowItemActions from "./FlowItemActions.svelte"
  import DragHandle from "@/components/design/settings/controls/DraggableList/drag-handle.svelte"
  import { getContext } from "svelte"
  import DragZone from "./DragZone.svelte"
  import InfoDisplay from "@/pages/builder/app/[application]/design/[screenId]/[componentId]/_components/Component/InfoDisplay.svelte"

  export let block
  export let blockRef
  export let testDataModal
  export let idx
  export let automation
  export let bindings
  export let draggable = true

  const view = getContext("draggableView")
  const pos = getContext("viewPos")
  const contentPos = getContext("contentPos")

  let webhookModal
  let open = true
  let showLooping = false
  let role
  let blockEle
  let positionStyles
  let blockDims

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

  $: pathSteps = loadSteps(blockRef)

  $: collectBlockExists = pathSteps.some(
    step => step.stepId === ActionStepID.COLLECT
  )
  $: automationId = automation?._id
  $: isTrigger = block.type === AutomationStepType.TRIGGER
  $: lastStep = blockRef?.terminating

  $: loopBlock = pathSteps.find(x => x.blockToLoop === block.id)
  $: isAppAction = block?.stepId === TriggerStepID.APP
  $: isAppAction && setPermissions(role)
  $: isAppAction && getPermissions(automationId)

  $: triggerInfo = sdk.automations.isRowAction($selectedAutomation?.data) && {
    title: "Automation trigger",
    tableName: $tables.list.find(
      x =>
        x._id === $selectedAutomation.data?.definition?.trigger?.inputs?.tableId
    )?.name,
  }

  $: selected = $view?.moveStep && $view?.moveStep?.id === block.id

  $: if (selected && blockEle) {
    updateBlockDims()
  }

  $: placeholderDims = buildPlaceholderStyles(blockDims)

  // Move the selected item
  // Listen for scrolling in the content. As its scrolled this will be updated
  $: move(
    blockEle,
    $view?.dragSpot,
    selected,
    $contentPos?.scrollX,
    $contentPos?.scrollY
  )

  const move = (block, dragPos, selected, scrollX, scrollY) => {
    if ((!block && !selected) || !dragPos) {
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

  async function setPermissions(role) {
    if (!role || !automationId) {
      return
    }
    await permissions.save({
      level: "execute",
      role,
      resource: automationId,
    })
  }

  async function getPermissions(automationId) {
    if (!automationId) {
      return
    }
    const perms = await permissions.forResource(automationId)
    if (!perms["execute"]) {
      role = "BASIC"
    } else {
      role = perms["execute"].role
    }
  }

  async function deleteStep() {
    await automationStore.actions.deleteAutomationBlock(blockRef.pathTo)
  }

  async function removeLooping() {
    let loopBlockRef = $selectedAutomation.blockRefs[blockRef.looped]
    await automationStore.actions.deleteAutomationBlock(loopBlockRef.pathTo)
  }

  async function addLooping() {
    const loopDefinition = $automationStore.blockDefinitions.ACTION.LOOP
    const loopBlock = automationStore.actions.constructBlock(
      "ACTION",
      "LOOP",
      loopDefinition
    )
    loopBlock.blockToLoop = block.id
    await automationStore.actions.addBlockToAutomation(
      loopBlock,
      blockRef.pathTo
    )
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
    class:selected
    class:draggable
  >
    <div class="wrap">
      {#if $view.dragging && selected}
        <div class="drag-placeholder" style={placeholderDims} />
      {/if}

      <div
        bind:this={blockEle}
        class="block-content"
        class:dragging={$view.dragging && selected}
        style={positionStyles}
        on:mousedown={e => {
          e.stopPropagation()
        }}
      >
        {#if draggable}
          <div
            class="handle"
            class:grabbing={selected}
            on:mousedown={onHandleMouseDown}
          >
            <DragHandle />
          </div>
        {/if}
        <div class="block-core">
          {#if loopBlock}
            <div class="blockSection">
              <div
                on:click={() => {
                  showLooping = !showLooping
                }}
                class="splitHeader"
              >
                <div class="center-items">
                  <svg
                    width="28px"
                    height="28px"
                    class="spectrum-Icon"
                    style="color:var(--spectrum-global-color-gray-700);"
                    focusable="false"
                  >
                    <use xlink:href="#spectrum-icon-18-Reuse" />
                  </svg>
                  <div class="iconAlign">
                    <Detail size="S">Looping</Detail>
                  </div>
                </div>

                <div class="blockTitle">
                  <AbsTooltip type="negative" text="Remove looping">
                    <Icon
                      on:click={removeLooping}
                      hoverable
                      name="DeleteOutline"
                    />
                  </AbsTooltip>

                  <div style="margin-left: 10px;" on:click={() => {}}>
                    <Icon
                      hoverable
                      name={showLooping ? "ChevronDown" : "ChevronUp"}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Divider noMargin />
            {#if !showLooping}
              <div class="blockSection">
                <Layout noPadding gap="S">
                  <AutomationBlockSetup
                    schemaProperties={Object.entries(
                      $automationStore.blockDefinitions.ACTION.LOOP.schema
                        .inputs.properties
                    )}
                    {webhookModal}
                    block={loopBlock}
                    {automation}
                    {bindings}
                  />
                </Layout>
              </div>
              <Divider noMargin />
            {/if}
          {/if}

          <FlowItemHeader
            {automation}
            {open}
            {block}
            {testDataModal}
            {idx}
            {addLooping}
            {deleteStep}
            on:toggle={() => (open = !open)}
            on:update={async e => {
              const newName = e.detail
              if (newName.length === 0) {
                await automationStore.actions.deleteAutomationName(block.id)
              } else {
                await automationStore.actions.saveAutomationName(
                  block.id,
                  newName
                )
              }
            }}
          />
          {#if open}
            <Divider noMargin />
            <div class="blockSection">
              <Layout noPadding gap="S">
                {#if isAppAction}
                  <div>
                    <Label>Role</Label>
                    <RoleSelect bind:value={role} />
                  </div>
                {/if}
                <AutomationBlockSetup
                  schemaProperties={Object.entries(
                    block?.schema?.inputs?.properties || {}
                  )}
                  {block}
                  {webhookModal}
                  {automation}
                  {bindings}
                />
                {#if isTrigger && triggerInfo}
                  <InfoDisplay
                    title={triggerInfo.title}
                    body="This trigger is tied to your '{triggerInfo.tableName}' table"
                    icon="InfoOutline"
                  />
                {/if}
              </Layout>
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
    width: 480px;
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
</style>
