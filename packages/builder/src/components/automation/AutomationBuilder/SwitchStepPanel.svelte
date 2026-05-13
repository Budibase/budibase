<script lang="ts">
  import { Button, Drawer, DrawerContent, Icon } from "@budibase/bbui"
  import { dndzone } from "svelte-dnd-action"
  import AutomationSwitchConditionsBuilder from "./AutomationSwitchConditionsBuilder.svelte"
  import InfoDisplay from "@/pages/builder/workspace/[application]/design/[workspaceAppId]/[screenId]/[componentId]/_components/Component/InfoDisplay.svelte"
  import { automationStore } from "@/stores/builder"
  import { Constants, QueryUtils, Utils } from "@budibase/frontend-core"
  import { cloneDeep } from "lodash/fp"
  import type { EmptyFilterOption } from "@budibase/types"
  import {
    type Automation,
    type BlockRef,
    type Branch,
    type BranchStep,
    type EnrichedBinding,
    BasicOperator,
    UILogicalOperator,
  } from "@budibase/types"
  import { type AutomationContext } from "@/stores/builder/automations"
  import DescriptionViewer from "@/components/common/DescriptionViewer.svelte"

  type SwitchConditionUI = Omit<
    NonNullable<Branch["conditionUI"]>,
    "groups"
  > & {
    logicalOperator?: UILogicalOperator
    onEmptyFilter?: EmptyFilterOption
    groups?: Array<{
      logicalOperator?: UILogicalOperator
      filters?: Array<{
        field: string
        operator: BasicOperator
        value: unknown
        valueType?: string
      }>
    }>
  }

  export let switchStep: BranchStep
  export let switchStepRef: BlockRef
  export let automation: Automation
  export let branchBindings: EnrichedBinding[]
  export let branchSchemaFields: Array<{
    name: string
    displayName: string
    type: string
  }>
  export let evaluationContext: AutomationContext

  let conditionsDrawer: Drawer | undefined
  let editableBranches: Branch[] = []
  let branchCards: Branch[] = []
  let draggingDisabled = true

  $: branches = switchStep.inputs?.branches || []
  $: branchCards = branches

  const createDefaultConditionUI = () => {
    const defaults = automationStore.actions.generateDefaultConditions()
      .conditionUI as SwitchConditionUI
    const conditionUI: SwitchConditionUI = {
      ...defaults,
      groups: [
        {
          logicalOperator: UILogicalOperator.ANY,
          filters: [
            {
              field: "",
              valueType: Constants.FilterValueType.VALUE,
              operator: BasicOperator.EQUAL,
              value: "",
            },
          ],
        },
      ],
    }
    return conditionUI
  }

  const normaliseBranchCondition = (branch: Branch): Branch => {
    if (branch.conditionUI?.groups?.length) {
      return cloneDeep(branch)
    }
    return {
      ...cloneDeep(branch),
      conditionUI: createDefaultConditionUI(),
    }
  }

  const getConditionSummary = (branch: Branch): string => {
    const conditionUI = branch.conditionUI as SwitchConditionUI | undefined
    const groups = conditionUI?.groups || []
    const logicalOperator = groups[0]?.logicalOperator
    const label =
      logicalOperator === UILogicalOperator.ALL ? "When all:" : "When any:"
    const parts: string[] = []
    for (const group of groups) {
      const filters = group.filters || []
      for (const filter of filters) {
        if (!filter.field) {
          continue
        }
        const op = filter.operator === BasicOperator.EQUAL ? "is" : "is not"
        const val = filter.value ?? ""
        parts.push(`- ${filter.field} ${op} "${val}"`)
      }
    }
    if (!parts.length) {
      return "No conditions configured"
    }
    return `${label}\n\n${parts.join("\n")}`
  }

  const hasNoChildren = (branch: Branch): boolean => {
    const children = switchStep.inputs?.children?.[branch.id]
    return !children || children.length === 0
  }

  const deleteBranch = async (branchId: string) => {
    const updatedBranches = branches.filter(branch => branch.id !== branchId)
    await saveSwitchStep(updatedBranches)
  }

  const _hasConfiguredConditions = (branch: Branch) => {
    const conditionUI = branch.conditionUI as SwitchConditionUI | undefined
    const groups = conditionUI?.groups || []
    return groups.some(group =>
      (group.filters || []).some(filter => !!filter.field)
    )
  }

  const openConditionsModal = () => {
    editableBranches = branches.map(normaliseBranchCondition)
    conditionsDrawer?.show()
  }

  const saveSwitchStep = async (updatedBranches: Branch[]) => {
    const branchStepUpdate = cloneDeep(switchStep)
    const existingChildren = branchStepUpdate.inputs.children || {}
    const nextChildren = { ...existingChildren }
    const nextBranchIds = new Set(updatedBranches.map(branch => branch.id))

    Object.keys(nextChildren).forEach(branchId => {
      if (!nextBranchIds.has(branchId)) {
        delete nextChildren[branchId]
      }
    })

    branchStepUpdate.inputs.branches = updatedBranches.map(branch => {
      nextChildren[branch.id] = nextChildren[branch.id] || []
      return branch
    })
    branchStepUpdate.inputs = {
      branches: branchStepUpdate.inputs.branches,
      ...(Object.keys(nextChildren).length ? { children: nextChildren } : {}),
    }

    const updated = automationStore.actions.updateStep(
      switchStepRef.pathTo,
      automation,
      branchStepUpdate
    )
    if (updated) {
      await automationStore.actions.save(updated)
    }
  }

  const updateBranchName = async (branchId: string, name: string) => {
    const nextName = name.trim()
    const branch = branches.find(branch => branch.id === branchId)
    if (!branch || !nextName || branch.name === nextName) {
      return
    }
    await saveSwitchStep(
      branches.map(branch =>
        branch.id === branchId ? { ...branch, name: nextName } : branch
      )
    )
  }

  const handleBranchNameBlur = async (e: FocusEvent, branch: Branch) => {
    const input = e.currentTarget as HTMLInputElement
    const nextName = input.value.trim()
    if (!nextName) {
      input.value = branch.name
      return
    }
    await updateBranchName(branch.id, nextName)
  }

  const handleBranchNameKeydown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      const input = e.currentTarget as HTMLInputElement
      input.blur()
    }
  }

  const handleCardsConsider = (e: CustomEvent<{ items: Branch[] }>) => {
    branchCards = e.detail.items
  }

  const handleCardsFinalize = async (e: CustomEvent<{ items: Branch[] }>) => {
    draggingDisabled = true
    const reorderedCards = e.detail.items
    await saveConditionOrder(reorderedCards)
  }

  const saveConditionOrder = async (reorderedBranches: Branch[]) => {
    // Swap conditions between branches to match the reordered card positions
    // Branch at position i gets the condition from reorderedBranches[i]
    const updatedBranches = branches.map((branch, idx) => {
      const sourceBranch = reorderedBranches[idx]
      if (!sourceBranch) return branch
      return {
        ...branch,
        name: sourceBranch.name,
        condition: cloneDeep(sourceBranch.condition),
        conditionUI: cloneDeep(sourceBranch.conditionUI),
      }
    })
    await saveSwitchStep(updatedBranches)
  }

  const updateBranchCondition = (branchIdx: number, conditionUI: any) => {
    editableBranches = editableBranches.map((branch, idx) => {
      if (idx !== branchIdx) {
        return branch
      }
      return {
        ...branch,
        conditionUI,
      }
    })
  }

  const saveConditions = async () => {
    await saveSwitchStep(
      editableBranches.map(branch => {
        const conditionUI = branch.conditionUI || createDefaultConditionUI()
        const updatedConditionsUI = Utils.parseFilter(conditionUI)
        return {
          ...branch,
          conditionUI: updatedConditionsUI as Branch["conditionUI"],
          condition: QueryUtils.buildQuery(updatedConditionsUI),
        }
      })
    )
    conditionsDrawer?.hide()
  }
</script>

<div class="switch-step-panel">
  <InfoDisplay
    icon="info"
    body="Checks each condition in order and follows the first one that matches."
  />
  <div class="open-modal">
    <Button secondary on:click={openConditionsModal}>Update conditions</Button>
  </div>
  <div
    class="branch-cards"
    use:dndzone={{
      items: branchCards,
      flipDurationMs: 120,
      dropTargetStyle: { outline: "none" },
      dragDisabled: draggingDisabled,
      dropFromOthersDisabled: true,
    }}
    on:consider={handleCardsConsider}
    on:finalize={handleCardsFinalize}
  >
    {#each branchCards as branch, idx (branch.id)}
      <div class="branch-card">
        <div class="branch-card-header">
          <button
            type="button"
            class="drag-handle"
            aria-label="Drag branch"
            on:mousedown={() => {
              draggingDisabled = false
            }}
            on:mouseup={() => {
              draggingDisabled = true
            }}
          >
            <Icon
              name="dots-six-vertical"
              color="var(--spectrum-global-color-gray-700)"
              size="S"
            />
          </button>
          <span class="branch-index">{idx + 1}</span>
          <input
            class="branch-name"
            value={branch.name}
            on:click={e => e.stopPropagation()}
            on:blur={e => handleBranchNameBlur(e, branch)}
            on:keydown={handleBranchNameKeydown}
          />
          {#if hasNoChildren(branch)}
            <button
              type="button"
              class="delete-branch"
              aria-label="Delete branch"
              on:click={() => deleteBranch(branch.id)}
            >
              <Icon
                name="trash"
                color="var(--spectrum-global-color-gray-700)"
                size="S"
              />
            </button>
          {/if}
        </div>
        <div class="condition-summary">
          <DescriptionViewer
            label=""
            description={getConditionSummary(branch)}
          />
        </div>
      </div>
    {/each}
  </div>
</div>

<Drawer bind:this={conditionsDrawer} title="Conditions" forceModal>
  <Button cta slot="buttons" on:click={saveConditions}>Save</Button>
  <DrawerContent slot="body">
    <div class="conditions">
      <div class="conditions-header">
        Run the first branch that matches the condition:
      </div>
      {#each editableBranches as branch, idx (branch.id)}
        <div class="condition">
          <AutomationSwitchConditionsBuilder
            filters={branch.conditionUI}
            bindings={branchBindings}
            schemaFields={branchSchemaFields}
            {evaluationContext}
            on:change={e => updateBranchCondition(idx, e.detail)}
            showDeleteGroupAction={editableBranches.length > 2}
            groupLabel={`${idx + 1}.`}
          />
        </div>
      {/each}
    </div>
  </DrawerContent>
</Drawer>

<style>
  .switch-step-panel {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
  }

  .open-modal {
    display: flex;
    margin-bottom: var(--spacing-m);
  }

  .branch-cards {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  }

  .branch-card {
    border: 1px solid var(--spectrum-alias-border-color-mid);
    border-radius: 8px;
    background: var(--spectrum-global-color-gray-50);
    padding: var(--spacing-s);
  }

  .branch-card-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }

  .drag-handle {
    border: none;
    background: transparent;
    padding: 0;
    cursor: grab;
    display: flex;
    align-items: center;
  }

  .drag-handle:active {
    cursor: grabbing;
  }

  .delete-branch {
    border: none;
    background: transparent;
    padding: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    margin-left: auto;
  }

  .delete-branch:hover {
    color: var(--spectrum-global-color-red-500);
  }

  .branch-index {
    color: var(--spectrum-global-color-gray-700);
    font-weight: 600;
    min-width: 18px;
  }

  .branch-name {
    flex: 1;
    min-width: 0;
    border: 1px solid transparent;
    background: transparent;
    border-radius: 4px;
    color: var(--ink);
    font-weight: 600;
    padding: var(--spacing-xs);
  }

  .branch-name:focus {
    background: var(--spectrum-global-color-gray-75);
    border-color: var(--spectrum-global-color-blue-500);
    outline: none;
  }

  .condition-summary {
    padding: var(--spacing-s) 0;
  }

  .conditions {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
  }

  .conditions-header {
    color: var(--ink);
  }
</style>
