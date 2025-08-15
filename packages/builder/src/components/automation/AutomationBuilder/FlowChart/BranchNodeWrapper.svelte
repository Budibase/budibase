<script lang="ts">
  import BranchNode from "./BranchNode.svelte"
  import { selectedAutomation, automationStore } from "@/stores/builder"
  import { ViewMode } from "@/types/automations"
  import { getBlocks } from "./AutomationStepHelpers"
  import { Handle, Position } from "@xyflow/svelte"
  import { environment } from "@/stores/portal"
  import { memo } from "@budibase/frontend-core"

  export let data

  const memoEnvVariables = memo($environment.variables)

  $: memoEnvVariables.set($environment.variables)
  $: block = data.block
  $: automation = $selectedAutomation?.data
  $: blockRef = $selectedAutomation?.blockRefs?.[block?.id]
  $: pathToCurrentNode = blockRef?.pathTo
  $: branch = data.branch
  $: branchIdx = data.branchIdx
  $: isLast = data.isLast
  $: viewMode = data?.viewMode

  // All bindings available to this point
  $: availableBindings = automationStore.actions.getPathBindings(
    block.id,
    automation
  )

  // Fetch the env bindings
  $: environmentBindings = automationStore.actions.buildEnvironmentBindings()

  $: userBindings = automationStore.actions.buildUserBindings()
  $: settingBindings = automationStore.actions.buildSettingBindings()

  // Combine all bindings for the step
  $: bindings = [
    ...availableBindings,
    ...environmentBindings,
    ...userBindings,
    ...settingBindings,
  ]
</script>

<div style="position: relative;">
  <Handle type="target" position={Position.Top} />
  <div class="branch-container">
    <BranchNode
      {automation}
      step={block}
      {bindings}
      pathTo={pathToCurrentNode}
      {branchIdx}
      {isLast}
      executed={false}
      unexecuted={false}
      {viewMode}
      logStepData={null}
      onStepSelect={() => {}}
      on:change={async e => {
        const updatedBranch = { ...branch, ...e.detail }

        if (!block?.inputs?.branches?.[branchIdx]) {
          console.error(`Cannot load target branch: ${branchIdx}`)
          return
        }

        let branchStepUpdate = { ...block }
        branchStepUpdate.inputs.branches[branchIdx] = updatedBranch

        // Ensure valid base configuration for all branches
        // Reinitialise empty branch conditions on update
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
    />
  </div>
  <Handle type="source" position={Position.Bottom} />
</div>

<style>
  .branch-container {
    padding: 20px;
  }
</style>
