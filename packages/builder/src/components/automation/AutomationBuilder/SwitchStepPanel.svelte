<script lang="ts">
  import {
    Button,
    DetailSummary,
    Divider,
    Drawer,
    DrawerContent,
  } from "@budibase/bbui"
  import FilterBuilder from "@/components/design/settings/controls/FilterEditor/FilterBuilder.svelte"
  import AutomationBindingPanel from "@/components/common/bindings/ServerBindingPanel.svelte"
  import InfoDisplay from "@/pages/builder/workspace/[application]/design/[workspaceAppId]/[screenId]/[componentId]/_components/Component/InfoDisplay.svelte"
  import { automationStore } from "@/stores/builder"
  import { Constants, QueryUtils, Utils } from "@budibase/frontend-core"
  import { generate } from "shortid"
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

  $: branches = switchStep.inputs?.branches || []

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

  const openConditionsModal = () => {
    editableBranches = (switchStep.inputs?.branches || []).map(
      normaliseBranchCondition
    )
    conditionsDrawer?.show()
  }

  const updateBranchCondition = (branchIdx: number, conditionUI: any) => {
    if (!conditionUI?.groups?.length) {
      deleteBranch(branchIdx)
      return
    }
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

  const addBranch = () => {
    const conditionUI = createDefaultConditionUI()
    editableBranches = [
      ...editableBranches,
      {
        id: generate(),
        name: `Condition ${editableBranches.length + 1}`,
        conditionUI,
        condition: QueryUtils.buildQuery(conditionUI),
      },
    ]
  }

  const deleteBranch = (branchIdx: number) => {
    if (editableBranches.length <= 2) {
      return
    }
    editableBranches = editableBranches.filter(
      (_branch, idx) => idx !== branchIdx
    )
  }

  const saveConditions = async () => {
    const branchStepUpdate = cloneDeep(switchStep)
    const existingChildren = branchStepUpdate.inputs.children || {}
    const nextChildren = { ...existingChildren }
    const nextBranchIds = new Set(editableBranches.map(branch => branch.id))

    Object.keys(nextChildren).forEach(branchId => {
      if (!nextBranchIds.has(branchId)) {
        delete nextChildren[branchId]
      }
    })

    branchStepUpdate.inputs.branches = editableBranches.map(branch => {
      nextChildren[branch.id] = nextChildren[branch.id] || []
      const conditionUI = branch.conditionUI || createDefaultConditionUI()
      const updatedConditionsUI = Utils.parseFilter(conditionUI)
      return {
        ...branch,
        conditionUI: updatedConditionsUI as Branch["conditionUI"],
        condition: QueryUtils.buildQuery(updatedConditionsUI),
      }
    })
    branchStepUpdate.inputs.children = nextChildren

    const updated = automationStore.actions.updateStep(
      switchStepRef.pathTo,
      automation,
      branchStepUpdate
    )
    if (updated) {
      await automationStore.actions.save(updated)
    }
    conditionsDrawer?.hide()
  }
</script>

<InfoDisplay
  icon="info"
  body="Checks each condition in order and follows the first one that matches."
/>
<div class="open-modal">
  <Button secondary icon="FullScreen" on:click={openConditionsModal}>
    Open in modal
  </Button>
</div>
{#each branches as branch, idx (branch.id)}
  {#if idx > 0}
    <Divider noMargin />
  {/if}
  <DetailSummary name={`${idx + 1}. ${branch.name}`} padded={false}>
    <div class="condition-summary">
      <DescriptionViewer label="" description={getConditionSummary(branch)} />
    </div>
  </DetailSummary>
{/each}

<Drawer bind:this={conditionsDrawer} title="Conditions" forceModal>
  <Button cta slot="buttons" on:click={saveConditions}>Save</Button>
  <DrawerContent slot="body">
    <div class="conditions">
      <div class="conditions-header">
        Run branch when matching the first branch condition that matches:
      </div>
      {#each editableBranches as branch, idx (branch.id)}
        <div class="condition">
          <FilterBuilder
            filters={branch.conditionUI}
            bindings={branchBindings}
            schemaFields={branchSchemaFields}
            datasource={{ type: "custom" }}
            panel={AutomationBindingPanel}
            on:change={e => updateBranchCondition(idx, e.detail)}
            allowOnEmpty={false}
            builderType={"condition"}
            docsURL={null}
            {evaluationContext}
            showGlobalHeader={false}
            showDeleteGroupAction={editableBranches.length > 2}
            showAddGroupButton={false}
            groupLabel={`${idx + 1}.`}
          />
        </div>
      {/each}
      <div class="add-branch">
        <Button secondary icon="plus-circle" on:click={addBranch}>
          Add branch
        </Button>
      </div>
    </div>
  </DrawerContent>
</Drawer>

<style>
  .open-modal {
    display: flex;
  }

  .condition-summary {
    padding: 0 0 var(--spacing-s);
  }

  .conditions {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
  }

  .conditions-header {
    color: var(--ink);
  }

  .add-branch {
    display: flex;
  }
</style>
