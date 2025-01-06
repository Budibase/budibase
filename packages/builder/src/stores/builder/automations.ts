import { derived, get } from "svelte/store"
import { API } from "@/api"
import { cloneDeep } from "lodash/fp"
import { generate } from "shortid"
import { createHistoryStore } from "@/stores/builder/history"
import { licensing } from "@/stores/portal"
import { tables, appStore } from "@/stores/builder"
import { notifications } from "@budibase/bbui"
import {
  getEnvironmentBindings,
  migrateReferencesInObject,
  getUserBindings,
  getSettingBindings,
} from "@/dataBinding"
import {
  AutomationTriggerStepId,
  AutomationEventType,
  AutomationStepType,
  AutomationActionStepId,
  Automation,
  AutomationStep,
  Table,
  Branch,
  AutomationTrigger,
  AutomationStatus,
  UILogicalOperator,
  EmptyFilterOption,
  AutomationIOType,
  AutomationStepSchema,
  AutomationTriggerSchema,
  BranchPath,
  BlockDefinitions,
} from "@budibase/types"
import { ActionStepID } from "@/constants/backend/automations"
import { FIELDS } from "@/constants/backend"
import { sdk } from "@budibase/shared-core"
import { rowActions } from "./rowActions"
import { getNewStepName } from "@/helpers/automations/nameHelpers"
import { QueryUtils } from "@budibase/frontend-core"
import { BudiStore, DerivedBudiStore } from "@/stores/BudiStore"

interface AutomationState {
  automations: Automation[]
  testResults: any | null
  showTestPanel: boolean
  blockDefinitions: BlockDefinitions
  selectedAutomationId: string | null
}

interface DerivedAutomationState extends AutomationState {
  data: Automation | null
  blockRefs: Record<string, any>
}

const initialAutomationState: AutomationState = {
  automations: [],
  testResults: null,
  showTestPanel: false,
  blockDefinitions: {
    TRIGGER: {},
    CREATABLE_TRIGGER: {},
    ACTION: {},
  },
  selectedAutomationId: null,
}

const getFinalDefinitions = (
  triggers: Record<string, any>,
  actions: Record<string, any>
): BlockDefinitions => {
  const creatable: Record<string, any> = {}
  Object.entries(triggers).forEach(entry => {
    if (entry[0] === AutomationTriggerStepId.ROW_ACTION) {
      return
    }
    creatable[entry[0]] = entry[1]
  })
  return {
    TRIGGER: triggers,
    CREATABLE_TRIGGER: creatable,
    ACTION: actions,
  }
}

const automationActions = (store: AutomationStore) => ({
  /**
   * Move a given block from one location on the tree to another.
   *
   * @param {Object} sourcePath path to the block to be moved
   * @param {Object} destPath the destinationPart
   * @param {Object} automation the automaton to be mutated
   */
  moveBlock: async (
    sourcePath: BranchPath[],
    destPath: BranchPath[],
    automation: Automation
  ) => {
    // The last part of the source node address, containing the id.
    const pathSource = sourcePath.at(-1)

    // The last part of the destination node address, containing the id.
    const pathEnd = destPath.at(-1)

    // Check if dragging a step into its own drag zone
    const isOwnDragzone = pathSource?.id === pathEnd?.id

    // Check if dragging the first branch step into the branch node drag zone
    const isFirstBranchStep =
      pathEnd?.branchStepId &&
      pathEnd.branchIdx === pathSource?.branchIdx &&
      pathSource?.stepIdx === 0

    // If dragging into an area that will not affect the tree structure
    // Ignore the drag and drop.
    if (isOwnDragzone || isFirstBranchStep) {
      return
    }

    // Use core delete to remove and return the deleted block
    // from the automation
    const { deleted, newAutomation } = store.actions.deleteBlock(
      sourcePath,
      automation
    )

    // Traverse again as deleting the node from its original location
    // will redefine all proceding node locations
    const newRefs: Record<string, any> = {}
    store.actions.traverse(newRefs, newAutomation)

    let finalPath
    // If dropping in a branch-step dropzone you need to find
    // the updated parent step route then add the branch details again
    if (pathEnd?.branchStepId) {
      const branchStepRef = newRefs[pathEnd.branchStepId]
      finalPath = branchStepRef.pathTo
      finalPath.push(pathEnd)
    } else {
      // Place the target 1 after the drop
      if (pathEnd?.id) {
        finalPath = newRefs[pathEnd.id].pathTo
      }
      finalPath.at(-1).stepIdx += 1
    }

    // Uses the updated tree refs to resolve the new position
    // for the moved element.
    const updated = store.actions.updateStep(
      finalPath,
      newAutomation,
      deleted,
      true
    )

    try {
      await store.actions.save(updated)
    } catch (e) {
      notifications.error("Error moving automation block")
      console.error("Error moving automation block ", e)
    }
  },
  /**
   * Core delete function that will delete the node at the provided
   * location. Loops require 2 deletes so the function returns an array.
   * The passed in automation is not mutated
   *
   * @param {*} pathTo the tree path to the target node
   * @param {*} automation the automation to alter.
   * @returns {Object} contains the deleted nodes and new updated automation
   */
  deleteBlock: (pathTo: Array<BranchPath>, automation: Automation) => {
    let newAutomation = cloneDeep(automation)

    const steps = [
      newAutomation.definition.trigger,
      ...newAutomation.definition.steps,
    ]

    let cache: any
    pathTo.forEach((path, pathIdx, array) => {
      const final = pathIdx === array.length - 1
      const { stepIdx, branchIdx } = path

      const deleteCore = (steps: AutomationStep[], idx: number) => {
        const targetBlock = steps[idx]
        // By default, include the id of the target block
        const idsToDelete = [targetBlock.id]
        const blocksDeleted: AutomationStep[] = []

        // If deleting a looped block, ensure all related block references are
        // collated beforehand. Delete can then be handled atomically
        const loopSteps: Record<string, string> = {}
        steps.forEach(child => {
          const { blockToLoop, id: loopBlockId } = child
          if (blockToLoop) {
            // The loop block > the block it loops
            loopSteps[blockToLoop] = loopBlockId
          }
        })

        // Check if there is a related loop block to remove
        const loopStep = loopSteps[targetBlock.id]
        if (loopStep) {
          idsToDelete.push(loopStep)
        }

        // Purge all ids related to the block being deleted
        for (let i = steps.length - 1; i >= 0; i--) {
          if (idsToDelete.includes(steps[i].id)) {
            const [deletedBlock] = steps.splice(i, 1)
            blocksDeleted.unshift(deletedBlock)
          }
        }

        return { deleted: blocksDeleted, newAutomation }
      }

      if (!cache) {
        // If the path history is empty and on the final step
        // delete the specified target
        if (final) {
          cache = deleteCore(
            newAutomation.definition.steps,
            stepIdx > 0 ? stepIdx - 1 : 0
          )
        } else {
          // Return the root node
          cache = steps[stepIdx]
        }
        return
      }

      if (Number.isInteger(branchIdx)) {
        const branchId = cache.inputs.branches[branchIdx].id
        const children = cache.inputs.children[branchId]
        const currentBlock = children[stepIdx]

        if (final) {
          cache = deleteCore(children, stepIdx)
        } else {
          cache = currentBlock
        }
      }
    })

    // should be 1-2 blocks in an array
    return cache
  },
  /**
   * Build metadata for the automation tree. Store the path and
   * note any loop information used when rendering
   *
   * @param {Object} block
   * @param {Array<Object>} pathTo
   */
  registerBlock: (
    blocks: Record<string, any>,
    block: AutomationStep | AutomationTrigger,
    pathTo: Array<BranchPath>,
    terminating: boolean
  ) => {
    blocks[block.id] = {
      ...(blocks[block.id] || {}),
      pathTo,
      terminating: terminating || false,
      ...(block.blockToLoop ? { blockToLoop: block.blockToLoop } : {}),
    }

    // If this is a loop block, add a reference to the block being looped
    if (block.blockToLoop) {
      blocks[block.blockToLoop] = {
        ...(blocks[block.blockToLoop] || {}),
        looped: block.id,
      }
    }
  },

  /**
   * Build a sequential list of all steps on the step path provided
   *
   * @param {Array<Object>} pathWay e.g. [{stepIdx:2},{branchIdx:0, stepIdx:2},...]
   * @returns {Array<Object>} all steps encountered on the provided path
   */
  getPathSteps: (pathWay: Array<BranchPath>, automation: Automation) => {
    // Base Steps, including trigger
    const steps = [
      automation.definition.trigger,
      ...automation.definition.steps,
    ]

    let result: (AutomationStep | AutomationTrigger)[] = []
    pathWay.forEach(path => {
      const { stepIdx, branchIdx } = path
      let last = result.length ? result[result.length - 1] : []
      if (!result.length) {
        // Preceeding steps.
        result = steps.slice(0, stepIdx + 1)
        return
      }
      if (last && "inputs" in last) {
        if (Number.isInteger(branchIdx)) {
          const branchId = last.inputs.branches[branchIdx].id
          const children = last.inputs.children[branchId]
          const stepChildren = children.slice(0, stepIdx + 1)
          // Preceeding steps.
          result = result.concat(stepChildren)
        }
      }
    })
    return result
  },

  /**
   * Take an updated step and replace it in the specified location
   * on the automation. If `insert` is set to true, the supplied block/s
   * will be inserted instead.
   *
   * @param {Array<Object>} pathWay the full path to the tree node and the step
   * @param {Object} automation the automation to be mutated
   * @param {Object} update the block to replace
   * @param {Boolean} insert defaults to false
   * @returns
   */
  updateStep: (
    pathWay: Array<BranchPath>,
    automation: Automation,
    update: AutomationStep | AutomationTrigger,
    insert = false
  ) => {
    let newAutomation = cloneDeep(automation)

    const finalise = (
      dest: AutomationStep[],
      idx: number,
      update: AutomationStep | AutomationTrigger
    ) => {
      dest.splice(
        idx,
        insert ? 0 : Array.isArray(update) ? update.length : 1,
        ...(Array.isArray(update) ? update : [update])
      )
    }

    let cache: any = null
    pathWay.forEach((path, idx, array) => {
      const { stepIdx, branchIdx } = path
      let final = idx === array.length - 1

      if (!cache) {
        // Trigger offset
        let idx = Math.max(stepIdx - 1, 0)
        if (final) {
          finalise(newAutomation.definition.steps, idx, update)
          return
        }
        cache = newAutomation.definition.steps[idx]
      }

      if (Number.isInteger(branchIdx)) {
        const branchId = cache.inputs.branches[branchIdx].id
        const children = cache.inputs.children[branchId]
        if (final) {
          finalise(children, stepIdx, update)
        } else {
          cache = children[stepIdx]
        }
      }
    })

    return newAutomation
  },

  /**
   * If the current license covers Environment variables,
   * all environment variables will be output as bindings
   *
   * @returns {Array<Object>} all available environment bindings
   */
  buildEnvironmentBindings: () => {
    if (get(licensing).environmentVariablesEnabled) {
      return getEnvironmentBindings().map(binding => {
        return {
          ...binding,
          display: {
            ...binding.display,
            rank: 98,
          },
        }
      })
    }
    return []
  },

  /**
   * Get user bindings
   *
   * @returns {Array<Object>} all available user bindings
   */
  buildUserBindings: () => {
    return getUserBindings().map((binding: any) => {
      return {
        ...binding,
        category: "User",
        display: {
          ...binding.display,
          rank: 98,
        },
      }
    })
  },

  /**
   * Get settings bindings
   *
   * @returns {Array<Object>} all available settings bindings
   */
  buildSettingBindings: () => {
    return getSettingBindings().map(binding => {
      return {
        ...binding,
        display: {
          ...binding.display,
          rank: 98,
        },
      }
    })
  },
  /**
   * Take the supplied step id and aggregate all bindings for every
   * step preceding it.
   *
   * @param {string} id the step id of the target
   * @returns {Array<Object>} all bindings on the path to this step
   */
  getPathBindings: (id: string) => {
    const block = get(selectedAutomation)?.blockRefs[id]
    return store.actions.getAvailableBindings(
      block,
      get(selectedAutomation)?.data
    )
  },

  /**
   * Takes the provided automation and traverses all possible paths.
   * References to all nodes/steps encountered on the way are stored
   * in state under 'blocks'. These references are used to store tree related
   * metadata like the tree path or whether the node is terminating.
   *
   * @param {Object} automation
   */
  traverse: (blockRefs: Record<string, any>, automation: Automation) => {
    let blocks: (AutomationStep | AutomationTrigger)[] = []
    if (!automation || !blockRefs) {
      return
    }
    if (automation.definition?.trigger) {
      blocks.push(automation.definition.trigger)
    }
    blocks = blocks.concat(automation.definition.steps || [])

    const treeTraverse = (
      block: AutomationStep | AutomationTrigger,
      pathTo: Array<any> | null,
      stepIdx: number,
      branchIdx: number | null,
      terminating: boolean
    ) => {
      const pathToCurrentNode = [
        ...(pathTo || []),
        {
          ...(Number.isInteger(branchIdx) ? { branchIdx } : {}),
          stepIdx,
          id: block.id,
        },
      ]
      const branches: Branch[] = block.inputs?.branches || []

      branches.forEach((branch, bIdx) => {
        block.inputs?.children[branch.id].forEach(
          (bBlock: AutomationStep, sIdx: number, array: AutomationStep[]) => {
            const ended =
              array.length - 1 === sIdx && !bBlock.inputs?.branches?.length
            treeTraverse(bBlock, pathToCurrentNode, sIdx, bIdx, ended)
          }
        )
      })

      store.actions.registerBlock(
        blockRefs,
        block,
        pathToCurrentNode,
        terminating && !branches.length
      )
    }

    // Traverse the entire tree.
    blocks.forEach((block, idx, array) => {
      treeTraverse(block, null, idx, null, array.length - 1 === idx)
    })

    return blockRefs
  },

  getAvailableBindings: (block: any, automation: Automation | null) => {
    if (!block || !automation?.definition) {
      return []
    }

    // Registered blocks
    const blocks = get(selectedAutomation)?.blockRefs

    // Get all preceeding steps, including the trigger
    // Filter out the target step as we don't want to include itself
    const pathSteps = store.actions
      .getPathSteps(block.pathTo, automation)
      .slice(0, -1)

    // Current step will always be the last step of the path
    const currentBlock = store.actions
      .getPathSteps(block.pathTo, automation)
      .at(-1)

    // Extract all outputs from all previous steps as available bindings
    let bindings: any[] = []
    const addBinding = (
      name: string,
      value: any,
      icon: string,
      idx: number,
      isLoopBlock: boolean,
      bindingName?: string
    ) => {
      if (!name) return
      const runtimeBinding = store.actions.determineRuntimeBinding(
        name,
        idx,
        isLoopBlock,
        bindingName,
        automation,
        currentBlock,
        pathSteps
      )
      const categoryName = store.actions.determineCategoryName(
        idx,
        isLoopBlock,
        bindingName,
        loopBlockCount
      )
      bindings.push(
        store.actions.createBindingObject(
          name,
          value,
          icon,
          idx,
          loopBlockCount,
          isLoopBlock,
          runtimeBinding,
          categoryName,
          bindingName
        )
      )
    }

    let loopBlockCount = 0

    for (let blockIdx = 0; blockIdx < pathSteps.length; blockIdx++) {
      const pathBlock = pathSteps[blockIdx]
      const bindingName =
        automation.definition.stepNames?.[pathBlock.id] || pathBlock.name

      let schema = cloneDeep(pathBlock?.schema?.outputs?.properties) ?? {}
      let isLoopBlock = false
      if (pathBlock.blockToLoop) {
        isLoopBlock =
          pathBlock.stepId === ActionStepID.LOOP &&
          pathBlock.blockToLoop in blocks
      }
      const isTrigger = pathBlock.type === AutomationStepType.TRIGGER

      if (isLoopBlock && loopBlockCount == 0) {
        schema = {
          currentItem: {
            type: AutomationIOType.STRING,
            description: "the item currently being executed",
          },
        }
      }

      const icon = isTrigger
        ? pathBlock.icon
        : isLoopBlock
        ? "Reuse"
        : pathBlock.icon

      if (blockIdx === 0 && isTrigger) {
        if (
          pathBlock.event === AutomationEventType.ROW_UPDATE ||
          pathBlock.event === AutomationEventType.ROW_SAVE
        ) {
          let table: any = get(tables).list.find(
            (table: Table) => table._id === pathBlock.inputs.tableId
          )

          for (const key in table?.schema) {
            schema[key] = {
              type: table.schema[key].type,
              subtype: table.schema[key].subtype,
            }
          }
          delete schema.row
        } else if (pathBlock.event === AutomationEventType.APP_TRIGGER) {
          schema = Object.fromEntries(
            Object.keys(pathBlock.inputs.fields || []).map(key => [
              key,
              { type: pathBlock.inputs.fields[key] },
            ])
          )
        }
      }

      // Add the loop outputs to a looped block
      if (blocks[pathBlock.id]?.looped) {
        loopBlockCount++

        const loopBlockId = blocks[pathBlock.id].looped
        const loopBlock = pathSteps.find(step => step.id === loopBlockId)
        if (loopBlock) {
          schema = cloneDeep(loopBlock.schema?.outputs?.properties)
        } else {
          console.error("Loop block missing.")
        }
      }
      Object.entries(schema).forEach(([name, value]) => {
        addBinding(name, value, icon, blockIdx, isLoopBlock, bindingName)
      })
    }

    // Remove loop items
    if (!block.looped) {
      bindings = bindings.filter(x => !x.readableBinding.includes("loop"))
    }
    return bindings
  },

  determineRuntimeBinding: (
    name: string,
    idx: number,
    isLoopBlock: boolean,
    bindingName: string | undefined,
    automation: Automation,
    currentBlock: AutomationStep | AutomationTrigger | undefined,
    pathSteps: (AutomationStep | AutomationTrigger)[]
  ) => {
    let runtimeName: string | null

    /* Begin special cases for generating custom schemas based on triggers */
    if (
      idx === 0 &&
      automation.definition.trigger?.event === AutomationEventType.APP_TRIGGER
    ) {
      return `trigger.fields.${name}`
    }

    if (
      idx === 0 &&
      (automation.definition.trigger?.event ===
        AutomationEventType.ROW_UPDATE ||
        automation.definition.trigger?.event === AutomationEventType.ROW_SAVE)
    ) {
      let noRowKeywordBindings = ["id", "revision", "oldRow"]
      if (!noRowKeywordBindings.includes(name)) return `trigger.row.${name}`
    }
    /* End special cases for generating custom schemas based on triggers */

    if (isLoopBlock) {
      runtimeName = `loop.${name}`
    } else if (idx === 0) {
      runtimeName = `trigger.${name}`
    } else if (currentBlock?.stepId === AutomationActionStepId.EXECUTE_SCRIPT) {
      const stepId = pathSteps[idx].id
      if (!stepId) {
        notifications.error("Error generating binding: Step ID not found.")
        return null
      }
      runtimeName = `steps["${stepId}"].${name}`
    } else {
      const stepId = pathSteps[idx].id
      if (!stepId) {
        notifications.error("Error generating binding: Step ID not found.")
        return null
      }
      runtimeName = `steps.${stepId}.${name}`
    }

    return runtimeName
  },

  determineCategoryName: (
    idx: number,
    isLoopBlock: boolean,
    bindingName: string | undefined,
    loopBlockCount: number
  ) => {
    if (idx === 0) return "Trigger outputs"
    if (isLoopBlock) return "Loop Outputs"
    return bindingName
      ? `${bindingName} outputs`
      : `Step ${idx - loopBlockCount} outputs`
  },

  createBindingObject: (
    name: string,
    value: any,
    icon: string,
    idx: number,
    loopBlockCount: number,
    isLoopBlock: boolean,
    runtimeBinding: string | null,
    categoryName: string,
    bindingName?: string
  ) => {
    const field = Object.values(FIELDS).find(
      field =>
        field.type === value.type &&
        ("subtype" in field ? field.subtype === value.subtype : true)
    )
    return {
      readableBinding:
        bindingName && !isLoopBlock && idx !== 0
          ? `steps.${bindingName}.${name}`
          : runtimeBinding,
      runtimeBinding,
      type: value.type,
      description: value.description,
      icon,
      category: categoryName,
      display: {
        type: field?.name || value.type,
        name,
        rank: isLoopBlock ? idx + 1 : idx - loopBlockCount,
      },
    }
  },

  processBlockInputs: async (
    block: AutomationStep,
    data: Record<string, any>
  ) => {
    // Create new modified block
    let newBlock: AutomationStep & { inputs: any } = {
      ...block,
      inputs: {
        ...block.inputs,
        ...data,
      },
    }

    // Remove any nullish or empty string values
    Object.keys(newBlock.inputs).forEach(key => {
      const val = newBlock.inputs[key]
      if (val == null || val === "") {
        delete newBlock.inputs[key]
      }
    })

    // Create new modified automation
    const automation = get(selectedAutomation)?.data
    if (!automation) {
      return false
    }
    const newAutomation = store.actions.getUpdatedDefinition(
      automation,
      newBlock
    )

    // Don't save if no changes were made
    if (JSON.stringify(newAutomation) === JSON.stringify(automation)) {
      return false
    }

    return newAutomation
  },

  updateBlockInputs: async (
    block: AutomationStep,
    data: Record<string, any>
  ) => {
    const newAutomation = await store.actions.processBlockInputs(block, data)
    if (newAutomation === false) {
      return
    }
    await store.actions.save(newAutomation)
  },

  test: async (automation: Automation, testData: any) => {
    let result: any
    try {
      result = await API.testAutomation(automation._id!, testData)
    } catch (err: any) {
      const message = err.message || err.status || JSON.stringify(err)
      throw `Automation test failed - ${message}`
    }
    if (!result?.trigger && !result?.steps?.length && !result?.message) {
      if (result?.err?.code === "usage_limit_exceeded") {
        throw "You have exceeded your automation quota"
      }
      throw "Something went wrong testing your automation"
    }
    store.update(state => {
      state.testResults = result
      return state
    })
  },

  getUpdatedDefinition: (
    automation: Automation,
    block: AutomationStep | AutomationTrigger
  ): Automation => {
    let newAutomation: Automation
    if (automation.definition.trigger?.id === block.id) {
      newAutomation = cloneDeep(automation)
      newAutomation.definition.trigger = block as AutomationTrigger
    } else {
      const pathToStep = get(selectedAutomation)!.blockRefs[block.id].pathTo
      newAutomation = store.actions.updateStep(pathToStep, automation, block)
    }
    return newAutomation
  },

  getLogs: async ({
    automationId,
    startDate,
    status,
    page,
  }: {
    automationId?: string
    startDate?: string
    status?: AutomationStatus
    page?: string
  } = {}) => {
    return await API.getAutomationLogs({
      automationId,
      startDate,
      status,
      page,
    })
  },

  clearLogErrors: async ({
    automationId,
    appId,
  }: {
    automationId: string
    appId: string
  }) => {
    if (!automationId || !appId) {
      throw new Error("automationId and appId are required")
    }
    return await API.clearAutomationLogErrors(automationId, appId)
  },

  addTestDataToAutomation: (data: any) => {
    let newAutomation = cloneDeep(get(selectedAutomation)?.data)
    if (!newAutomation) {
      return newAutomation
    }
    newAutomation.testData = {
      ...newAutomation.testData,
      ...data,
    }
    return newAutomation
  },

  constructBlock: (type: string, stepId: string, blockDefinition: any) => {
    const newStep = {
      ...blockDefinition,
      inputs: blockDefinition.inputs || {},
      stepId,
      type,
      id: generate(),
    }
    const newName = getNewStepName(get(selectedAutomation)?.data, newStep)
    newStep.name = newName
    return newStep
  },

  /**
   * Generate a new branch block for adding to the automation
   * There are a minimum of 2 empty branches by default.
   *
   * @returns {Object} - a default branch block
   */
  generateBranchBlock: () => {
    const branchDefinition = get(store).blockDefinitions.ACTION.BRANCH
    return store.actions.constructBlock("ACTION", "BRANCH", branchDefinition)
  },

  /**
   * Take a newly constructed block and insert it in the automation tree
   * at the specified location.
   *
   * @param {Object} block the new block
   * @param {Array<Object>} pathWay location of insert point
   */
  addBlockToAutomation: async (block: AutomationStep, pathWay: Array<any>) => {
    const automation = get(selectedAutomation)?.data
    if (!automation) {
      return
    }
    let newAutomation = cloneDeep(automation)

    const steps = [
      newAutomation.definition.trigger,
      ...newAutomation.definition.steps,
    ]

    let cache:
      | AutomationStepSchema<AutomationActionStepId>
      | AutomationTriggerSchema<AutomationTriggerStepId>

    pathWay.forEach((path, pathIdx, array) => {
      const { stepIdx, branchIdx } = path
      const final = pathIdx === array.length - 1

      const insertBlock = (steps: AutomationStep[], stepIdx: number) => {
        const isBranchNode = !Number.isInteger(stepIdx)
        const insertIdx =
          block.blockToLoop || isBranchNode ? stepIdx : stepIdx + 1
        steps.splice(insertIdx, 0, block)
      }

      if (!cache) {
        if (final) {
          insertBlock(newAutomation.definition.steps, stepIdx - 1)
          cache = block
        } else {
          cache = steps[stepIdx]
        }
        return
      }
      if (Number.isInteger(branchIdx)) {
        const branchId = cache.inputs.branches[branchIdx].id
        const children = cache.inputs.children[branchId]

        if (final) {
          insertBlock(children, stepIdx)
          cache = children
        } else {
          cache = children[stepIdx]
        }
      }
    })

    try {
      await store.actions.save(newAutomation)
    } catch (e) {
      notifications.error("Error adding automation block")
      console.error("Automation adding block ", e)
    }
  },

  /**
   * Generate empty condition config
   * Used on initialisation and reset of a condition.
   *
   * @returns {Object} contains a condition and conditionUI entry.
   */
  generateDefaultConditions: () => {
    const baseConditionUI = {
      logicalOperator: UILogicalOperator.ALL,
      onEmptyFilter: EmptyFilterOption.RETURN_NONE,
      groups: [],
    }
    return {
      condition: QueryUtils.buildQuery(baseConditionUI),
      conditionUI: baseConditionUI,
    }
  },

  /**
   * Generates a new branch in the tree at the given location.
   * All steps below the path, if any, are added to a new default branch
   * 2 branch nodes are created by default.
   *
   * @param {Array<Object>} path - the insertion point on the tree.
   * @param {Object} automation - the target automation to update.
   */
  branchAutomation: async (path: Array<any>, automation: Automation) => {
    const insertPoint = path.at(-1)
    let newAutomation = cloneDeep(automation)
    let cache: any
    let atRoot = false

    // Generate a default empty branch
    const createBranch = (name: string) => {
      return {
        name,
        ...store.actions.generateDefaultConditions(),
        id: generate(),
      }
    }

    path.forEach((path, pathIdx, array) => {
      const { stepIdx, branchIdx } = path
      const final = pathIdx === array.length - 1

      if (!cache) {
        if (final) {
          cache = newAutomation.definition.steps
          atRoot = true
        } else {
          // Initial trigger offset
          cache = newAutomation.definition.steps[stepIdx - 1]
        }
      }

      if (Number.isInteger(branchIdx)) {
        const branchId = cache.inputs.branches[branchIdx].id
        const children = cache.inputs.children[branchId]

        // return all step siblings
        cache = final ? children : children[stepIdx]
      }
    })

    // Trigger offset when inserting
    const rootIdx = Math.max(insertPoint.stepIdx - 1, 0)
    const insertIdx = atRoot ? rootIdx : insertPoint.stepIdx

    // Check if the branch point is a on a branch step
    // Create an empty branch instead and append it
    if (cache[insertIdx]?.stepId == "BRANCH") {
      let branches = cache[insertIdx].inputs.branches
      const branchEntry = createBranch(`Branch ${branches.length + 1}`)

      // Splice the branch entry in
      branches.splice(branches.length, 0, branchEntry)

      // Add default children entry for the new branch
      cache[insertIdx].inputs.children[branchEntry.id] = []

      try {
        await store.actions.save(newAutomation)
      } catch (e) {
        notifications.error("Error adding branch to automation")
        console.error("Error adding automation branch", e)
      }
      return
    }

    // Creating a new branch block
    const newBranch = store.actions.generateBranchBlock()

    // Default branch node count is 2. Build 2 default entries
    newBranch.inputs.branches = Array.from({ length: 2 }).map((_, idx) => {
      return createBranch(`Branch ${idx + 1}`)
    })

    // Init the branch children. Shift all steps following the new branch step
    // into the 0th branch.
    newBranch.inputs.children = newBranch.inputs.branches.reduce(
      (acc: Record<string, AutomationStep[]>, branch: Branch, idx: number) => {
        acc[branch.id] = idx == 0 ? cache.slice(insertIdx + 1) : []
        return acc
      },
      {}
    )

    // Purge siblings that were branched
    cache.splice(insertIdx + 1)

    // Add the new branch to the end.
    cache.push(newBranch)

    try {
      await store.actions.save(newAutomation)
    } catch (e) {
      notifications.error("Error adding branch to automation")
      console.error("Error adding automation branch", e)
    }
  },

  /**
   * Take a block and move the provided branch to the left
   *
   * @param {Array<Object>} pathTo
   * @param {Object} automation
   * @param {Object} block
   */
  branchLeft: async (
    pathTo: Array<any>,
    automation: Automation,
    block: AutomationStep
  ) => {
    const update = store.actions.shiftBranch(pathTo, block)
    if (update) {
      const updatedAuto = store.actions.updateStep(
        pathTo.slice(0, -1),
        automation,
        update
      )
      await store.actions.save(updatedAuto)
    }
  },

  /**
   * Take a block and move the provided branch right
   *
   * @param {Array<Object>} pathTo
   * @param {Object} automation
   * @param {Object} block
   */
  branchRight: async (
    pathTo: Array<BranchPath>,
    automation: Automation,
    block: AutomationStep
  ) => {
    const update = store.actions.shiftBranch(pathTo, block, 1)
    if (update) {
      const updatedAuto = store.actions.updateStep(
        pathTo.slice(0, -1),
        automation,
        update
      )
      await store.actions.save(updatedAuto)
    }
  },

  /**
   * Shift swap a branch with its immediate neighbour.
   * @param {Array<Object>} pathTo - address of the branch to be moved.
   * @param {Object} block - the step the branch belongs to
   * @param {Number} direction - the direction of the swap. Defaults to -1 for left, add 1 for right
   * @returns
   */
  shiftBranch: (pathTo: Array<any>, block: AutomationStep, direction = -1) => {
    let newBlock = cloneDeep(block)
    const branchPath = pathTo.at(-1)
    const targetIdx = branchPath.branchIdx

    if (!newBlock.inputs.branches[targetIdx + direction]) {
      console.error("Invalid index")
      return
    }

    let [neighbour] = newBlock.inputs.branches.splice(targetIdx + direction, 1)
    newBlock.inputs.branches.splice(targetIdx, 0, neighbour)
    return newBlock
  },

  /**
   * Delete a branch at the given path
   * When branch count reaches 1, the branch children are removed
   * and replace the parent branch step at its index.
   *
   * @param {Array<Object>} path
   * @param {Array<Object>} automation
   */
  deleteBranch: async (path: Array<any>, automation: Automation) => {
    let newAutomation = cloneDeep(automation)
    let cache: any = []

    path.forEach((path, pathIdx, array) => {
      const { stepIdx, branchIdx } = path
      const final = pathIdx === array.length - 1

      // The first poi
      if (!cache.length) {
        if (final) {
          cache = newAutomation.definition.steps
          return
        }
        // Trigger offset
        cache = [
          {
            node: newAutomation.definition.steps[stepIdx - 1],
            context: newAutomation.definition.steps,
          },
        ]
      }

      const current = cache.at(-1)

      if (Number.isInteger(branchIdx)) {
        // data.inputs.branches.length
        const branchId = current.node.inputs.branches[branchIdx].id
        const children = current.node.inputs.children[branchId]

        if (final) {
          // 2 is the minimum amount of nodes on a branch
          const minBranches = current.node.inputs.branches.length == 2

          // Delete the target branch and its contents.
          current.node.inputs.branches.splice(branchIdx, 1)
          delete current.node.inputs.children[branchId]

          // If deleting with only 2 branches, the entire branch step
          // will be deleted, with its contents placed onto the parent.
          if (minBranches) {
            const lastBranchId = current.node.inputs.branches[0].id
            const lastBranchContent = current.node.inputs.children[lastBranchId]

            // Take the remaining branch and push all children onto the context
            const parentContext = cache.at(-1).context

            // Remove the branch node.
            parentContext.pop()

            // Splice in the remaining branch content into the parent.
            parentContext.splice(parentContext.length, 0, ...lastBranchContent)
          }

          return
        }

        cache.push({ node: children[stepIdx], context: children })
      }
    })

    try {
      await store.actions.save(newAutomation)
    } catch (e) {
      notifications.error("Error deleting automation branch")
      console.error("Error deleting automation branch", e)
    }
  },

  saveAutomationName: async (blockId: string, name: string) => {
    const automation = get(selectedAutomation)?.data
    let newAutomation = cloneDeep(automation)
    if (!newAutomation) {
      return
    }

    const newName = name.trim()
    newAutomation.definition.stepNames = {
      ...newAutomation.definition.stepNames,
      [blockId]: newName,
    }

    await store.actions.save(newAutomation)
  },

  deleteAutomationName: async (blockId: string) => {
    const automation = get(selectedAutomation)?.data
    let newAutomation = cloneDeep(automation)
    if (!automation || !newAutomation) {
      return
    }
    if (newAutomation?.definition.stepNames) {
      delete newAutomation.definition.stepNames[blockId]
    }

    await store.actions.save(newAutomation)
  },

  /**
   * Delete the block at a given path and save.
   * Any related blocks, like loops, are purged at the same time
   *
   * @param {Array<Object>} pathTo the path to the target node
   */
  deleteAutomationBlock: async (pathTo: Array<BranchPath>) => {
    const automation = get(selectedAutomation)?.data
    if (!automation) {
      return
    }

    const { newAutomation } = store.actions.deleteBlock(pathTo, automation)

    try {
      await store.actions.save(newAutomation)
    } catch (e) {
      notifications.error("Error deleting automation block")
      console.error("Automation deleting block ", e)
    }
  },

  replace: (automationId: string, automation?: Automation) => {
    if (!automation) {
      store.store.update(state => {
        state.automations = state.automations.filter(
          x => x._id !== automationId
        )
        if (automationId === state.selectedAutomationId) {
          store.actions.select(state.automations[0]?._id || null)
        }
        return state
      })
    } else {
      const index = get(store.store).automations.findIndex(
        x => x._id === automation._id
      )
      if (index === -1) {
        store.store.update(state => ({
          ...state,
          automations: [...state.automations, automation],
        }))
      } else {
        store.store.update(state => {
          state.automations[index] = automation
          return state
        })
      }
    }
  },

  create: async (name: string, trigger: AutomationTrigger) => {
    const automation: Automation = {
      name,
      type: "automation",
      appId: get(appStore).appId,
      definition: {
        steps: [],
        trigger,
      },
      disabled: false,
    }
    const response = await store.actions.save(automation)
    return response
  },

  duplicate: async (automation: Automation) => {
    const response = await store.actions.save({
      ...automation,
      name: `${automation.name} - copy`,
      _id: undefined,
      _rev: undefined,
    })
    return response
  },

  toggleDisabled: async (automationId: string) => {
    let automation: Automation | undefined
    try {
      automation = store.actions.getDefinition(automationId)
      if (!automation) {
        return
      }
      automation.disabled = !automation.disabled
      await store.actions.save(automation)
      notifications.success(
        `Automation ${
          automation.disabled ? "disabled" : "enabled"
        } successfully`
      )
    } catch (error) {
      notifications.error(
        `Error ${automation?.disabled ? "disabling" : "enabling"} automation`
      )
    }
  },

  definitions: async () => {
    const response = await API.getAutomationDefinitions()
    store.update(state => {
      state.blockDefinitions = getFinalDefinitions(
        response.trigger,
        response.action
      )
      return state
    })
    return response
  },

  fetch: async () => {
    const [automationResponse, definitions] = await Promise.all([
      API.getAutomations(),
      API.getAutomationDefinitions(),
    ])
    store.update(state => {
      state.automations = automationResponse.automations
      state.automations.sort((a, b) => {
        return a.name < b.name ? -1 : 1
      })
      state.blockDefinitions = getFinalDefinitions(
        definitions.trigger,
        definitions.action
      )
      return state
    })
  },

  select: (id: string | null) => {
    if (!id || id === get(store).selectedAutomationId) {
      return
    }
    store.update(state => {
      state.selectedAutomationId = id
      state.testResults = null
      state.showTestPanel = false
      return state
    })
  },

  getDefinition: (id: string): Automation | undefined => {
    return get(store.store).automations?.find(x => x._id === id)
  },

  save: async (automation: Automation) => {
    const response = await API.updateAutomation(automation)
    await store.actions.fetch()
    store.actions.select(response.automation._id!)
    return response.automation
  },

  delete: async (automation: Automation) => {
    const isRowAction = sdk.automations.isRowAction(automation)
    if (isRowAction) {
      await rowActions.delete(
        automation.definition.trigger.inputs.tableId,
        automation.definition.trigger.inputs.rowActionId
      )
    } else {
      await API.deleteAutomation(automation._id!, automation._rev!)
    }

    store.update(state => {
      state.automations = state.automations.filter(
        x => x._id !== automation._id
      )
      if (automation._id === state.selectedAutomationId) {
        state.selectedAutomationId = state.automations[0]?._id || null
      }
      return state
    })
  },
})

class AutomationStore extends BudiStore<AutomationState> {
  history: any
  actions: ReturnType<typeof automationActions>

  constructor() {
    super(initialAutomationState)
    this.actions = automationActions(this)
    this.history = createHistoryStore({
      getDoc: this.actions.getDefinition.bind(this),
      selectDoc: this.actions.select.bind(this),
      beforeAction: () => {},
      afterAction: () => {},
    })

    // Then wrap save and delete with history
    const originalSave = this.actions.save.bind(this.actions)
    const originalDelete = this.actions.delete.bind(this.actions)
    this.actions.save = this.history.wrapSaveDoc(originalSave)
    this.actions.delete = this.history.wrapDeleteDoc(originalDelete)
  }
}

export const automationStore = new AutomationStore()
export const automationHistoryStore = automationStore.history

export class SelectedAutomationStore extends DerivedBudiStore<
  AutomationState,
  DerivedAutomationState
> {
  constructor(automationStore: AutomationStore) {
    const makeDerivedStore = () => {
      return derived(automationStore, $store => {
        if (!$store.selectedAutomationId) {
          return {
            data: null,
            blockRefs: {},
            ...$store,
          }
        }

        const selected = $store.automations?.find(
          x => x._id === $store.selectedAutomationId
        )

        if (!selected) {
          return {
            data: null,
            blockRefs: {},
            ...$store,
          }
        }

        const blockRefs: Record<string, any> = {}
        const updatedAuto = cloneDeep(selected)

        // Only traverse if we have a valid automation
        if (updatedAuto) {
          automationStore.actions.traverse(blockRefs, updatedAuto)

          Object.values(blockRefs)
            .filter(blockRef => blockRef.terminating)
            .forEach(blockRef => {
              automationStore.actions
                .getPathSteps(blockRef.pathTo, updatedAuto)
                .forEach((step, idx, steps) => {
                  migrateReferencesInObject({
                    obj: step,
                    originalIndex: idx,
                    steps,
                  })
                })
            })
        }

        return {
          data: updatedAuto,
          blockRefs,
          ...$store,
        }
      })
    }

    super(initialAutomationState, makeDerivedStore)
  }
}
export const selectedAutomation = new SelectedAutomationStore(automationStore)
