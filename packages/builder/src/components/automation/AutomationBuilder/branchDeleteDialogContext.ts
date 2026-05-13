import type { SelectedBranchNode } from "@/types/automations"

export interface BranchDeleteDialogContext {
  show: (selection?: SelectedBranchNode) => void
}

export const BRANCH_DELETE_DIALOG_CONTEXT = "branchDeleteDialog"
