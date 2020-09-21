import Automation from "../Automation"
import TEST_AUTOMATION from "./testAutomation"

const TEST_BLOCK = {
  id: "AUXJQGZY7",
  name: "Delay",
  icon: "ri-time-fill",
  tagline: "Delay for <b>{{time}}</b> milliseconds",
  description: "Delay the automation until an amount of time has passed.",
  params: { time: "number" },
  type: "LOGIC",
  args: { time: "5000" },
  stepId: "DELAY",
}

describe("Automation Data Object", () => {
  let automation

  beforeEach(() => {
    automation = new Automation({ ...TEST_AUTOMATION })
  })

  it("adds a automation block to the automation", () => {
    automation.addBlock(TEST_BLOCK)
    expect(automation.automation.definition)
  })

  it("updates a automation block with new attributes", () => {
    const firstBlock = automation.automation.definition.steps[0]
    const updatedBlock = {
      ...firstBlock,
      name: "UPDATED",
    }
    automation.updateBlock(updatedBlock, firstBlock.id)
    expect(automation.automation.definition.steps[0]).toEqual(updatedBlock)
  })

  it("deletes a automation block successfully", () => {
    const { steps } = automation.automation.definition
    const originalLength = steps.length

    const lastBlock = steps[steps.length - 1]
    automation.deleteBlock(lastBlock.id)
    expect(automation.automation.definition.steps.length).toBeLessThan(
      originalLength
    )
  })
})
