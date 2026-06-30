import { describe, expect, it } from "vitest"
import {
  AutomationActionStepId,
  AutomationStatus,
  AutomationTriggerStepId,
  type AutomationResults,
  type AutomationStepResult,
  type AutomationTriggerResult,
} from "@budibase/types"
import {
  ViewMode,
  type BranchEdgeData,
  type EdgeData,
  type FlowBlockContext,
} from "@/types/automations"
import {
  getBranchRunState,
  getFlowEdgeRunHighlight,
} from "../FlowCanvas/FlowRunHelpers"

const triggerResult: AutomationTriggerResult = {
  id: "trigger",
  stepId: AutomationTriggerStepId.APP,
  outputs: {
    success: true,
  },
}

const createBranchResult = (
  outputs: AutomationStepResult["outputs"]
): AutomationStepResult => ({
  id: "branch-step",
  stepId: AutomationActionStepId.BRANCH,
  inputs: {},
  outputs,
})

const createStepResult = (
  id: string,
  outputs: AutomationStepResult["outputs"]
): AutomationStepResult => ({
  id,
  stepId: AutomationActionStepId.SERVER_LOG,
  inputs: {},
  outputs,
})

const createResults = (
  status: AutomationStatus,
  steps: AutomationStepResult[]
): AutomationResults => ({
  status,
  trigger: triggerResult,
  steps: [triggerResult, ...steps],
})

const branchBlock: FlowBlockContext = {
  branchNode: true,
  pathTo: [],
  branchIdx: 0,
  branchStepId: "branch-step",
}

const standardBlock: FlowBlockContext = {
  id: "source-step",
  stepId: AutomationActionStepId.SERVER_LOG,
  inputs: {},
  outputs: {
    success: true,
  },
  name: "Source",
  icon: "ri-play-line",
}

const branchEdgeData: BranchEdgeData = {
  block: branchBlock,
  isBranchEdge: true,
  isPrimaryEdge: true,
  branchStepId: "branch-step",
  branchIdx: 0,
  branchesCount: 2,
}

const standardEdgeData: EdgeData = {
  block: standardBlock,
}

const branchIds = ["branch-a", "branch-b"]
const getBranchId = (_branchStepId: string, branchIdx: number) =>
  branchIds[branchIdx]
const getEmptyProgressResult = () => undefined

describe("getBranchRunState", () => {
  it("marks a matching branch as successful when the run succeeds", () => {
    const state = getBranchRunState({
      branchResult: createBranchResult({
        success: true,
        branchId: "branch-a",
      }),
      branchId: "branch-a",
      runHighlight: "success",
    })

    expect(state).toEqual({
      executed: true,
      success: true,
      error: false,
      stopped: false,
    })
  })

  it("marks a matching branch as errored when the run fails", () => {
    const state = getBranchRunState({
      branchResult: createBranchResult({
        success: false,
        branchId: "branch-a",
      }),
      branchId: "branch-a",
      runHighlight: "error",
    })

    expect(state).toEqual({
      executed: true,
      success: false,
      error: true,
      stopped: false,
    })
  })

  it("marks no branch match as stopped instead of errored", () => {
    const state = getBranchRunState({
      branchResult: createBranchResult({
        success: false,
      }),
      branchId: "branch-a",
      runHighlight: "error",
    })

    expect(state).toEqual({
      executed: false,
      success: false,
      error: false,
      stopped: true,
    })
  })

  it("marks a matching branch as stopped when the run stops", () => {
    const state = getBranchRunState({
      branchResult: createBranchResult({
        success: true,
        branchId: "branch-a",
      }),
      branchId: "branch-a",
      runHighlight: "stopped",
    })

    expect(state).toEqual({
      executed: true,
      success: false,
      error: false,
      stopped: true,
    })
  })
})

describe("getFlowEdgeRunHighlight", () => {
  it("highlights branch edges for the branch that ran", () => {
    const runResults = createResults(AutomationStatus.SUCCESS, [
      createBranchResult({
        success: true,
        branchId: "branch-a",
      }),
    ])

    expect(
      getFlowEdgeRunHighlight({
        edgeData: branchEdgeData,
        target: "branch-target",
        runResults,
        viewMode: ViewMode.LOGS,
        getProgressResult: getEmptyProgressResult,
        getBranchId,
      })
    ).toBe("success")
  })

  it("does not highlight branch edges for branches that did not run", () => {
    const runResults = createResults(AutomationStatus.SUCCESS, [
      createBranchResult({
        success: true,
        branchId: "branch-b",
      }),
    ])

    expect(
      getFlowEdgeRunHighlight({
        edgeData: branchEdgeData,
        target: "branch-target",
        runResults,
        viewMode: ViewMode.LOGS,
        getProgressResult: getEmptyProgressResult,
        getBranchId,
      })
    ).toBeUndefined()
  })

  it("highlights branch edges as stopped when no branch matched", () => {
    const runResults = createResults(AutomationStatus.STOPPED, [
      createBranchResult({
        success: false,
        status: AutomationStatus.STOPPED,
      }),
    ])

    expect(
      getFlowEdgeRunHighlight({
        edgeData: branchEdgeData,
        target: "branch-target",
        runResults,
        viewMode: ViewMode.LOGS,
        getProgressResult: getEmptyProgressResult,
        getBranchId,
      })
    ).toBe("stopped")
  })

  it("does not highlight branch context child edges when no branch matched", () => {
    const runResults = createResults(AutomationStatus.STOPPED, [
      createBranchResult({
        success: false,
        status: AutomationStatus.STOPPED,
      }),
    ])

    expect(
      getFlowEdgeRunHighlight({
        edgeData: {
          block: branchBlock,
        },
        target: "child-step",
        runResults,
        viewMode: ViewMode.LOGS,
        getProgressResult: getEmptyProgressResult,
        getBranchId,
      })
    ).toBeUndefined()
  })

  it("highlights standard target edges when their target ran", () => {
    const runResults = createResults(AutomationStatus.SUCCESS, [
      createStepResult("target-step", {
        success: true,
      }),
    ])

    expect(
      getFlowEdgeRunHighlight({
        edgeData: standardEdgeData,
        target: "target-step",
        runResults,
        viewMode: ViewMode.LOGS,
        getProgressResult: getEmptyProgressResult,
        getBranchId,
      })
    ).toBe("success")
  })

  it("uses progress events before complete results outside logs view", () => {
    expect(
      getFlowEdgeRunHighlight({
        edgeData: branchEdgeData,
        target: "branch-target",
        runResults: undefined,
        viewMode: ViewMode.EDITOR,
        getProgressResult: () =>
          createBranchResult({
            success: true,
            branchId: "branch-a",
          }),
        getBranchId,
      })
    ).toBe("success")
  })
})
