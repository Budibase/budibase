import mustache from "mustache"
// TODO: tidy up import
import blockDefinitions from "../../../pages/[application]/workflow/WorkflowPanel/blockDefinitions"
import { generate } from "shortid"

/**
 * Class responsible for the traversing of the workflow definition.
 * Workflow definitions are stored in linked lists.
 */
export default class Workflow {
  constructor(workflow) {
    this.workflow = workflow
  }

  addBlock(block) {
    let node = this.workflow.definition
    while (node.next) node = node.next
    node.next = {
      id: generate(),
      ...block
    } 
  }

  updateBlock(updatedBlock, id) {
    let block = this.workflow.definition

    while (block.id !== id) block = block.next
    if (!block) throw new Error("Block not found.")

    block = updatedBlock
  }

  deleteBlock(id) {
    let previous = null
    let block = this.workflow.definition

    // iterate through the blocks
    while (block.id !== id) {
      previous = block
      block = block.next
    }

    // delete the block matching your id
    if (!block.next) {
      delete previous.next
    } else {
      previous.next = block.next
    }

  }

  createUiTree() {
    if (!this.workflow.definition.next) return []
    return Workflow.buildUiTree(this.workflow.definition.next)
  }

  static buildUiTree(block, tree = []) {
    if (!block) return tree

    // The client side display definition for the block
    const definition = blockDefinitions[block.type][block.actionId]
    if (!definition) {
      throw new Error(
        `No block definition exists for the chosen block. Check there's an entry in the block definitions for ${block.actionId}`
      )
    }

    if (!definition.params) {
      throw new Error(
        `Blocks should always have parameters. Ensure that the block definition is correct for ${block.actionId}`
      )
    }

    const tagline = definition.tagline || ""
    const args = block.args || {}

    tree.push({
      id: block.id,
      type: block.type,
      params: block.params,
      args,
      heading: definition.actionId,
      body: mustache.render(tagline, args),
    })

    return this.buildUiTree(block.next, tree)
  }
}
