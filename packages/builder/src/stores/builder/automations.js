import { writable, get, derived } from "svelte/store"
import { API } from "api"
import { cloneDeep } from "lodash/fp"
import { generate } from "shortid"
import { createHistoryStore } from "stores/builder/history"
import { licensing } from "stores/portal"
import { tables } from "stores/builder"
import { notifications } from "@budibase/bbui"
import {
  getEnvironmentBindings,
  migrateReferencesInObject,
  getUserBindings,
  getSettingBindings,
} from "dataBinding"
import {
  AutomationTriggerStepId,
  AutomationEventType,
  AutomationStepType,
} from "@budibase/types"
import { ActionStepID } from "constants/backend/automations"
import { FIELDS } from "constants/backend"
import { sdk } from "@budibase/shared-core"
import { rowActions } from "./rowActions"
import { getNewStepName } from "helpers/automations/nameHelpers"
import { QueryUtils } from "@budibase/frontend-core"

const initialAutomationState = {
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

// If this functions, remove the actions elements
export const createAutomationStore = () => {
  const store = writable(initialAutomationState)

  store.actions = automationActions(store)

  // Setup history for automations
  const history = createHistoryStore({
    getDoc: store.actions.getDefinition,
    selectDoc: store.actions.select,
  })

  store.actions.save = history.wrapSaveDoc(store.actions.save)
  store.actions.delete = history.wrapDeleteDoc(store.actions.delete)
  return { store, history }
}

const getFinalDefinitions = (triggers, actions) => {
  const creatable = {}
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

const automationActions = store => ({
  /**
   * Move a given block from one location on the tree to another.
   *
   * @param {Object} sourcePath path to the block to be moved
   * @param {Object} destPath the destinationPart
   * @param {Object} automation the automaton to be mutated
   */
  moveBlock: async (sourcePath, destPath, automation) => {
    // Use core delete to remove and return the deleted block
    // from the automation
    const { deleted, newAutomation } = store.actions.deleteBlock(
      sourcePath,
      automation
    )

    // Traverse again as deleting the node from its original location
    // will redefine all proceding node locations
    const newRefs = {}
    store.actions.traverse(newRefs, newAutomation)

    // The last part of the destination node address, containing the id.
    const pathEnd = destPath.at(-1)

    let finalPath
    // If dropping in a branch-step dropzone you need to find
    // the updated parent step route then add the branch details again
    if (pathEnd.branchStepId) {
      const branchStepRef = newRefs[pathEnd.branchStepId]
      finalPath = branchStepRef.pathTo
      finalPath.push(pathEnd)
    } else {
      // Place the target 1 after the drop
      finalPath = newRefs[pathEnd.id].pathTo
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
  deleteBlock: (pathTo, automation) => {
    let newAutomation = cloneDeep(automation)

    const steps = [
      newAutomation.definition.trigger,
      ...newAutomation.definition.steps,
    ]

    let cache
    pathTo.forEach((path, pathIdx, array) => {
      const final = pathIdx === array.length - 1
      const { stepIdx, branchIdx } = path

      const deleteCore = (steps, idx) => {
        const targetBlock = steps[idx]
        // By default, include the id of the target block
        const idsToDelete = [targetBlock.id]
        const blocksDeleted = []

        // If deleting a looped block, ensure all related block references are
        // collated beforehand. Delete can then be handled atomically
        const loopSteps = {}
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
  registerBlock: (blocks, block, pathTo, terminating) => {
    // Directly mutate the `blocks` object without reassigning
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
  getPathSteps: (pathWay, automation) => {
    // Base Steps, including trigger
    const steps = [
      automation.definition.trigger,
      ...automation.definition.steps,
    ]

    let result
    pathWay.forEach(path => {
      const { stepIdx, branchIdx } = path
      let last = result ? result[result.length - 1] : []
      if (!result) {
        // Preceeding steps.
        result = steps.slice(0, stepIdx + 1)
        return
      }

      if (Number.isInteger(branchIdx)) {
        const branchId = last.inputs.branches[branchIdx].id
        const children = last.inputs.children[branchId]
        const stepChildren = children.slice(0, stepIdx + 1)
        // Preceeding steps.
        result = result.concat(stepChildren)
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
  updateStep: (pathWay, automation, update, insert = false) => {
    let newAutomation = cloneDeep(automation)

    const finalise = (dest, idx, update) => {
      dest.splice(
        idx,
        insert ? 0 : update.length || 1,
        ...(Array.isArray(update) ? update : [update])
      )
    }

    let cache = null
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
    return getUserBindings().map(binding => {
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
  getPathBindings: id => {
    const block = get(selectedAutomation).blockRefs[id]
    const bindings = store.actions.getAvailableBindings(
      block,
      get(selectedAutomation).data
    )

    return bindings
  },
  /**
   * Takes the provided automation and traverses all possible paths.
   * References to all nodes/steps encountered on the way are stored
   * in state under 'blocks'. These references are used to store tree related
   * metadata like the tree path or whether the node is terminating.
   *
   * @param {Object} automation
   */
  traverse: (blockRefs, automation) => {
    let blocks = []
    if (!automation || !blockRefs) {
      return
    }
    if (automation.definition?.trigger) {
      blocks.push(automation.definition.trigger)
    }
    blocks = blocks.concat(automation.definition.steps || [])

    const treeTraverse = (block, pathTo, stepIdx, branchIdx, terminating) => {
      const pathToCurrentNode = [
        ...(pathTo || []),
        {
          ...(Number.isInteger(branchIdx) ? { branchIdx } : {}),
          stepIdx,
          id: block.id,
        },
      ]
      const branches = block.inputs?.branches || []

      branches.forEach((branch, bIdx) => {
        block.inputs?.children[branch.id].forEach((bBlock, sIdx, array) => {
          const ended =
            array.length - 1 === sIdx && !bBlock.inputs?.branches?.length
          treeTraverse(bBlock, pathToCurrentNode, sIdx, bIdx, ended)
        })
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

  /**
   * Build a list of all bindings specifically on the path
   * preceding the provided block.
   *
   * @param {Object} block step object
   * @param {Object} automation The complete automation
   * @returns
   */
  getAvailableBindings: (block, automation) => {
    if (!block || !automation?.definition) {
      return []
    }

    // Registered blocks
    const blocks = get(selectedAutomation).blockRefs

    // Get all preceeding steps, including the trigger
    // Filter out the target step as we don't want to include itself
    const pathSteps = store.actions
      .getPathSteps(block.pathTo, automation)
      .slice(0, -1)

    // Extract all outputs from all previous steps as available bindingsx§x
    let bindings = []

    const addBinding = (name, value, icon, idx, isLoopBlock, bindingName) => {
      if (!name) return
      const runtimeBinding = determineRuntimeBinding(
        name,
        idx,
        isLoopBlock,
        bindingName
      )
      const categoryName = determineCategoryName(idx, isLoopBlock, bindingName)
      bindings.push(
        createBindingObject(
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

    const determineRuntimeBinding = (name, idx, isLoopBlock) => {
      let runtimeName

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
      } else {
        runtimeName = `steps.${pathSteps[idx]?.id}.${name}`
      }
      return runtimeName
    }

    const determineCategoryName = (idx, isLoopBlock, bindingName) => {
      if (idx === 0) return "Trigger outputs"
      if (isLoopBlock) return "Loop Outputs"
      return bindingName
        ? `${bindingName} outputs`
        : `Step ${idx - loopBlockCount} outputs`
    }

    const createBindingObject = (
      name,
      value,
      icon,
      idx,
      loopBlockCount,
      isLoopBlock,
      runtimeBinding,
      categoryName,
      bindingName
    ) => {
      const field = Object.values(FIELDS).find(
        field => field.type === value.type && field.subtype === value.subtype
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
    }

    let loopBlockCount = 0

    for (let blockIdx = 0; blockIdx < pathSteps.length; blockIdx++) {
      const pathBlock = pathSteps[blockIdx]
      const bindingName =
        automation.definition.stepNames?.[pathBlock.id] || pathBlock.name

      let schema = cloneDeep(pathBlock?.schema?.outputs?.properties) ?? {}

      const isLoopBlock =
        pathBlock.stepId === ActionStepID.LOOP &&
        pathBlock.blockToLoop in blocks

      const isTrigger = pathBlock.type === AutomationStepType.TRIGGER

      // Add the loop schema
      // Should only be visible for blocks[pathBlock.id].looped
      // Only a once otherwise there will be 1 per loop block
      if (isLoopBlock && loopBlockCount == 0) {
        schema = {
          currentItem: {
            type: "string",
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
          let table = get(tables).list.find(
            table => table._id === pathBlock.inputs.tableId
          )
          // We want to generate our own schema for the bindings from the table schema itself
          for (const key in table?.schema) {
            schema[key] = {
              type: table.schema[key].type,
              subtype: table.schema[key].subtype,
            }
          }
          // remove the original binding
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
  create: async (name, trigger) => {
    const automation = {
      name,
      type: "automation",
      definition: {
        steps: [],
        trigger,
      },
      disabled: false,
    }
    const response = await store.actions.save(automation)
    return response
  },
  duplicate: async automation => {
    const response = await store.actions.save({
      ...automation,
      name: `${automation.name} - copy`,
      _id: undefined,
      _ref: undefined,
    })
    return response
  },
  save: async automation => {
    const response = await API.updateAutomation(automation)

    await store.actions.fetch()
    store.actions.select(response._id)
    return response.automation
  },
  delete: async automation => {
    const isRowAction = sdk.automations.isRowAction(automation)
    if (isRowAction) {
      await rowActions.delete(
        automation.definition.trigger.inputs.tableId,
        automation.definition.trigger.inputs.rowActionId
      )
    } else {
      await API.deleteAutomation({
        automationId: automation?._id,
        automationRev: automation?._rev,
      })
    }

    store.update(state => {
      // Remove the automation
      state.automations = state.automations.filter(
        x => x._id !== automation._id
      )

      // Select a new automation if required
      if (automation._id === state.selectedAutomationId) {
        state.selectedAutomationId = state.automations[0]?._id || null
      }

      return state
    })
  },
  toggleDisabled: async automationId => {
    let automation
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
        `Error ${
          automation && automation.disabled ? "disabling" : "enabling"
        } automation`
      )
    }
  },

  processBlockInputs: async (block, data) => {
    // Create new modified block
    let newBlock = {
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
    const automation = get(selectedAutomation).data
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
  updateBlockInputs: async (block, data) => {
    const newAutomation = await store.actions.processBlockInputs(block, data)
    if (newAutomation === false) {
      return
    }
    await store.actions.save(newAutomation)
  },
  test: async (automation, testData) => {
    let result
    try {
      result = await API.testAutomation({
        automationId: automation?._id,
        testData,
      })
    } catch (err) {
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
  getDefinition: id => {
    return get(store).automations?.find(x => x._id === id)
  },
  getUpdatedDefinition: (automation, block) => {
    let newAutomation
    if (automation.definition.trigger?.id === block.id) {
      newAutomation = cloneDeep(automation)
      newAutomation.definition.trigger = block
    } else {
      const pathToStep = get(selectedAutomation).blockRefs[block.id].pathTo
      newAutomation = automationStore.actions.updateStep(
        pathToStep,
        automation,
        block
      )
    }
    return newAutomation
  },
  select: id => {
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
  getLogs: async ({ automationId, startDate, status, page } = {}) => {
    return await API.getAutomationLogs({
      automationId,
      startDate,
      status,
      page,
    })
  },
  clearLogErrors: async ({ automationId, appId } = {}) => {
    return await API.clearAutomationLogErrors({
      automationId,
      appId,
    })
  },
  addTestDataToAutomation: async data => {
    let newAutomation = cloneDeep(get(selectedAutomation).data)
    newAutomation.testData = {
      ...newAutomation.testData,
      ...data,
    }
    await store.actions.save(newAutomation)
  },
  constructBlock(type, stepId, blockDefinition) {
    let newName
    const newStep = {
      ...blockDefinition,
      inputs: blockDefinition.inputs || {},
      stepId,
      type,
      id: generate(),
    }
    newName = getNewStepName(get(selectedAutomation)?.data, newStep)
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
    const branchDefinition = get(automationStore).blockDefinitions.ACTION.BRANCH
    const branchBlock = automationStore.actions.constructBlock(
      "ACTION",
      "BRANCH",
      branchDefinition
    )
    return branchBlock
  },

  /**
   * Take a newly constructed block and insert it in the automation tree
   * at the specified location.
   *
   * @param {Object} block the new block
   * @param {Array<Object>} pathWay location of insert point
   */
  addBlockToAutomation: async (block, pathWay) => {
    const automation = get(selectedAutomation).data
    let newAutomation = cloneDeep(automation)

    const steps = [
      newAutomation.definition.trigger,
      ...newAutomation.definition.steps,
    ]

    let cache
    pathWay.forEach((path, pathIdx, array) => {
      const { stepIdx, branchIdx } = path
      const final = pathIdx === array.length - 1

      const insertBlock = (steps, stepIdx) => {
        const isBranchNode = !Number.isInteger(stepIdx)

        // If it's a loop block, insert at the looped block stepIdx
        const insertIdx =
          block.blockToLoop || isBranchNode ? stepIdx : stepIdx + 1

        steps.splice(insertIdx, 0, block)
      }

      if (!cache) {
        if (final) {
          // Offset path to accommodate the trigger
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
      logicalOperator: "all",
      onEmptyFilter: "none",
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
  branchAutomation: async (path, automation) => {
    const insertPoint = path.at(-1)
    let newAutomation = cloneDeep(automation)
    let cache = null
    let atRoot = false

    // Generate a default empty branch
    const createBranch = name => {
      return {
        name: name,
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
      (acc, branch, idx) => {
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
  branchLeft: async (pathTo, automation, block) => {
    const update = store.actions.shiftBranch(pathTo, block)
    const updatedAuto = store.actions.updateStep(
      pathTo.slice(0, -1),
      automation,
      update
    )
    await store.actions.save(updatedAuto)
  },

  /**
   * Take a block and move the provided branch right
   *
   * @param {Array<Object>} pathTo
   * @param {Object} automation
   * @param {Object} block
   */
  branchRight: async (pathTo, automation, block) => {
    const update = store.actions.shiftBranch(pathTo, block, 1)
    const updatedAuto = store.actions.updateStep(
      pathTo.slice(0, -1),
      automation,
      update
    )
    await store.actions.save(updatedAuto)
  },

  /**
   * Shift swap a branch with its immediate neighbour.
   * @param {Array<Object>} pathTo - address of the branch to be moved.
   * @param {Object} block - the step the branch belongs to
   * @param {Number} direction - the direction of the swap. Defaults to -1 for left, add 1 for right
   * @returns
   */
  shiftBranch(pathTo, block, direction = -1) {
    let newBlock = cloneDeep(block)
    const branchPath = pathTo.at(-1)
    const targetIdx = branchPath.branchIdx

    if (!newBlock.inputs.branches[targetIdx + direction]) {
      console.error("Invalid index")
      return
    }

    let [neighbour] = newBlock.inputs.branches.splice(targetIdx + direction, 1)

    // Put it back in the previous position.
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
  deleteBranch: async (path, automation) => {
    let newAutomation = cloneDeep(automation)
    let cache = []

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

  saveAutomationName: async (blockId, name) => {
    const automation = get(selectedAutomation).data
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
  deleteAutomationName: async blockId => {
    const automation = get(selectedAutomation).data
    let newAutomation = cloneDeep(automation)
    if (!automation) {
      return
    }
    if (newAutomation.definition.stepNames) {
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
  deleteAutomationBlock: async pathTo => {
    const automation = get(selectedAutomation)?.data

    const { newAutomation } = store.actions.deleteBlock(pathTo, automation)

    try {
      await store.actions.save(newAutomation)
    } catch (e) {
      notifications.error("Error deleting automation block")
      console.error("Automation deleting block ", e)
    }
  },

  replace: async (automationId, automation) => {
    if (!automation) {
      store.update(state => {
        // Remove the automation
        state.automations = state.automations.filter(
          x => x._id !== automationId
        )
        // Select a new automation if required
        if (automationId === state.selectedAutomationId) {
          store.actions.select(state.automations[0]?._id)
        }
        return state
      })
    } else {
      const index = get(store).automations.findIndex(
        x => x._id === automation._id
      )
      if (index === -1) {
        // Automation addition
        store.update(state => ({
          ...state,
          automations: [...state.automations, automation],
        }))
      } else {
        // Automation update
        store.update(state => {
          state.automations[index] = automation
          return state
        })
      }
    }
  },
})

const automations = createAutomationStore()

export const automationStore = automations.store

export const automationHistoryStore = automations.history

// Derived automation state
export const selectedAutomation = derived(automationStore, $automationStore => {
  if (!$automationStore.selectedAutomationId) {
    return null
  }

  const selected = $automationStore.automations?.find(
    x => x._id === $automationStore.selectedAutomationId
  )

  // Traverse the entire tree and record all nodes found
  // Also store any info relevant to the UX
  const blockRefs = {}
  automationStore.actions.traverse(blockRefs, selected)

  // Parse the steps for references to sequential binding
  // Replace all bindings with id based alternatives
  const updatedAuto = cloneDeep(selected)
  Object.values(blockRefs)
    .filter(blockRef => {
      // Pulls out all distinct terminating nodes
      return blockRef.terminating
    })
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

  return {
    data: updatedAuto,
    blockRefs,
  }
})
