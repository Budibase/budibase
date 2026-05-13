<script lang="ts">
  import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"
  import { automationStore, selectedAutomation } from "@/stores/builder"
  import type { FlowBlockPath, SelectedBranchNode } from "@/types/automations"

  let confirmBranchDeleteDialog: ConfirmDialog | undefined
  let branchSelection: SelectedBranchNode | undefined

  $: branchStepRef = branchSelection
    ? $selectedAutomation.blockRefs[branchSelection.stepId]
    : undefined
  $: selectedBranchPath =
    branchStepRef && branchSelection
      ? (branchStepRef.pathTo.concat({
          stepIdx: 0,
          branchIdx: branchSelection.branchIdx,
          branchStepId: branchSelection.stepId,
          id: branchSelection.stepId,
        }) as FlowBlockPath)
      : undefined

  export const show = (selection?: SelectedBranchNode) => {
    branchSelection = selection || $automationStore.selectedBranchNode
    confirmBranchDeleteDialog?.show()
  }
</script>

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
