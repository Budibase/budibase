import Workflow from "../Workflow"
import TEST_WORKFLOW from "./testWorkflow"

const TEST_BLOCK = {
  id: "AUXJQGZY7",
  name: "Delay",
  icon: "ri-time-fill",
  tagline: "Delay for <b>{{time}}</b> milliseconds",
  description: "Delay the workflow until an amount of time has passed.",
  params: { time: "number" },
  type: "LOGIC",
  args: { time: "5000" },
  stepId: "DELAY",
}

describe("Workflow Data Object", () => {
  let workflow

  beforeEach(() => {
    workflow = new Workflow({ ...TEST_WORKFLOW })
  })

  it("adds a workflow block to the workflow", () => {
    workflow.addBlock(TEST_BLOCK)
    expect(workflow.workflow.definition)
  })

  it("updates a workflow block with new attributes", () => {
    const firstBlock = workflow.workflow.definition.steps[0]
    const updatedBlock = {
      ...firstBlock,
      name: "UPDATED",
    }
    workflow.updateBlock(updatedBlock, firstBlock.id)
    expect(workflow.workflow.definition.steps[0]).toEqual(updatedBlock)
  })

  it("deletes a workflow block successfully", () => {
    const { steps } = workflow.workflow.definition
    const originalLength = steps.length

    const lastBlock = steps[steps.length - 1]
    workflow.deleteBlock(lastBlock.id)
    expect(workflow.workflow.definition.steps.length).toBeLessThan(
      originalLength
    )
  })
})
