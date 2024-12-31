export interface BranchPath {
  stepIdx: number
  branchIdx: number
  branchStepId: string
  id: string
}

export interface BlockDefinitions {
  TRIGGER: Record<string, any>
  CREATABLE_TRIGGER: Record<string, any>
  ACTION: Record<string, any>
}
