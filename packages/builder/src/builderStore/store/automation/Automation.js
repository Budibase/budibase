import { generate } from "shortid"

/**
 * Class responsible for the traversing of the automation definition.
 * Automation definitions are stored in linked lists.
 */
export default class Automation {
  constructor(automation) {
    this.automation = automation
  }

  hasTrigger() {
    return this.automation.definition.trigger
  }

  addBlock(block) {
    // Make sure to add trigger if doesn't exist
    if (!this.hasTrigger() && block.type === "TRIGGER") {
      const trigger = { id: generate(), ...block }
      this.automation.definition.trigger = trigger
      return trigger
    }

    const newBlock = { id: generate(), ...block }
    this.automation.definition.steps = [
      ...this.automation.definition.steps,
      newBlock,
    ]
    return newBlock
  }

  updateBlock(updatedBlock, id) {
    const { steps, trigger } = this.automation.definition

    if (trigger && trigger.id === id) {
      this.automation.definition.trigger = updatedBlock
      return
    }

    const stepIdx = steps.findIndex(step => step.id === id)
    if (stepIdx < 0) throw new Error("Block not found.")
    steps.splice(stepIdx, 1, updatedBlock)
    this.automation.definition.steps = steps
  }

  deleteBlock(id) {
    const { steps, trigger } = this.automation.definition

    if (trigger && trigger.id === id) {
      this.automation.definition.trigger = null
      return
    }

    const stepIdx = steps.findIndex(step => step.id === id)
    if (stepIdx < 0) throw new Error("Block not found.")
    steps.splice(stepIdx, 1)
    this.automation.definition.steps = steps
  }
}
