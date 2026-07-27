import { fireEvent, render, screen, waitFor } from "@testing-library/svelte"
import { beforeEach, describe, expect, it, vi } from "vitest"
import BranchStepPanel from "./BranchStepPanel.svelte"
import { automationWithSteps, branchStep } from "@/test/automationFixtures"
import {
  BasicOperator,
  EmptyFilterOption,
  UILogicalOperator,
  type Automation,
} from "@budibase/types"

const mocks = vi.hoisted(() => {
  const store = <T>(initial: T) => {
    let value = initial
    const subscribers = new Set<(value: T) => void>()
    return {
      set: (next: T) => {
        value = next
        subscribers.forEach(run => run(value))
      },
      subscribe: (run: (value: T) => void) => {
        subscribers.add(run)
        run(value)
        return () => subscribers.delete(run)
      },
      update: (updater: (value: T) => T) => {
        value = updater(value)
        subscribers.forEach(run => run(value))
      },
    }
  }

  return {
    automationStore: store({
      selectedNodeId: "branch-branch-0-matched",
      selectedBranchNode: {
        nodeId: "branch-branch-0-matched",
        stepId: "branch",
        branchIdx: 0,
      },
    }),
    appStore: store({ appId: "app" }),
    componentStore: store({}),
    deploymentStore: store({}),
    environment: store({ variables: [] }),
    evaluationContext: store({}),
    licensing: store({}),
    organisation: store({}),
    permissions: store({}),
    save: vi.fn(),
    selectedAutomation: store({
      data: undefined,
      blockRefs: {},
    }),
    tables: store({ list: [] }),
    workspaceDeploymentStore: store({ automations: {} }),
  }
})

const updateStep = (
  pathWay: Array<{ stepIdx: number }>,
  automation: Automation,
  update: any
) => {
  const updatedAutomation = structuredClone(automation)
  const stepIdx = Math.max(pathWay[0].stepIdx - 1, 0)
  updatedAutomation.definition.steps.splice(stepIdx, 1, update)
  return updatedAutomation
}

Object.assign(mocks.automationStore, {
  actions: {
    buildEnvironmentBindings: () => [],
    buildSettingBindings: () => [],
    buildStateBindings: () => [],
    buildUserBindings: () => [],
    deleteBranch: vi.fn(),
    generateDefaultConditions: () => {
      const conditionUI = {
        logicalOperator: UILogicalOperator.ALL,
        onEmptyFilter: EmptyFilterOption.RETURN_NONE,
        groups: [],
      }
      return {
        condition: { onEmptyFilter: EmptyFilterOption.RETURN_NONE },
        conditionUI,
      }
    },
    getBlockByRef: (automation: Automation | undefined, ref: any) =>
      automation?.definition.steps[Math.max(ref.pathTo[0].stepIdx - 1, 0)],
    getPathBindings: () => [
      {
        category: "Trigger",
        display: { name: "ID" },
        runtimeBinding: "trigger.id",
      },
    ],
    save: mocks.save,
    selectBranchNode: vi.fn(),
    selectNode: vi.fn(),
    updateStep,
  },
})

vi.mock("@/stores/builder", () => ({
  appStore: mocks.appStore,
  automationStore: mocks.automationStore,
  componentStore: mocks.componentStore,
  deploymentStore: mocks.deploymentStore,
  evaluationContext: mocks.evaluationContext,
  permissions: mocks.permissions,
  selectedAutomation: mocks.selectedAutomation,
  tables: mocks.tables,
  workspaceDeploymentStore: mocks.workspaceDeploymentStore,
}))

vi.mock("@/stores/portal", () => ({
  environment: mocks.environment,
  licensing: mocks.licensing,
  organisation: mocks.organisation,
}))

describe("BranchStepPanel", () => {
  beforeEach(() => {
    Element.prototype.animate = vi.fn(
      () =>
        ({
          cancel: vi.fn(),
          onfinish: vi.fn(),
          finished: Promise.resolve(),
        }) as any
    )
    document.body.innerHTML = '<div class="modal-container"></div>'
    mocks.save.mockReset()
    const branch = branchStep()
    mocks.selectedAutomation.set({
      data: automationWithSteps([branch]),
      blockRefs: {
        branch: {
          pathTo: [{ stepIdx: 1, id: "branch" }],
        },
      },
    } as any)
    mocks.automationStore.set({
      selectedNodeId: "branch-branch-0-matched",
      selectedBranchNode: {
        nodeId: "branch-branch-0-matched",
        stepId: "branch",
        branchIdx: 0,
      },
    })
  })

  it("saves a condition added to a selected automation branch", async () => {
    render(BranchStepPanel)

    await fireEvent.click(screen.getByText("Add condition"))
    await fireEvent.click(screen.getByText("Add condition group"))
    const fieldInput = document.querySelector(
      ".field-wrap input"
    ) as HTMLInputElement
    await fireEvent.input(fieldInput, {
      target: { value: "{{ trigger.id }}" },
    })
    await fireEvent.input(screen.getByPlaceholderText("Value"), {
      target: { value: "trigger" },
    })
    await fireEvent.click(screen.getByText("Save"))

    await waitFor(() => {
      expect(mocks.save).toHaveBeenCalledOnce()
    })

    const savedAutomation = mocks.save.mock.calls[0][0] as Automation
    const savedBranch = (savedAutomation.definition.steps[0] as any).inputs
      .branches[0]

    expect(savedBranch.conditionUI).toEqual({
      logicalOperator: UILogicalOperator.ALL,
      onEmptyFilter: EmptyFilterOption.RETURN_NONE,
      groups: [
        {
          logicalOperator: UILogicalOperator.ANY,
          filters: [
            expect.objectContaining({
              field: "{{ trigger.id }}",
              operator: BasicOperator.EQUAL,
              value: "trigger",
            }),
          ],
        },
      ],
    })
    expect(savedBranch.condition).not.toEqual({})
  })
})
