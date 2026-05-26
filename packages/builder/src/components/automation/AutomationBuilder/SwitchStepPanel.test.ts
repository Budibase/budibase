import { fireEvent, render, screen } from "@testing-library/svelte"
import { describe, expect, it, vi } from "vitest"
import {
  AutomationActionStepId,
  AutomationStepType,
  BasicOperator,
  UILogicalOperator,
  type Automation,
  type BlockRef,
  type Branch,
  type BranchStep,
} from "@budibase/types"
import type { AutomationContext } from "@/stores/builder/automations"

const mocks = vi.hoisted(() => ({
  generateDefaultConditions: vi.fn(() => ({
    conditionUI: {
      groups: [],
    },
  })),
  save: vi.fn(),
  updateStep: vi.fn(),
}))

vi.mock("@budibase/bbui", async () => {
  const [
    { default: Button },
    { default: Drawer },
    { default: DrawerContent },
    { default: Icon },
  ] = await Promise.all([
    import("./tests/MockButton.svelte"),
    import("./tests/MockDrawer.svelte"),
    import("./tests/MockDrawerContent.svelte"),
    import("./tests/MockIcon.svelte"),
  ])

  return {
    Button,
    Drawer,
    DrawerContent,
    Helpers: {
      uuid: vi.fn(() => "test-session-id"),
    },
    Icon,
  }
})

vi.mock("svelte-dnd-action", () => ({
  dndzone: vi.fn(() => ({
    update: vi.fn(),
    destroy: vi.fn(),
  })),
}))

vi.mock("@/stores/builder", () => ({
  automationStore: {
    actions: mocks,
  },
}))

vi.mock(
  "@/pages/builder/workspace/[application]/design/[workspaceAppId]/[screenId]/[componentId]/_components/Component/InfoDisplay.svelte",
  async () => {
    const { default: MockInfoDisplay } = await import(
      "./tests/MockInfoDisplay.svelte"
    )

    return {
      default: MockInfoDisplay,
    }
  }
)

vi.mock("@/components/common/DescriptionViewer.svelte", async () => {
  const { default: MockDescriptionViewer } = await import(
    "./tests/MockDescriptionViewer.svelte"
  )

  return {
    default: MockDescriptionViewer,
  }
})

vi.mock("./AutomationSwitchConditionsBuilder.svelte", async () => {
  const { default: MockAutomationSwitchConditionsBuilder } = await import(
    "./tests/MockAutomationSwitchConditionsBuilder.svelte"
  )

  return {
    default: MockAutomationSwitchConditionsBuilder,
  }
})

import SwitchStepPanel from "./SwitchStepPanel.svelte"

type TestFilter = {
  field: string
  operator: BasicOperator
  value: unknown
}

const conditionUI = (filters: TestFilter[]) => ({
  groups: [
    {
      logicalOperator: UILogicalOperator.ANY,
      filters,
    },
  ],
})

const buildBranch = (overrides: Partial<Branch>): Branch =>
  ({
    id: "branch-1",
    name: "Condition 1",
    condition: {},
    conditionUI: conditionUI([]),
    ...overrides,
  }) as Branch

const buildSwitchStep = (
  branches: Branch[],
  children: BranchStep["inputs"]["children"] = {}
): BranchStep => ({
  id: "switch-1",
  stepId: AutomationActionStepId.BRANCH,
  name: "Switch",
  tagline: "Switch",
  icon: "git-branch",
  description: "Switch branch",
  type: AutomationStepType.LOGIC,
  schema: {
    inputs: {
      properties: {},
    },
    outputs: {
      properties: {},
    },
  },
  inputs: {
    branches,
    children,
  },
})

const switchStepRef: BlockRef = {
  id: "switch-1",
  pathTo: [],
}

const evaluationContext: AutomationContext = {
  user: null,
  steps: {},
  settings: {},
}

const renderPanel = (
  branches: Branch[],
  children: BranchStep["inputs"]["children"] = {}
) =>
  render(SwitchStepPanel, {
    props: {
      switchStep: buildSwitchStep(branches, children),
      switchStepRef,
      automation: { definition: {} } as Automation,
      branchBindings: [],
      branchSchemaFields: [],
      evaluationContext,
    },
  })

const getBranchCard = (branchName: string) => {
  const input = screen.getByDisplayValue(branchName)
  const card = input.closest(".branch-card")
  expect(card).toBeInTheDocument()
  return card as HTMLElement
}

describe("SwitchStepPanel", () => {
  it("renders branch cards with condition summaries", () => {
    renderPanel([
      buildBranch({
        id: "branch-1",
        name: "Recent date",
        conditionUI: conditionUI([
          {
            field: "{{ trigger.fields.[date] }}",
            operator: BasicOperator.EQUAL,
            value: "2026-05-26",
          },
        ]),
      }),
      buildBranch({
        id: "branch-2",
        name: "Unconfigured",
        conditionUI: conditionUI([]),
      }),
    ])

    expect(screen.getByDisplayValue("Recent date")).toBeInTheDocument()
    expect(document.body).toHaveTextContent(
      /When any:\s+- \{\{ trigger\.fields\.\[date\] \}\} is "2026-05-26"/
    )
    expect(screen.getByDisplayValue("Unconfigured")).toBeInTheDocument()
    expect(screen.getByText("No conditions configured")).toBeInTheDocument()
  })

  it("masks JavaScript binding values in condition summaries", () => {
    renderPanel([
      buildBranch({
        id: "branch-1",
        name: "Date condition",
        conditionUI: conditionUI([
          {
            field: "{{ trigger.fields.[date] }}",
            operator: BasicOperator.NOT_EQUAL,
            value: '{{ js "cmV0dXJuIG5ldyBEYXRlKCk=" }}',
          },
        ]),
      }),
    ])

    expect(document.body).toHaveTextContent(
      /When any:\s+- \{\{ trigger\.fields\.\[date\] \}\} is not \(JavaScript function\)/
    )
    expect(
      screen.queryByText(/cmV0dXJuIG5ldyBEYXRlKCk=/)
    ).not.toBeInTheDocument()
  })

  it("renders panel controls and opens the conditions drawer", async () => {
    renderPanel([
      buildBranch({
        id: "branch-1",
        name: "First branch",
      }),
    ])

    expect(
      screen.getByText(
        "Checks each condition in order and follows the first one that matches."
      )
    ).toBeInTheDocument()

    await fireEvent.click(
      screen.getByRole("button", { name: "Update conditions" })
    )

    expect(
      screen.getByText("Run the first branch that matches the condition:")
    ).toBeInTheDocument()
    expect(screen.getByText("Save")).toBeInTheDocument()
    expect(screen.getByTestId("condition-builder")).toHaveTextContent("1.")
  })

  it("only shows the delete action for branches without children", () => {
    const branchWithChild = buildBranch({
      id: "branch-with-child",
      name: "Has child",
    })
    const branchWithoutChild = buildBranch({
      id: "branch-without-child",
      name: "No child",
    })

    renderPanel([branchWithChild, branchWithoutChild], {
      [branchWithChild.id]: [buildSwitchStep([], {})],
    })

    expect(
      getBranchCard("Has child").querySelector('[aria-label="Delete branch"]')
    ).not.toBeInTheDocument()
    expect(
      getBranchCard("No child").querySelector('[aria-label="Delete branch"]')
    ).toBeInTheDocument()
  })
})
