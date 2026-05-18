import { cloneDeep } from "lodash"
import {
  getDuplicateStepName,
  getNewStepName,
  updateBindingsInInputs,
  updateBindingsInSteps,
} from "../automations/nameHelpers"
describe("Automation Binding Update Functions", () => {
  const sampleAutomation = {
    definition: {
      steps: [
        {
          name: "First Step",
          inputs: {
            text: "Starting automation",
          },
          id: "step1",
        },
        {
          name: "Second Step",
          inputs: {
            text: "{{ steps.0.success }} and {{ stepsByName.First Step.message }}",
          },
          id: "step2",
        },
        {
          name: "Branch",
          inputs: {
            branches: [
              {
                name: "branch1",
                condition: {
                  equal: {
                    "steps.1.success": true,
                  },
                },
              },
            ],
            children: {
              branch1: [
                {
                  name: "Nested Step",
                  inputs: {
                    text: "{{ stepsByName.Second Step.message }} and {{ steps.1.success }}",
                  },
                  id: "nestedStep",
                },
              ],
            },
          },
          id: "branchStep",
        },
      ],
      stepNames: {
        step1: "First Step",
        step2: "Second Step",
        branchStep: "Branch",
      },
    },
  }

  it("updateBindingsInInputs updates string bindings correctly", () => {
    const input = "{{ stepsByName.oldName.success }} and {{ steps.1.message }}"
    const result = updateBindingsInInputs(input, "oldName", "newName", 1)
    expect(result).toBe(
      "{{ stepsByName.newName.success }} and {{ stepsByName.newName.message }}"
    )
  })

  it("updateBindingsInInputs handles nested objects", () => {
    const input = {
      text: "{{ stepsByName.oldName.success }}",
      nested: {
        value: "{{ steps.1.message }}",
      },
    }
    const result = updateBindingsInInputs(input, "oldName", "newName", 1)
    expect(result).toEqual({
      text: "{{ stepsByName.newName.success }}",
      nested: {
        value: "{{ stepsByName.newName.message }}",
      },
    })
  })

  it("updateBindingsInSteps updates bindings in all steps", () => {
    const steps = cloneDeep(sampleAutomation.definition.steps)
    const result = updateBindingsInSteps(
      steps,
      "Second Step",
      "Renamed Step",
      1
    )

    expect(result[1].name).toBe("Second Step")

    expect(result[2].inputs.branches[0].condition.equal).toEqual({
      "stepsByName.Renamed Step.success": true,
    })

    const nestedStepText = result[2].inputs.children.branch1[0].inputs.text
    expect(nestedStepText).toBe(
      "{{ stepsByName.Renamed Step.message }} and {{ stepsByName.Renamed Step.success }}"
    )
  })

  it("updateBindingsInSteps handles steps with no bindings", () => {
    const steps = [
      {
        name: "No Binding Step",
        inputs: {
          text: "Plain text",
        },
        id: "noBindingStep",
      },
    ]
    const result = updateBindingsInSteps(steps, "Old Name", "New Name", 0)
    expect(result).toEqual(steps)
  })

  it("updateBindingsInSteps updates bindings in deeply nested branches", () => {
    const deeplyNestedStep = {
      name: "Deep Branch",
      inputs: {
        branches: [
          {
            name: "deepBranch",
            condition: {
              equal: {
                "stepsByName.Second Step.success": true,
              },
            },
          },
        ],
        children: {
          deepBranch: [
            {
              name: "Deep Log",
              inputs: {
                text: "{{ steps.1.message }}",
              },
            },
          ],
        },
      },
    }

    const steps = [...sampleAutomation.definition.steps, deeplyNestedStep]
    const result = updateBindingsInSteps(
      steps,
      "Second Step",
      "Renamed Step",
      1
    )

    expect(
      result[3].inputs.branches[0].condition.equal[
        "stepsByName.Renamed Step.success"
      ]
    ).toBe(true)
    expect(result[3].inputs.children.deepBranch[0].inputs.text).toBe(
      "{{ stepsByName.Renamed Step.message }}"
    )
  })

  it("updateBindingsInSteps does not affect unrelated bindings", () => {
    const steps = cloneDeep(sampleAutomation.definition.steps)
    const result = updateBindingsInSteps(
      steps,
      "Second Step",
      "Renamed Step",
      1
    )

    expect(result[1].inputs.text).toBe(
      "{{ steps.0.success }} and {{ stepsByName.First Step.message }}"
    )
  })
})

describe("getNewStepName", () => {
  const automation = {
    definition: {
      steps: [
        {
          name: "Create row",
          inputs: {},
          id: "step1",
        },
        {
          name: "Create row 2",
          inputs: {},
          id: "step2",
        },
        {
          name: "Branch",
          stepId: "BRANCH",
          inputs: {
            children: {
              branch1: [
                {
                  name: "Create row 3",
                  inputs: {},
                  id: "nestedStep",
                },
              ],
            },
          },
          id: "branchStep",
        },
      ],
    },
  }

  it("increments a trailing numeric suffix when adding new steps", () => {
    expect(getNewStepName(automation, { name: "Create row 2" })).toBe(
      "Create row 4"
    )
  })

  it("starts numbering when adding an unsuffixed new step", () => {
    expect(getNewStepName(automation, { name: "Branch" })).toBe("Branch 2")
  })

  it("continues unsuffixed new step names from the highest existing suffix", () => {
    expect(getNewStepName(automation, { name: "Create row" })).toBe(
      "Create row 4"
    )
  })
})

describe("getDuplicateStepName", () => {
  const automation = {
    definition: {
      steps: [
        {
          name: "Create row",
          inputs: {},
          id: "step1",
        },
        {
          name: "Create row 2",
          inputs: {},
          id: "step2",
        },
        {
          name: "Branch",
          stepId: "BRANCH",
          inputs: {
            children: {
              branch1: [
                {
                  name: "Create row 3",
                  inputs: {},
                  id: "nestedStep",
                },
              ],
            },
          },
          id: "branchStep",
        },
      ],
    },
  }

  it("starts unsuffixed duplicate names at 2", () => {
    expect(getDuplicateStepName(undefined, { name: "Create row" })).toBe(
      "Create row 2"
    )
  })

  it("increments trailing numeric suffixes beyond existing matching steps", () => {
    expect(getDuplicateStepName(automation, { name: "Create row 2" })).toBe(
      "Create row 4"
    )
  })

  it("supports duplicating from a display name string while avoiding collisions", () => {
    expect(getDuplicateStepName(automation, "Create row")).toBe("Create row 4")
  })

  it("uses display step names when checking existing suffixes", () => {
    const automationWithDisplayName = {
      definition: {
        stepNames: {
          renamedStep: "Create row 2",
        },
        steps: [
          {
            name: "Renamed row step",
            inputs: {},
            id: "renamedStep",
          },
        ],
      },
    }

    expect(getDuplicateStepName(automationWithDisplayName, "Create row")).toBe(
      "Create row 3"
    )
  })
})
