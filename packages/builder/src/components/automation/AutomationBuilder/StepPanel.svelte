<script lang="ts">
  import {
    ActionButton,
    Button,
    Divider,
    Icon,
    Modal,
    DetailSummary,
  } from "@budibase/bbui"
  import { generate } from "shortid"
  import {
    type Automation,
    type AutomationStep,
    type AutomationTrigger,
    type BlockRef,
    AutomationActionStepId,
    AutomationTriggerStepId,
    isBranchStep,
    isTrigger,
    AutomationFeature,
    isLoopV2Step,
  } from "@budibase/types"
  import { memo } from "@budibase/frontend-core"
  import {
    automationStore,
    selectedAutomation,
    evaluationContext,
  } from "@/stores/builder"
  import { getNewStepName } from "@/helpers/automations/nameHelpers"
  import BlockData from "../SetupPanel/BlockData.svelte"
  import BlockProperties from "../SetupPanel/BlockProperties.svelte"
  import BlockHeader from "../SetupPanel/BlockHeader.svelte"
  import { PropField } from "../SetupPanel"
  import RoleSelect from "@/components/common/RoleSelect.svelte"
  import { type AutomationContext } from "@/stores/builder/automations"
  import CreateWebhookModal from "@/components/automation/Shared/CreateWebhookModal.svelte"
  import { getVerticalResizeActions } from "@/components/common/resizable"
  import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"

  const [resizable, resizableHandle] = getVerticalResizeActions()

  const memoAutomation = memo<Automation | undefined>($selectedAutomation.data)
  const memoBlock = memo<AutomationStep | AutomationTrigger | undefined>()
  const memoContext = memo({} as AutomationContext)

  let role: string | undefined
  let webhookModal: Modal | undefined
  let configPanel: HTMLDivElement | undefined
  let confirmCascadeDialog: any

  $: memoAutomation.set($selectedAutomation.data)
  $: memoContext.set($evaluationContext)

  $: selectedNodeId = $automationStore.selectedNodeId
  $: blockRefs = $selectedAutomation.blockRefs
  $: blockRef = selectedNodeId ? blockRefs[selectedNodeId] : undefined
  $: block = automationStore.actions.getBlockByRef($memoAutomation, blockRef)

  $: memoBlock.set(block)

  $: isStep = !!$memoBlock && !isTrigger($memoBlock)
  $: pathSteps = loadPathSteps(blockRef, $memoAutomation)
  $: loopBlock = pathSteps.find(
    x => $memoBlock && x.blockToLoop === $memoBlock.id
  )

  // LOOP_V2: detect parent loop container
  $: loopContextId = blockRef?.pathTo?.at(-1)?.loopStepId
  $: loopV2BlockRef = loopContextId
    ? $selectedAutomation.blockRefs?.[loopContextId]
    : undefined
  $: loopV2Block = automationStore.actions.getBlockByRef(
    $memoAutomation,
    loopV2BlockRef
  )

  $: insideLoopV2 = Boolean(blockRef?.isLoopV2Child && loopV2Block)
  $: hasAnyLoop = Boolean(loopBlock || insideLoopV2)

  $: canStopLooping = checkCanStopLooping(loopV2Block)

  $: isAppAction = block?.stepId === AutomationTriggerStepId.APP
  $: isAppAction && fetchPermissions($memoAutomation?._id)
  $: isAppAction &&
    automationStore.actions.setPermissions(role, $memoAutomation)

  // Reset the panel scroll when the target node is changed
  $: resetScroll(selectedNodeId)

  const checkCanStopLooping = (
    block: AutomationStep | AutomationTrigger | undefined
  ) => {
    if (!block) return false
    if (!isLoopV2Step(block)) return false
    return block.inputs.children?.length === 1
  }

  const resetScroll = (selectedNodeId: string | undefined) => {
    if (configPanel && configPanel?.scrollTop > 0 && selectedNodeId) {
      configPanel.scrollTop = 0
    }
  }

  // When duplicating a step, especially a Loop V2 container, we need
  // regenerate IDs for the step and all nested children including branch children
  // to avoid duplicate node keys in the Svelte Flow graph.
  const cloneStepWithNewIds = (step: AutomationStep): AutomationStep => {
    const base: AutomationStep = {
      ...step,
      id: generate(),
    }

    // Recurse into Loop V2 children
    if (isLoopV2Step(base)) {
      const children = base.inputs?.children || []
      const newChildren = children.map(child => cloneStepWithNewIds(child))
      base.inputs = {
        ...(base.inputs || {}),
        children: newChildren,
      }
      return base
    }

    // Recurse into Branch step children
    if (isBranchStep(base)) {
      const branches = base.inputs?.branches || []
      const childrenMap = base.inputs?.children || {}
      const newChildrenMap: Record<string, AutomationStep[]> = {}
      branches.forEach(branch => {
        const laneChildren = childrenMap?.[branch.id] || []
        newChildrenMap[branch.id] = laneChildren.map(child =>
          cloneStepWithNewIds(child)
        )
      })
      base.inputs = {
        ...(base.inputs || {}),
        children: newChildrenMap,
      }
      return base
    }

    return base
  }

  const fetchPermissions = async (automationId?: string) => {
    if (!automationId) {
      return
    }
    role = await automationStore.actions.getPermissions(automationId)
  }

  const loadPathSteps = (
    blockRef: BlockRef | undefined,
    automation: Automation | undefined
  ) => {
    return blockRef && automation
      ? automationStore.actions.getPathSteps(blockRef.pathTo, automation)
      : []
  }

  const shouldCascadeDeleteInLoopV2 = (
    blockRef: BlockRef | undefined,
    automation: Automation | undefined
  ) => {
    if (!blockRef || !automation) return false
    const lastHop: any = blockRef.pathTo?.at(-1)
    const parentLoopId: string | undefined = lastHop?.loopStepId
    const childIndex: number | undefined = lastHop?.stepIdx
    if (!parentLoopId || !Number.isInteger(childIndex)) return false

    // If this step is inside a branch lane, don't cascade delete
    if (Number.isInteger(lastHop.branchIdx)) return false

    const loopRef = $selectedAutomation?.blockRefs?.[parentLoopId]
    const loopNode = automationStore.actions.getBlockByRef(automation, loopRef)
    if (!loopNode || loopNode.stepId !== AutomationActionStepId.LOOP_V2) {
      return false
    }
    const children = loopNode.inputs?.children || []
    if (childIndex !== 0) return false
    const nextSibling = children?.[1]
    return nextSibling?.stepId === AutomationActionStepId.BRANCH
  }
</script>

<Modal bind:this={webhookModal}>
  <CreateWebhookModal />
</Modal>

<div class="panel heading">
  <div class="details">
    <BlockHeader
      automation={$memoAutomation}
      block={$memoBlock}
      on:update={e => {
        if ($memoBlock && !isTrigger($memoBlock)) {
          automationStore.actions.updateBlockTitle($memoBlock, e.detail)
        }
      }}
    />
    <Icon
      name="x"
      hoverable
      on:click={() => {
        automationStore.actions.selectNode()
      }}
    />
  </div>
  {#if isStep}
    <div class="step-actions">
      {#if $memoBlock && !isBranchStep($memoBlock) && $memoBlock.features?.[AutomationFeature.LOOPING]}
        <ActionButton
          quiet
          noPadding
          icon="arrow-clockwise"
          on:click={async () => {
            if (!blockRef) return
            if (hasAnyLoop) {
              await automationStore.actions.removeLooping(blockRef)
            } else {
              await automationStore.actions.wrapStepInLoopV2(blockRef)
            }
          }}
          disabled={insideLoopV2 && !canStopLooping}
        >
          {hasAnyLoop ? `Stop Looping` : `Loop`}
        </ActionButton>
      {/if}
      <ActionButton
        quiet
        noPadding
        icon="trash"
        on:click={async () => {
          if (!blockRef) {
            return
          }
          if (shouldCascadeDeleteInLoopV2(blockRef, $memoAutomation)) {
            confirmCascadeDialog?.show()
            return
          }
          await automationStore.actions.deleteAutomationBlock(blockRef.pathTo)
        }}
      >
        Delete
      </ActionButton>
      {#if $memoBlock && !isBranchStep($memoBlock) && !isLoopV2Step($memoBlock) && !blockRef?.isLoopV2Child}
        <ActionButton
          quiet
          noPadding
          icon="copy"
          on:click={async () => {
            if (!blockRef || !$memoBlock || isTrigger($memoBlock)) {
              return
            }
            if (isLoopV2Step($memoBlock)) {
              return
            }
            // Deep-duplicate the selected step and re-id any nested children
            const duplicatedBlock = cloneStepWithNewIds($memoBlock)
            const newName = getNewStepName($memoAutomation, duplicatedBlock)
            duplicatedBlock.name = newName

            await automationStore.actions.addBlockToAutomation(
              duplicatedBlock,
              blockRef.pathTo
            )
          }}
        >
          Duplicate
        </ActionButton>
      {/if}
    </div>
  {/if}
</div>
<Divider noMargin />
<div class="panel config" use:resizable>
  <div class="content" bind:this={configPanel}>
    {#if loopBlock || $memoBlock?.stepId === AutomationActionStepId.LOOP_V2}
      <div class="loop">
        <DetailSummary name="Loop details" padded={false} initiallyShow>
          <BlockProperties
            block={loopBlock || loopV2Block || $memoBlock}
            context={$memoContext}
            automation={$memoAutomation}
          />
        </DetailSummary>
      </div>
      <Divider noMargin />
    {:else if isAppAction}
      <PropField label="Role" fullWidth>
        <RoleSelect bind:value={role} />
      </PropField>
    {/if}
    <span class="props">
      {#if $memoBlock?.stepId !== AutomationActionStepId.LOOP_V2}
        <BlockProperties
          block={$memoBlock}
          context={$memoContext}
          automation={$memoAutomation}
        />
      {/if}
    </span>

    {#if block?.stepId === AutomationTriggerStepId.WEBHOOK}
      <Button
        secondary
        on:click={() => {
          if (!webhookModal) return
          webhookModal.show()
        }}
      >
        Set Up Webhook
      </Button>
    {/if}
  </div>
  <div
    role="separator"
    class="divider"
    class:disabled={false}
    use:resizableHandle
  ></div>
</div>

<div class="panel data">
  <BlockData
    context={$memoContext}
    block={$memoBlock}
    automation={$memoAutomation}
    on:run={() => {
      automationStore.update(state => ({
        ...state,
        showTestModal: true,
      }))
    }}
  />
</div>

<ConfirmDialog
  bind:this={confirmCascadeDialog}
  okText="Delete"
  title="Confirm Deletion"
  onOk={async () => {
    if (!blockRef) return
    await automationStore.actions.deleteAutomationBlock(blockRef.pathTo)
  }}
>
  Deleting this step will also delete the Branch and its lanes below it. This is
  required to avoid orphaning branches in the loop subflow. Are you sure you
  want to proceed?
</ConfirmDialog>

<style>
  .step-actions {
    display: flex;
    gap: var(--spacing-l);
    align-items: center;
    margin-top: var(--spacing-s);
  }
  .heading.panel {
    display: flex;
    flex-direction: column;
  }
  .panel,
  .config.panel .content {
    padding: var(--spacing-l);
  }
  .config.panel {
    padding: 0px;
    position: relative;
    display: flex;
    flex-direction: column;
    min-height: 200px;
    max-height: 550px;
    transition:
      height 300ms ease-out,
      max-height 300ms ease-out;
    height: 400px;
    box-sizing: border-box;
  }
  .config.panel .content {
    overflow: auto;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
  }
  .config.panel .loop,
  .config.panel .content .props {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
  }
  .config.panel :global(.spectrum-Divider) {
    flex: 0 0 auto;
  }
  .data.panel {
    padding: 0px;
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    overflow: auto;
    overflow-x: hidden;
  }
  .divider {
    position: absolute;
    bottom: 0;
    transform: translateY(50%);
    height: 16px;
    width: 100%;
  }
  .divider:after {
    content: "";
    position: absolute;
    background: var(--spectrum-global-color-gray-200);
    height: 2px;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
    transition: background 130ms ease-out;
  }
  .divider:hover {
    cursor: row-resize;
  }
  .divider:hover:after {
    background: var(--spectrum-global-color-gray-300);
  }
  .divider.disabled {
    cursor: auto;
  }
  .divider.disabled:after {
    background: var(--spectrum-global-color-gray-200);
  }
  .details {
    display: flex;
    gap: var(--spacing-l);
  }
  .config :global(.property-group-container) {
    border: 0px;
  }
</style>
