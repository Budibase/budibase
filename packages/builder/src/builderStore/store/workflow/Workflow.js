import { generate } from "shortid"

/**
 * Class responsible for the traversing of the workflow definition.
 * Workflow definitions are stored in linked lists.
 */
export default class Workflow {
  constructor(workflow) {
    this.workflow = workflow
  }

  hasTrigger() {
    return this.workflow.definition.trigger
  }

  addBlock(block) {
    // Make sure to add trigger if doesn't exist
    if (!this.hasTrigger() && block.type === "TRIGGER") {
      const trigger = { id: generate(), ...block }
      this.workflow.definition.trigger = trigger
      return trigger
    }

    const newBlock = { id: generate(), ...block }
    this.workflow.definition.steps = [
      ...this.workflow.definition.steps,
      newBlock,
    ]
    return newBlock
  }

  updateBlock(updatedBlock, id) {
    const { steps, trigger } = this.workflow.definition

    if (trigger && trigger.id === id) {
      this.workflow.definition.trigger = updatedBlock
      return
    }

    const stepIdx = steps.findIndex(step => step.id === id)
    if (stepIdx < 0) throw new Error("Block not found.")
    steps.splice(stepIdx, 1, updatedBlock)
    this.workflow.definition.steps = steps
  }

  deleteBlock(id) {
    const { steps, trigger } = this.workflow.definition

    if (trigger && trigger.id === id) {
      this.workflow.definition.trigger = null
      return
    }

    const stepIdx = steps.findIndex(step => step.id === id)
    if (stepIdx < 0) throw new Error("Block not found.")
    steps.splice(stepIdx, 1)
    this.workflow.definition.steps = steps
  }
}
