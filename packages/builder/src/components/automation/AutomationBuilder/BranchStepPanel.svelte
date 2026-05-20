<script lang="ts">
  import {
    ActionButton,
    Button,
    Divider,
    Drawer,
    DrawerContent,
    Icon,
  } from "@budibase/bbui"
  import { ConditionBuilder } from "@budibase/frontend-core"
  import AutomationBindingPanel from "@/components/common/bindings/ServerBindingPanel.svelte"
  import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"
  import InfoDisplay from "@/pages/builder/workspace/[application]/design/[workspaceAppId]/[screenId]/[componentId]/_components/Component/InfoDisplay.svelte"
  import { PropField } from "../SetupPanel"
  import BlockHeader from "../SetupPanel/BlockHeader.svelte"
  import { getVerticalResizeActions } from "@/components/common/resizable"
  import { environment } from "@/stores/portal"
  import {
    automationStore,
    evaluationContext,
    selectedAutomation,
  } from "@/stores/builder"
  import {
    type Automation,
    type Branch,
    type BranchStep,
    type EnrichedBinding,
    type UISearchFilter,
    isBranchStep,
  } from "@budibase/types"
  import { QueryUtils, Utils, memo } from "@budibase/frontend-core"
  import { cloneDeep } from "lodash/fp"

  const [resizable, resizableHandle] = getVerticalResizeActions()

  const memoAutomation = memo<Automation | undefined>($selectedAutomation.data)
  const memoContext = memo($evaluationContext)
  const memoEnvVariables = memo($environment.variables)

  let branchConditionDrawer: Drawer | undefined
  let confirmBranchDeleteDialog: any
  let configPanel: HTMLDivElement | undefined
  let editableBranchConditionUI: UISearchFilter

  $: memoAutomation.set($selectedAutomation.data)
  $: memoContext.set($evaluationContext)
  $: memoEnvVariables.set($environment.variables)

  $: selectedBranchNode = $automationStore.selectedBranchNode
  $: blockRefs = $selectedAutomation.blockRefs
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

  $: resetScroll(selectedBranchNode?.nodeId)

  const resetScroll = (selectedNodeId: string | undefined) => {
    if (configPanel && configPanel?.scrollTop > 0 && selectedNodeId) {
      configPanel.scrollTop = 0
    }
  }

  const createBranchNodeId = (
    stepId: string,
    branchIdx: number,
    branchId: string
  ) => {
    return `branch-${stepId}-${branchIdx}-${branchId}`
  }

  const updateBranchName = (
    step: BranchStep,
    branchId: string,
    name: string
  ) => {
    const stepUpdate = cloneDeep(step)
    const branchUpdate = stepUpdate.inputs?.branches.find(
      (stepBranch: Branch) => stepBranch.id === branchId
    )
    if (!branchUpdate) {
      return undefined
    }

    branchUpdate.name = name
    return stepUpdate
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

    const stepUpdate = updateBranchName(branchStep, selectedBranch.id, e.detail)
    if (!stepUpdate) {
      return
    }

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
      if (!Object.keys(br.condition || {}).length) {
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

<Drawer bind:this={branchConditionDrawer} title="Branch condition" forceModal>
  <Button cta slot="buttons" on:click={saveBranchCondition}>Save</Button>
  <DrawerContent slot="body">
    <ConditionBuilder
      filters={editableBranchConditionUI}
      bindings={branchBindings}
      schemaFields={branchSchemaFields}
      datasource={{ type: "custom" }}
      panel={AutomationBindingPanel}
      on:change={e => {
        editableBranchConditionUI = e.detail
      }}
      allowOnEmpty={false}
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
    {/if}
    <Icon
      name="x"
      hoverable
      on:click={() => {
        automationStore.actions.selectNode()
      }}
    />
  </div>
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
    {/if}
  </div>
  <div
    role="separator"
    class="divider"
    class:disabled={false}
    use:resizableHandle
  ></div>
</div>

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
  .panel {
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
    padding: var(--spacing-l);
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
</style>
