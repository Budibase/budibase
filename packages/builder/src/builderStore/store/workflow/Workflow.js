import mustache from "mustache"
// TODO: tidy up import
import blockDefinitions from "components/workflow/WorkflowPanel/blockDefinitions"
import { generate } from "shortid"

/**
 * Class responsible for the traversing of the workflow definition.
 * Workflow definitions are stored in linked lists.
 */
export default class Workflow {
  constructor(workflow) {
    this.workflow = workflow
  }

  isEmpty() {
    // return this.workflow.definition.next
    return this.workflow.length > 0
  }

  addBlock(block) {
    // Make sure to add trigger if doesn't exist
    this.workflow.definition.steps.push({
      id: generate(),
      ...block,
    })
  }

  updateBlock(updatedBlock, id) {
    const { steps, trigger } = this.workflow.definition

    // if the block is a trigger do X

    // if step
    const stepIdx = steps.findIndex(step => step.id === id)

    // while (block.id !== id) block = block.next
    if (stepIdx < 0) throw new Error("Block not found.")

    steps.splice(stepIdx, 1, updatedBlock)
  }

  deleteBlock(id) {
    const { steps, trigger } = this.workflow.definition

    const stepIdx = steps.findIndex(step => step.id === id)

    if (stepIdx < 0) throw new Error("Block not found.")

    steps.splice(stepIdx, 1)
  }

  createUiTree() {
    if (!this.workflow.definition) return []
    return Workflow.buildUiTree(this.workflow.definition)
  }

  static buildUiTree(definition) {
    return definition.steps.map(step => {
      // The client side display definition for the block
      const definition = blockDefinitions[step.type][step.actionId]
      if (!definition) {
        throw new Error(
          `No block definition exists for the chosen block. Check there's an entry in the block definitions for ${step.actionId}`
        )
      }

      if (!definition.params) {
        throw new Error(
          `Blocks should always have parameters. Ensure that the block definition is correct for ${step.actionId}`
        )
      }

      const tagline = definition.tagline || ""
      const args = step.args || {}

      return {
        id: step.id,
        type: step.type,
        params: step.params,
        args,
        heading: step.actionId,
        body: mustache.render(tagline, args),
        name: definition.name,
      }
    })
  }

  // static buildUiTree(block, tree = []) {
  //   if (!block) return tree

  //   // The client side display definition for the block
  //   const definition = blockDefinitions[block.type][block.actionId]
  //   if (!definition) {
  //     throw new Error(
  //       `No block definition exists for the chosen block. Check there's an entry in the block definitions for ${block.actionId}`
  //     )
  //   }

  //   if (!definition.params) {
  //     throw new Error(
  //       `Blocks should always have parameters. Ensure that the block definition is correct for ${block.actionId}`
  //     )
  //   }

  //   const tagline = definition.tagline || ""
  //   const args = block.args || {}

  //   // all the fields the workflow block needs to render in the UI
  //   tree.push({
  //     id: block.id,
  //     type: block.type,
  //     params: block.params,
  //     args,
  //     heading: block.actionId,
  //     body: mustache.render(tagline, args),
  //     name: definition.name
  //   })

  //   return this.buildUiTree(block.next, tree)
  // }
}
