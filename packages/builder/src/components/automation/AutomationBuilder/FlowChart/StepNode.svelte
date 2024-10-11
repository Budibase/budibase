<script>
  import FlowItem from "./FlowItem.svelte"
  import BranchNode from "./BranchNode.svelte"
  import { AutomationActionStepId } from "@budibase/types"
  import { ActionButton } from "@budibase/bbui"
  import { automationStore } from "stores/builder"
  import { cloneDeep } from "lodash"

  export let step = {}
  export let stepIdx
  export let automation
  export let blocks
  export let isLast = false

  $: blockRef = blocks?.[step.id]
  $: pathToCurrentNode = blockRef?.pathTo
  $: isBranch = step.stepId === AutomationActionStepId.BRANCH
  $: branches = step.inputs?.branches

  // All bindings available to this point
  $: availableBindings = automationStore.actions.getPathBindings(
    step.id,
    automation
  )

  // Combine all bindings for the step
  $: bindings = [...availableBindings, ...($automationStore.bindings || [])]
</script>

{#if isBranch}
  <div class="split-branch-btn">
    <ActionButton
      icon="AddCircle"
      on:click={() => {
        automationStore.actions.branchAutomation(pathToCurrentNode, automation)
      }}
    >
      Add additional branch
    </ActionButton>
  </div>
  <div class="branched">
    {#each branches as branch, bIdx}
      {@const leftMost = bIdx === 0}
      {@const rightMost = branches?.length - 1 === bIdx}
      <div class="branch-wrap">
        <div
          class="branch"
          class:left={leftMost}
          class:right={rightMost}
          class:middle={!leftMost && !rightMost}
        >
          <div class="branch-node">
            <BranchNode
              {step}
              {bindings}
              pathTo={pathToCurrentNode}
              branchIdx={bIdx}
              isLast={rightMost}
              on:change={e => {
                const updatedBranch = { ...branch, ...e.detail }

                if (!step?.inputs?.branches?.[bIdx]) {
                  console.error(`Cannot load target branch: ${bIdx}`)
                  return
                }

                let branchStepUpdate = cloneDeep(step)
                branchStepUpdate.inputs.branches[bIdx] = updatedBranch

                const updated = automationStore.actions.updateStep(
                  blockRef?.pathTo,
                  automation,
                  branchStepUpdate
                )
                automationStore.actions.save(updated)
              }}
            />
          </div>

          <!-- Branch steps -->
          {#each step.inputs?.children[branch.id] || [] as bStep, sIdx}
            <!-- Recursive StepNode -->
            <svelte:self
              step={bStep}
              stepIdx={sIdx}
              branchIdx={bIdx}
              isLast={blockRef.terminating}
              pathTo={pathToCurrentNode}
              {automation}
              {blocks}
            />
          {/each}
        </div>
      </div>
    {/each}
  </div>
{:else}
  <!--Drop Zone-->
  <div class="block">
    <FlowItem
      block={step}
      idx={stepIdx}
      {blockRef}
      {isLast}
      {automation}
      {bindings}
    />
  </div>
  <!--Drop Zone-->
{/if}

<style>
  .branch-wrap {
    width: inherit;
  }

  .branch {
    display: flex;
    align-items: center;
    flex-direction: column;
    position: relative;
    width: inherit;
  }

  .branched {
    display: flex;
    gap: 64px;
  }

  .branch::before {
    height: 64px;
    border-left: 1px dashed var(--grey-4);
    border-top: 1px dashed var(--grey-4);
    content: "";
    color: var(--grey-4);
    width: 50%;
    position: absolute;
    left: 50%;
    top: -16px;
  }

  .branch.left::before {
    color: var(--grey-4);
    width: calc(50% + 62px);
  }

  .branch.middle::after {
    height: 64px;
    border-top: 1px dashed var(--grey-4);
    content: "";
    color: var(--grey-4);
    width: calc(50% + 62px);
    position: absolute;
    left: 50%;
    top: -16px;
  }

  .branch.right::before {
    left: 0px;
    border-right: 1px dashed var(--grey-4);
    border-left: none;
  }

  .branch.middle::before {
    left: 0px;
    border-right: 1px dashed var(--grey-4);
    border-left: none;
  }

  .branch-node {
    margin-top: 48px;
  }

  .split-branch-btn {
    z-index: 2;
  }
</style>
