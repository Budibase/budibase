<script lang="ts">
  import FilterBuilder from "@/components/design/settings/controls/FilterEditor/FilterBuilder.svelte"
  import {
    Drawer,
    DrawerContent,
    Icon,
    Body,
    Divider,
    Button,
    Modal,
    ModalContent,
  } from "@budibase/bbui"
  import PropField from "@/components/automation/SetupPanel/PropField.svelte"
  import AutomationBindingPanel from "@/components/common/bindings/ServerBindingPanel.svelte"
  import FlowItemStatus from "./FlowItemStatus.svelte"
  import {
    automationStore,
    selectedAutomation,
    evaluationContext,
    contextMenuStore,
  } from "@/stores/builder"
  import { ViewMode } from "@/types/automations"
  import { QueryUtils, Utils, memo } from "@budibase/frontend-core"
  import { environment } from "@/stores/portal"
  import { cloneDeep } from "lodash/fp"
  import { getContext } from "svelte"
  import { type Writable } from "svelte/store"
  import BlockHeader from "../../SetupPanel/BlockHeader.svelte"
  import type {
    Automation,
    AutomationLog,
    AutomationStep,
    AutomationStepResult,
    AutomationTriggerResult,
    Branch,
    EnrichedBinding,
  } from "@budibase/types"
  import { type DragView } from "./FlowChartDnD"

  export let branchIdx
  export let step
  export let automation: Automation | undefined
  export let viewMode: ViewMode = ViewMode.EDITOR
  export let onStepSelect: (
    _data: AutomationStepResult | AutomationTriggerResult
  ) => void = () => {}

  const view = getContext<Writable<DragView>>("draggableView")
  const memoContext = memo({})
  const memoEnvVariables = memo($environment.variables)

  let drawer: Drawer | undefined
  let confirmDeleteModal: Modal | undefined

  $: memoContext.set($evaluationContext)
  $: memoEnvVariables.set($environment.variables)

  $: branch = step.inputs?.branches?.[branchIdx]
  $: editableConditionUI = branch.conditionUI || {}
  $: isLast = (step?.inputs?.branches?.length || 0) - 1 === branchIdx
  $: blockRef = $selectedAutomation?.blockRefs?.[step?.id]

  // Build bindings for the condition builder
  $: availableBindings = automationStore.actions.getPathBindings(
    step.id,
    automation
  )
  $: environmentBindings =
    $memoEnvVariables && automationStore.actions.buildEnvironmentBindings()
  $: userBindings = automationStore.actions.buildUserBindings()
  $: settingBindings = automationStore.actions.buildSettingBindings()
  $: stateBindings =
    ($automationStore.selectedNodeId,
    automationStore.actions.buildStateBindings())
  $: bindings = [
    ...availableBindings,
    ...environmentBindings,
    ...userBindings,
    ...settingBindings,
    ...stateBindings,
  ] as EnrichedBinding[]

  // Parse all the bindings into fields for the condition builder
  $: schemaFields = bindings?.map(binding => {
    return {
      name: `{{${binding.runtimeBinding}}}`,
      displayName: `${binding.category} - ${binding.display?.name}`,
      type: "string",
    }
  })
  $: branchBlockRef = {
    branchNode: true,
    pathTo: (blockRef?.pathTo || []).concat({
      stepIdx: 0,
      branchIdx,
      branchStepId: step.id,
      id: step.id,
    }),
  }

  // Logs: compute step data and execution state
  function getLogStepData(
    currentStep: AutomationStep,
    logData?: AutomationLog
  ) {
    if (!logData || viewMode !== ViewMode.LOGS) return null
    if (currentStep.type === "TRIGGER") {
      return logData.trigger
    }
    const logSteps = logData.steps || []
    return logSteps.find(
      (logStep: AutomationStepResult | AutomationTriggerResult) =>
        logStep.id === currentStep.id
    )
  }
  $: logData = $automationStore.selectedLog
  $: viewMode = $automationStore.viewMode
  $: logStepData = getLogStepData(step, logData)

  $: executedBranchId =
    viewMode === ViewMode.LOGS && logStepData?.outputs?.branchId
      ? logStepData.outputs.branchId
      : null
  $: executed = executedBranchId === branch?.id
  $: unexecuted =
    viewMode === ViewMode.LOGS && Boolean(executedBranchId) && !executed

  const getContextMenuItems = () => {
    return [
      {
        icon: "trash",
        name: "Delete",
        keyBind: null,
        visible: true,
        disabled: false,
        callback: async () => {
          const branchSteps = step.inputs?.children[branch.id]
          if (branchSteps.length) {
            confirmDeleteModal?.show()
          } else if ($selectedAutomation.data) {
            await automationStore.actions.deleteBranch(
              branchBlockRef.pathTo,
              $selectedAutomation.data
            )
          }
        },
      },
      {
        icon: "arrow-left",
        name: "Move left",
        keyBind: null,
        visible: true,
        disabled: branchIdx == 0,
        callback: async () => {
          if ($selectedAutomation.data) {
            automationStore.actions.branchLeft(
              branchBlockRef.pathTo,
              $selectedAutomation.data,
              step
            )
          }
        },
      },
      {
        icon: "arrow-right",
        name: "Move right",
        keyBind: null,
        visible: true,
        disabled: isLast,
        callback: async () => {
          if ($selectedAutomation.data) {
            automationStore.actions.branchRight(
              branchBlockRef.pathTo,
              $selectedAutomation.data,
              step
            )
          }
        },
      },
    ]
  }

  const branchUpdate = async (e: CustomEvent<string>) => {
    let stepUpdate = cloneDeep(step)
    let branchUpdate = stepUpdate.inputs?.branches.find(
      (stepBranch: Branch) => stepBranch.id == branch.id
    )
    branchUpdate.name = e.detail

    if ($selectedAutomation.data) {
      const updatedAuto = automationStore.actions.updateStep(
        blockRef?.pathTo,
        $selectedAutomation.data,
        stepUpdate
      )
      if (updatedAuto) {
        await automationStore.actions.save(updatedAuto)
      }
    }
  }

  const openContextMenu = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const items = getContextMenuItems()
    contextMenuStore.open(branch.id, items, { x: e.clientX, y: e.clientY })
  }
</script>

<Modal bind:this={confirmDeleteModal}>
  <ModalContent
    size="M"
    title={"Are you sure you want to delete?"}
    confirmText="Delete"
    onConfirm={async () => {
      if ($selectedAutomation.data) {
        await automationStore.actions.deleteBranch(
          branchBlockRef.pathTo,
          $selectedAutomation.data
        )
      }
    }}
  >
    <Body>By deleting this branch, you will delete all of its contents.</Body>
  </ModalContent>
</Modal>

<Drawer bind:this={drawer} title="Branch condition" forceModal>
  <Button
    cta
    slot="buttons"
    on:click={async () => {
      drawer?.hide()
      const updatedConditionsUI = Utils.parseFilter(editableConditionUI)
      const updatedBranch = {
        ...branch,
        conditionUI: updatedConditionsUI,
        condition: QueryUtils.buildQuery(updatedConditionsUI),
      }

      // Update step with modified branch
      let branchStepUpdate = cloneDeep(step)
      branchStepUpdate.inputs.branches[branchIdx] = updatedBranch

      // Ensure valid base configuration for all branches
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

      const updated = automation
        ? automationStore.actions.updateStep(
            blockRef?.pathTo,
            automation,
            branchStepUpdate
          )
        : null

      if (updated) {
        try {
          await automationStore.actions.save(updated)
        } catch (e) {
          console.error("Error saving branch update", e)
        }
      }
    }}
  >
    Save
  </Button>
  <DrawerContent slot="body">
    <FilterBuilder
      filters={editableConditionUI}
      {bindings}
      {schemaFields}
      datasource={{ type: "custom" }}
      panel={AutomationBindingPanel}
      on:change={e => {
        editableConditionUI = e.detail
      }}
      allowOnEmpty={false}
      builderType={"condition"}
      docsURL={null}
      evaluationContext={$memoContext}
    />
  </DrawerContent>
</Drawer>

<div class="flow-item branch">
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div
    class={`block branch-node hoverable`}
    class:selected={false}
    class:executed
    class:unexecuted
    on:click={e => {
      e.stopPropagation()
      if (viewMode === ViewMode.LOGS && logStepData) {
        onStepSelect(logStepData)
      }
    }}
  >
    <div class="block-float">
      <FlowItemStatus block={step} {branch} hideStatus={$view?.dragging} />
    </div>
    <div class="blockSection">
      <div class="heading">
        <BlockHeader
          {automation}
          block={step}
          itemName={branch.name}
          on:update={branchUpdate}
        />
        <div class="actions">
          <Icon
            name="info"
            tooltip="Branch sequencing checks each option in order and follows the first one that matches the rules."
          />
          <Icon
            disabled={viewMode === ViewMode.LOGS}
            on:click={e => {
              openContextMenu(e)
            }}
            size="M"
            weight="bold"
            hoverable
            name="dots-three"
          />
        </div>
      </div>
    </div>

    <Divider noMargin />
    <div class="blockSection filter-button">
      <PropField label="Only run when:" fullWidth>
        <div style="width: 100%">
          <Button
            disabled={viewMode === ViewMode.LOGS}
            secondary
            on:click={drawer.show}
          >
            {editableConditionUI?.groups?.length
              ? "Update condition"
              : "Add condition"}
          </Button>
        </div>
      </PropField>
    </div>
  </div>
</div>

<style>
  .filter-button :global(.spectrum-Button) {
    width: 100%;
  }
  .branch-actions {
    display: flex;
    gap: var(--spacing-l);
    cursor: default;
  }
  .footer {
    display: flex;
    align-items: center;
    gap: var(--spacing-m);
  }

  .flow-item {
    display: flex;
    flex-direction: column;
    align-items: center;
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
    background-color: var(--spectrum-global-color-gray-75);
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 12px;
    cursor: default;
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

  .branch-node {
    position: relative;
  }

  .block-float {
    pointer-events: none;
    width: 100%;
    position: absolute;
    top: -35px;
    left: 0px;
  }

  .blockSection .heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-m);
  }

  .blockSection .heading .actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-m);
  }

  .block.executed {
    border-color: var(--spectrum-global-color-green-600);
    border-width: 2px;
  }

  .block.unexecuted {
    opacity: 0.7;
  }
</style>
