<script lang="ts">
  import {
    ActionButton,
    Button,
    Divider,
    Drawer,
    DrawerContent,
    Icon,
    Modal,
    DetailSummary,
  } from "@budibase/bbui"
  import FilterBuilder from "@/components/design/settings/controls/FilterEditor/FilterBuilder.svelte"
  import AutomationBindingPanel from "@/components/common/bindings/ServerBindingPanel.svelte"
  import { generate } from "shortid"
  import {
    type Automation,
    type AutomationStep,
    type AutomationTrigger,
    type BlockRef,
    type Branch,
    type EnrichedBinding,
    AutomationActionStepId,
    AutomationTriggerStepId,
    isBranchStep,
    isTrigger,
    AutomationFeature,
    isLoopV2Step,
  } from "@budibase/types"
  import { QueryUtils, Utils, memo } from "@budibase/frontend-core"
  import {
    automationStore,
    selectedAutomation,
    evaluationContext,
  } from "@/stores/builder"
  import { environment } from "@/stores/portal"
  import { getNewStepName } from "@/helpers/automations/nameHelpers"
  import BlockData from "../SetupPanel/BlockData.svelte"
  import BlockProperties from "../SetupPanel/BlockProperties.svelte"
  import BlockHeader from "../SetupPanel/BlockHeader.svelte"
  import InfoDisplay from "@/pages/builder/workspace/[application]/design/[workspaceAppId]/[screenId]/[componentId]/_components/Component/InfoDisplay.svelte"
  import { PropField } from "../SetupPanel"
  import RoleSelect from "@/components/common/RoleSelect.svelte"
  import { type AutomationContext } from "@/stores/builder/automations"
  import CreateWebhookModal from "@/components/automation/Shared/CreateWebhookModal.svelte"
  import { getVerticalResizeActions } from "@/components/common/resizable"
  import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"
  import { cloneDeep } from "lodash/fp"

  const [resizable, resizableHandle] = getVerticalResizeActions()

  const memoAutomation = memo<Automation | undefined>($selectedAutomation.data)
  const memoBlock = memo<AutomationStep | AutomationTrigger | undefined>()
  const memoContext = memo({} as AutomationContext)
  const memoEnvVariables = memo($environment.variables)

  let role: string | undefined
  let webhookModal: Modal | undefined
  let branchConditionDrawer: Drawer | undefined
  let configPanel: HTMLDivElement | undefined
  let confirmCascadeDialog: any
  let confirmBranchDeleteDialog: any
  let editableBranchConditionUI: any = {}

  $: memoAutomation.set($selectedAutomation.data)
  $: memoContext.set($evaluationContext)
  $: memoEnvVariables.set($environment.variables)

  $: selectedNodeId = $automationStore.selectedNodeId
  $: selectedBranchNode = $automationStore.selectedBranchNode
  $: blockRefs = $selectedAutomation.blockRefs
  $: blockRef =
    selectedNodeId && !selectedBranchNode
      ? blockRefs[selectedNodeId]
      : undefined
  $: block = automationStore.actions.getBlockByRef($memoAutomation, blockRef)
  $: branchStepRef = selectedBranchNode
    ? blockRefs[selectedBranchNode.stepId]
    : undefined
  $: branchStep = automationStore.actions.getBlockByRef(
    $memoAutomation,
    branchStepRef
  )
  $: selectedBranch =
    branchStep && isBranchStep(branchStep) && selectedBranchNode
      ? branchStep.inputs?.branches?.[selectedBranchNode.branchIdx]
      : undefined
  $: selectedBranchCount =
    branchStep && isBranchStep(branchStep)
      ? branchStep.inputs?.branches?.length || 0
      : 0
  $: canMoveBranchUp = selectedBranchNode && selectedBranchNode.branchIdx > 0
  $: canMoveBranchDown =
    selectedBranchNode && selectedBranchNode.branchIdx < selectedBranchCount - 1
  $: selectedBranchPath =
    branchStepRef && selectedBranchNode
      ? branchStepRef.pathTo.concat({
          stepIdx: 0,
          branchIdx: selectedBranchNode.branchIdx,
          branchStepId: selectedBranchNode.stepId,
          id: selectedBranchNode.stepId,
        })
      : undefined
  $: editableBranchConditionUI = selectedBranch?.conditionUI || {}

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

  $: availableBranchBindings =
    selectedBranchNode && branchStep
      ? automationStore.actions.getPathBindings(branchStep.id, $memoAutomation)
      : []
  $: environmentBindings =
    $memoEnvVariables && automationStore.actions.buildEnvironmentBindings()
  $: userBindings = automationStore.actions.buildUserBindings()
  $: settingBindings = automationStore.actions.buildSettingBindings()
  $: stateBindings =
    ($automationStore.selectedNodeId,
    automationStore.actions.buildStateBindings())
  $: branchBindings = [
    ...availableBranchBindings,
    ...environmentBindings,
    ...userBindings,
    ...settingBindings,
    ...stateBindings,
  ] as EnrichedBinding[]
  $: branchSchemaFields = branchBindings?.map(binding => {
    return {
      name: `{{${binding.runtimeBinding}}}`,
      displayName: `${binding.category} - ${binding.display?.name}`,
      type: "string",
    }
  })

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

  const branchUpdate = async (e: CustomEvent<string>) => {
    if (
      !branchStep ||
      !isBranchStep(branchStep) ||
      !selectedBranch ||
      !branchStepRef ||
      !$selectedAutomation.data
    ) {
      return
    }

    const stepUpdate = cloneDeep(branchStep)
    const branchUpdate = stepUpdate.inputs?.branches.find(
      (stepBranch: Branch) => stepBranch.id === selectedBranch.id
    )
    if (!branchUpdate) {
      return
    }

    branchUpdate.name = e.detail
    const updatedAuto = automationStore.actions.updateStep(
      branchStepRef.pathTo,
      $selectedAutomation.data,
      stepUpdate
    )
    if (updatedAuto) {
      await automationStore.actions.save(updatedAuto)
    }
  }

  const saveBranchCondition = async () => {
    if (
      !branchStep ||
      !isBranchStep(branchStep) ||
      !selectedBranch ||
      !selectedBranchNode ||
      !branchStepRef ||
      !$memoAutomation
    ) {
      return
    }

    branchConditionDrawer?.hide()
    const updatedConditionsUI = Utils.parseFilter(editableBranchConditionUI)
    const updatedBranch: Branch = {
      ...selectedBranch,
      conditionUI: updatedConditionsUI as Branch["conditionUI"],
      condition: QueryUtils.buildQuery(updatedConditionsUI),
    }
    const branchStepUpdate = cloneDeep(branchStep)
    branchStepUpdate.inputs.branches[selectedBranchNode.branchIdx] =
      updatedBranch

    const branchesArray = branchStepUpdate.inputs.branches || []
    for (let i = 0; i < branchesArray.length; i++) {
      const br = branchesArray[i]
      if (!Object.keys(br.condition).length) {
        branchesArray[i] = {
          ...br,
          ...automationStore.actions.generateDefaultConditions(),
        }
      }
    }
    branchStepUpdate.inputs.branches = branchesArray

    const updated = automationStore.actions.updateStep(
      branchStepRef.pathTo,
      $memoAutomation,
      branchStepUpdate
    )
    if (updated) {
      try {
        await automationStore.actions.save(updated)
      } catch (e) {
        console.error("Error saving branch update", e)
      }
    }
  }

  const createBranchNodeId = (
    stepId: string,
    branchIdx: number,
    branchId: string
  ) => {
    return `branch-${stepId}-${branchIdx}-${branchId}`
  }

  const moveSelectedBranch = async (direction: -1 | 1) => {
    if (
      !selectedBranch ||
      !selectedBranchNode ||
      !selectedBranchPath ||
      !branchStep ||
      !isBranchStep(branchStep) ||
      !$selectedAutomation.data
    ) {
      return
    }

    const targetIdx = selectedBranchNode.branchIdx + direction
    if (targetIdx < 0 || targetIdx >= selectedBranchCount) {
      return
    }
    const movedBranchId = selectedBranch.id
    const branchStepId = selectedBranchNode.stepId

    if (direction === -1) {
      await automationStore.actions.branchLeft(
        selectedBranchPath,
        $selectedAutomation.data,
        branchStep
      )
    } else {
      await automationStore.actions.branchRight(
        selectedBranchPath,
        $selectedAutomation.data,
        branchStep
      )
    }

    await automationStore.actions.selectBranchNode({
      nodeId: createBranchNodeId(branchStepId, targetIdx, movedBranchId),
      stepId: branchStepId,
      branchIdx: targetIdx,
    })
  }
</script>

<Modal bind:this={webhookModal}>
  <CreateWebhookModal />
</Modal>

<Drawer bind:this={branchConditionDrawer} title="Branch condition" forceModal>
  <Button cta slot="buttons" on:click={saveBranchCondition}>Save</Button>
  <DrawerContent slot="body">
    <FilterBuilder
      filters={editableBranchConditionUI}
      bindings={branchBindings}
      schemaFields={branchSchemaFields}
      datasource={{ type: "custom" }}
      panel={AutomationBindingPanel}
      on:change={e => {
        editableBranchConditionUI = e.detail
      }}
      allowOnEmpty={false}
      builderType={"condition"}
      docsURL={null}
      evaluationContext={$memoContext}
    />
  </DrawerContent>
</Drawer>

<div class="panel heading">
  <div class="details">
    {#if selectedBranch && branchStep}
      <BlockHeader
        automation={$memoAutomation}
        block={branchStep}
        itemName={selectedBranch.name}
        on:update={branchUpdate}
      />
    {:else}
      <BlockHeader
        automation={$memoAutomation}
        block={$memoBlock}
        on:update={e => {
          if ($memoBlock && !isTrigger($memoBlock)) {
            automationStore.actions.updateBlockTitle($memoBlock, e.detail)
          }
        }}
      />
    {/if}
    <Icon
      name="x"
      hoverable
      on:click={() => {
        automationStore.actions.selectNode()
      }}
    />
  </div>
  {#if selectedBranch}
    <div class="step-actions">
      <ActionButton
        quiet
        noPadding
        icon="arrow-up"
        disabled={!canMoveBranchUp}
        on:click={() => moveSelectedBranch(-1)}
      >
        Move up
      </ActionButton>
      <ActionButton
        quiet
        noPadding
        icon="arrow-down"
        disabled={!canMoveBranchDown}
        on:click={() => moveSelectedBranch(1)}
      >
        Move down
      </ActionButton>
      <ActionButton
        quiet
        noPadding
        icon="trash"
        on:click={() => {
          confirmBranchDeleteDialog?.show()
        }}
      >
        Delete
      </ActionButton>
    </div>
  {:else if isStep}
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
    {#if selectedBranch}
      <InfoDisplay
        icon="info"
        body="Branch sequencing checks each option in order and follows the first one that matches the rules."
      />
      <PropField label="Only run when:" fullWidth>
        <Button
          secondary
          on:click={() => {
            branchConditionDrawer?.show()
          }}
        >
          {selectedBranch.conditionUI?.groups?.length
            ? "Update condition"
            : "Add condition"}
        </Button>
      </PropField>
    {:else if loopBlock || $memoBlock?.stepId === AutomationActionStepId.LOOP_V2}
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
      {#if !selectedBranch && $memoBlock?.stepId !== AutomationActionStepId.LOOP_V2}
        <BlockProperties
          block={$memoBlock}
          context={$memoContext}
          automation={$memoAutomation}
        />
      {/if}
    </span>

    {#if !selectedBranch && block?.stepId === AutomationTriggerStepId.WEBHOOK}
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
  {#if !selectedBranch}
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
  {/if}
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

<ConfirmDialog
  bind:this={confirmBranchDeleteDialog}
  okText="Delete"
  title="Confirm Deletion"
  onOk={async () => {
    if (!selectedBranchPath || !$selectedAutomation.data) return
    await automationStore.actions.deleteBranch(
      selectedBranchPath,
      $selectedAutomation.data
    )
    await automationStore.actions.selectNode()
  }}
>
  By deleting this branch, you will delete all of its contents.
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
