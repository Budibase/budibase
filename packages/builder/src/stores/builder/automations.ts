import { API } from "@/api"
import { TableNames } from "@/constants"
import { FIELDS as COLUMNS } from "@/constants/backend"
import { ActionStepID, TriggerStepID } from "@/constants/backend/automations"
import {
  getEnvironmentBindings,
  getSchemaForDatasourcePlus,
  getSettingBindings,
  getUserBindings,
  migrateReferencesInObject,
} from "@/dataBinding"
import { getNewStepName } from "@/helpers/automations/nameHelpers"
import { getSequentialName } from "@/helpers/duplicate"
import { isEnabled } from "@/helpers/featureFlags"
import { DerivedBudiStore } from "@/stores/BudiStore"
import {
  appStore,
  deploymentStore,
  permissions,
  tables,
  workspaceDeploymentStore,
} from "@/stores/builder"
import { createHistoryStore, HistoryStore } from "@/stores/builder/history"
import { environment, licensing, organisation } from "@/stores/portal"
import {
  AutomationStoreState,
  DataMode,
  DerivedAutomationStoreState,
  FilterableRowTriggers,
  RowTriggers,
  SelectedAutomationState,
  ViewMode,
  type FormUpdate,
  type StepInputs,
} from "@/types/automations"
import { notifications } from "@budibase/bbui"
import { QueryUtils, Utils } from "@budibase/frontend-core"
import { sdk } from "@budibase/shared-core"
import { makePropSafe } from "@budibase/string-templates"
import {
  Automation,
  AutomationActionStepId,
  AutomationCustomIOType,
  AutomationEventType,
  AutomationIOProps,
  AutomationIOType,
  AutomationResults,
  AutomationStatus,
  AutomationStep,
  AutomationStepResult,
  AutomationStepInputs,
  AutomationStepType,
  AutomationTrigger,
  AutomationTriggerInputs,
  AutomationTriggerResult,
  AutomationTriggerResultOutputs,
  AutomationTriggerStepId,
  BlockDefinitions,
  BlockDefinitionTypes,
  BlockPath,
  Branch,
  BranchStep,
  EmptyFilterOption,
  EnrichedBinding,
  FeatureFlag,
  GetAutomationActionDefinitionsResponse,
  GetAutomationTriggerDefinitionsResponse,
  isActionStep,
  isAppTrigger,
  isAutomationResults,
  isBranchStep,
  isDidNotTriggerResponse,
  isRowActionTrigger,
  isRowSaveTrigger,
  isRowUpdateTrigger,
  isTrigger,
  isWebhookTrigger,
  PermissionLevel,
  PublishResourceState,
  RowActionTrigger,
  RowActionTriggerInputs,
  RowActionTriggerOutputs,
  SelfResponse,
  Table,
  TestAutomationResponse,
  UIAutomation,
  UILogicalOperator,
  WebhookTriggerOutputs,
  AutomationLog,
  BlockRef,
  isLoopV2Step,
} from "@budibase/types"
import { cloneDeep } from "lodash/fp"
import { generate } from "shortid"
import { derived, get, readable, Readable } from "svelte/store"
import { EnvVar } from "../portal/environment"
import { rowActions } from "./rowActions"

const initialAutomationState: AutomationStoreState = {
  automations: [],
  showTestModal: false,
  blockDefinitions: {
    TRIGGER: {},
    CREATABLE_TRIGGER: {},
    ACTION: {},
  },
  selectedAutomationId: null,
  viewMode: ViewMode.EDITOR,
}

const getFinalDefinitions = (
  triggers: GetAutomationTriggerDefinitionsResponse,
  actions: GetAutomationActionDefinitionsResponse
): BlockDefinitions => {
  const creatable: Partial<GetAutomationTriggerDefinitionsResponse> = {}
  const emailTriggerEnabled = isEnabled(FeatureFlag.EMAIL_TRIGGER)
  for (const [key, trigger] of Object.entries(triggers)) {
    if (key === AutomationTriggerStepId.ROW_ACTION) {
      continue
    }
    if (trigger.deprecated === true) {
      continue
    }
    if (key === AutomationTriggerStepId.EMAIL && !emailTriggerEnabled) {
      continue
    }
    creatable[key as keyof GetAutomationTriggerDefinitionsResponse] = trigger
  }
  return {
    TRIGGER: triggers,
    CREATABLE_TRIGGER: creatable,
    ACTION: actions,
  }
}

const automationActions = (store: AutomationStore) => ({
  setViewMode: (mode: ViewMode) => {
    store.update(state => ({
      ...state,
      viewMode: mode,
    }))
  },
  /**
   * @param {Automation} auto
   * @param {BlockRef} blockRef
   * @returns
   */
  getBlockByRef: (
    auto?: Automation,
    blockRef?: BlockRef
  ): AutomationStep | AutomationTrigger | undefined => {
    if (!blockRef || !auto) {
      return
    }

    const target = automationStore.actions
      .getPathSteps(blockRef.pathTo, auto)
      .at(-1)

    return target
  },

  /**
   * Build and retrieve the block input properties from a Trigger/Step
   * @param {AutomationStep | AutomationTrigger} block
   * @returns
   */
  getInputData: (block?: AutomationStep | AutomationTrigger): StepInputs => {
    if (!block) {
      console.error("Block required to generate step input data")
      return
    }
    let newInputData

    if (isTrigger(block)) {
      const triggerInputs: AutomationTriggerInputs<typeof block.stepId> =
        block.inputs
      newInputData = cloneDeep(triggerInputs)
    } else if (isActionStep(block)) {
      const blockInputs: AutomationStepInputs<typeof block.stepId> =
        block.inputs
      newInputData = cloneDeep(blockInputs)
    }

    store.actions.setDefaultEnumValues(
      newInputData,
      block.schema?.inputs?.properties
    )

    return newInputData
  },

  /**
   * Parses through the provided prop schema updates any enum
   * values with the first option if no value is currently set.
   *
   * @param inputData
   */
  setDefaultEnumValues: (
    inputData:
      | AutomationStepInputs<AutomationActionStepId>
      | AutomationTriggerInputs<AutomationTriggerStepId>,
    inputPropSchema: AutomationIOProps
  ) => {
    // In order to alter enum fields you must make the inputData indexable
    const idxInput = inputData as Record<string, unknown>

    const schemaProperties = Object.entries(inputPropSchema)

    for (const [key, value] of schemaProperties) {
      if (
        value.type === AutomationIOType.STRING &&
        value.enum &&
        !idxInput[key]
      ) {
        idxInput[key] = value.enum[0]
      }
    }
  },

  /**
   * Fetches the app user context used for live evaluation
   * This matches the context used on the server. Only expose
   * valid schema values used in bindings
   * @returns {SelfResponse | null}
   */
  initAppSelf: async (): Promise<SelfResponse | null> => {
    // Fetch and update the app self if it hasn't been set
    const appSelfResponse: SelfResponse | null = await API.fetchSelf()

    if (!appSelfResponse) {
      return appSelfResponse
    }
    const { schema }: { schema: Record<string, any> } =
      getSchemaForDatasourcePlus(TableNames.USERS, null)

    const keys = [...Object.keys(schema), "globalId"] as Array<
      keyof SelfResponse
    >

    // Reduce the fields to include the same elements as seen in the bindings
    const serverUser = keys.reduce<Partial<SelfResponse>>((acc, key) => {
      if (key in appSelfResponse) {
        acc[key] = appSelfResponse[key]
      }
      return acc
    }, {})

    store.update(state => ({
      ...state,
      appSelf: serverUser,
    }))

    return serverUser
  },
  /**
   * Move a given block from one location on the tree to another.
   *
   * @param {Object} sourcePath path to the block to be moved
   * @param {Object} destPath the destinationPart
   * @param {Object} automation the automaton to be mutated
   */
  moveBlock: async (
    sourcePath: BlockPath[],
    destPath: BlockPath[],
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

    let finalPath: BlockPath[] = []
    let offsetStepIdx = true
    // If dropping in a branch-step dropzone you need to find
    // the updated parent step route then add the branch details again
    if (pathEnd?.branchStepId && !pathEnd?.id) {
      const branchStepRef = newRefs[pathEnd.branchStepId]
      if (!branchStepRef?.pathTo) {
        return
      }

      const branchStep = store.actions.getBlockByRef(
        newAutomation,
        branchStepRef
      )

      let insertIdx = 0
      const branchIdx = pathEnd.branchIdx
      if (
        Number.isInteger(branchIdx) &&
        branchStep &&
        isBranchStep(branchStep)
      ) {
        const branchDef = branchStep.inputs?.branches?.[branchIdx]
        const branchId = branchDef?.id
        const children = branchId
          ? branchStep.inputs?.children?.[branchId] || []
          : []
        if (typeof pathEnd.stepIdx === "number") {
          if (pathEnd.stepIdx < 0) {
            insertIdx = 0
          } else {
            insertIdx = Math.min(pathEnd.stepIdx + 1, children.length)
          }
        } else {
          insertIdx = children.length
        }
      }

      finalPath = cloneDeep(branchStepRef.pathTo)
      finalPath.push({
        branchIdx: pathEnd.branchIdx,
        branchStepId: pathEnd.branchStepId,
        stepIdx: insertIdx,
      } as any)
      offsetStepIdx = false
    } else {
      // Place the target 1 after the drop
      if (pathEnd?.id) {
        const targetRef = newRefs[pathEnd.id]
        finalPath = cloneDeep(targetRef.pathTo)
      } else if (destPath?.length) {
        finalPath = cloneDeep(destPath)
      }
    }

    if (offsetStepIdx) {
      const lastHop = finalPath.at(-1)
      if (!lastHop) return
      lastHop.stepIdx += 1
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
  deleteBlock: (pathTo: Array<BlockPath>, automation: Automation) => {
    let newAutomation = cloneDeep(automation)

    const steps = [
      newAutomation.definition.trigger,
      ...newAutomation.definition.steps,
    ]

    let cache: any
    pathTo.forEach((path, pathIdx, array) => {
      const final = pathIdx === array.length - 1
      const { stepIdx, branchIdx, loopStepId } = path

      const deleteCore = (
        steps: AutomationStep[],
        idx: number,
        extraIds?: string[]
      ) => {
        const targetBlock = steps[idx]
        // By default, include the id of the target block
        const idsToDelete = [targetBlock.id]
        // Include any caller-specified extra ids to delete atomically
        if (Array.isArray(extraIds) && extraIds.length) {
          idsToDelete.push(...extraIds)
        }
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
        return
      }

      if (loopStepId) {
        const children = (cache.inputs.children || []) as AutomationStep[]
        const currentBlock = children[stepIdx]

        if (final) {
          cache = deleteCore(children, stepIdx)
        } else {
          cache = currentBlock
        }
        return
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
    pathTo: Array<BlockPath>,
    terminating: boolean
  ) => {
    blocks[block.id] = {
      stepId: block.stepId,
      name: block.name,
      ...(blocks[block.id] || {}),
      pathTo,
      terminating: terminating || false,
      ...(block.blockToLoop ? { blockToLoop: block.blockToLoop } : {}),
    }

    if (block.stepId === AutomationActionStepId.EXTRACT_STATE) {
      blocks[block.id].inputs = { ...block.inputs }
    }

    // If this is a loop block, add a reference to the block being looped
    if (block.blockToLoop) {
      blocks[block.blockToLoop] = {
        ...(blocks[block.blockToLoop] || {}),
        looped: block.id,
      }
    }

    // Loop V2 child flag so the UI can restrict actions
    const lastHop: any = pathTo?.at(-1)
    if (lastHop && lastHop.loopStepId) {
      blocks[block.id] = {
        ...blocks[block.id],
        isLoopV2Child: true,
      }
    }
  },

  /**
   * Build a sequential list of all steps on the step path provided
   *
   * @param {Array<Object>} pathWay e.g. [{stepIdx:2},{branchIdx:0, stepIdx:2},...]
   * @returns {Array<AutomationStep | AutomationTrigger>} all steps encountered on the provided path
   */
  getPathSteps: (
    pathWay: Array<BlockPath>,
    automation: Automation
  ): Array<AutomationStep | AutomationTrigger> => {
    // Base Steps, including trigger
    const steps = [
      automation.definition.trigger,
      ...automation.definition.steps,
    ]

    let result: (AutomationStep | AutomationTrigger)[] = []
    pathWay.forEach(path => {
      const { stepIdx, branchIdx, loopStepId } = path
      let last: AutomationStep | AutomationTrigger | undefined = result.length
        ? result[result.length - 1]
        : undefined
      if (!result.length) {
        // Preceeding steps.
        result = steps.slice(0, stepIdx + 1)
        return
      }

      if (Number.isInteger(branchIdx)) {
        const branch = last as BranchStep
        const branchId = branch.inputs?.branches[branchIdx].id
        const children = branch.inputs?.children?.[branchId] ?? []

        const stepChildren = children.slice(0, stepIdx + 1)
        result = result.concat(stepChildren)
        return
      }

      // Handle Loop V2 child traversal
      if (loopStepId && last) {
        const candidate =
          last.id === loopStepId ? last : result.find(b => b.id === loopStepId)

        if (!candidate || !isLoopV2Step(candidate)) {
          return
        }

        const children = candidate.inputs.children ?? []
        const stepChildren = children.slice(0, stepIdx + 1)
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
  updateStep: (
    pathWay: Array<BlockPath>,
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
      const { stepIdx, branchIdx, loopStepId } = path
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
        return
      }

      // Handle Loop V2 children inside a subflow
      if (loopStepId) {
        const children = (cache.inputs.children || []) as AutomationStep[]
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
   * @returns { Array<EnrichedBinding>} all available settings bindings
   */
  buildSettingBindings: (): Array<EnrichedBinding> => {
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
   * @param {Automation} automation the automation to be searched
   * @returns {Array<EnrichedBinding>} all bindings on the path to this step
   */
  getPathBindings: (
    id?: string,
    automation?: Automation
  ): Array<EnrichedBinding> => {
    if (!automation || !id) {
      console.error("getPathBindings: requires a valid step id and automation")
      return []
    }
    const block = get(selectedAutomation)?.blockRefs[id]

    return store.actions.getAvailableBindings(block, automation)
  },

  buildStateBindings: (): Array<EnrichedBinding> => {
    const blockRefs = get(selectedAutomation)?.blockRefs || {}
    const selectedNodeId = get(automationStore).selectedNodeId

    const cache = new Set<string>()
    return Object.entries(blockRefs)
      .filter(([id, entry]: [string, any]) => {
        const valid =
          entry.stepId === AutomationActionStepId.EXTRACT_STATE &&
          entry?.inputs?.key &&
          (id !== selectedNodeId || entry.looped || entry.isLoopV2Child) &&
          !cache.has(entry.inputs.key)

        // Multiple blocks can reference the same state fields.
        // Check the cached ids before adding to avoid dupe bindings
        if (valid) cache.add(entry.inputs.key)
        return valid
      })
      .map(([_, entry]: [string, any]) => {
        return {
          runtimeBinding: `state.${makePropSafe(entry.inputs.key)}`,
          readableBinding: `State.${entry.inputs.key}`,
          display: {
            name: `State.${entry.inputs.key}`,
          },
          category: "State",
          icon: "brackets-curly",
        } as EnrichedBinding
      })
  },

  /**
   * Takes the provided automation and traverses all possible paths.
   * References to all nodes/steps encountered on the way are stored
   * in state under 'blocks'. These references are used to store tree related
   * metadata like the tree path or whether the node is terminating.
   *
   * @param {Object} automation
   */
  traverse: (blockRefs: Record<string, BlockRef>, automation: Automation) => {
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
      terminating: boolean,
      loopContext?: string
    ) => {
      const pathToCurrentNode = [
        ...(pathTo || []),
        {
          ...(Number.isInteger(branchIdx) ? { branchIdx } : {}),
          ...(loopContext ? { loopStepId: loopContext } : {}),
          stepIdx,
          id: block.id,
        },
      ]

      if (isBranchStep(block)) {
        const branches = block.inputs?.branches || []
        const children = block.inputs?.children || {}

        branches.forEach((branch, bIdx) => {
          children[branch.id]?.forEach(
            (bBlock: AutomationStep, sIdx: number, array: AutomationStep[]) => {
              const ended = array.length - 1 === sIdx
              treeTraverse(
                bBlock,
                pathToCurrentNode,
                sIdx,
                bIdx,
                ended,
                loopContext
              )
            }
          )
        })

        terminating = terminating && !branches.length
      }

      // Traverse children of Loop V2 subflow
      if (block.stepId === AutomationActionStepId.LOOP_V2) {
        const children: AutomationStep[] = block.inputs?.children || []
        children.forEach((child, cIdx) => {
          const isChildTerminating = cIdx === children.length - 1
          // For the child we continue with the current path, injecting loop context
          treeTraverse(
            child,
            pathToCurrentNode,
            cIdx,
            null,
            isChildTerminating,
            block.id
          )
        })
      }

      store.actions.registerBlock(
        blockRefs,
        block,
        pathToCurrentNode,
        terminating
      )
    }

    // Traverse the entire tree.
    blocks.forEach((block, idx, array) => {
      treeTraverse(block, null, idx, null, array.length - 1 === idx, undefined)
    })
    return blockRefs
  },

  getAvailableBindings: (
    block: any,
    automation: Automation
  ): EnrichedBinding[] => {
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
      schema: any,
      icon: string,
      idx: number,
      isLoopBlock: boolean,
      pathBlock: AutomationStep | AutomationTrigger,
      bindingName: string,
      opts?: { displayName?: string; readableChildName?: string }
    ) => {
      if (!name) return

      const runtimeBinding = store.actions.determineRuntimeBinding(
        name,
        idx,
        isLoopBlock,
        automation,
        currentBlock,
        pathSteps
      )

      // Skip binding if its invalid
      if (!runtimeBinding) {
        return
      }

      const readableBinding = store.actions.determineReadableBinding(
        name,
        pathBlock
      )

      const categoryName = store.actions.determineCategoryName(
        idx,
        isLoopBlock,
        bindingName,
        loopBlockCount
      )

      const isStep = !isLoopBlock && idx !== 0
      // Readable text shown to users. For loop outputs, use the loop's name.
      // For items drill-downs, prefer the child step name.
      let defaultReadable: string
      if (isLoopBlock) {
        // Keep currentItem readable when inside the loop
        if (name === "currentItem") {
          defaultReadable = "loop.currentItem"
        } else if (name?.startsWith?.("items.") && opts?.readableChildName) {
          defaultReadable = `steps.${bindingName}.items.${opts.readableChildName}`
        } else {
          defaultReadable = `steps.${bindingName}.${name}`
        }
      } else {
        defaultReadable =
          bindingName && isStep
            ? `steps.${bindingName}.${name}`
            : runtimeBinding
      }

      // Check if the schema matches any column types.
      const column = Object.values(COLUMNS).find(
        col =>
          col.type === schema.type &&
          ("subtype" in col ? col.subtype === schema.subtype : true)
      )

      // Automation types and column types can collide e.g. "array"
      // Exclude where necessary
      const ignoreColumnType = schema.customType === AutomationCustomIOType.ROWS

      // Shown in the bindable menus
      const displayType = ignoreColumnType ? schema.type : column?.name

      const displayName = opts?.displayName || name
      bindings.push({
        readableBinding: readableBinding || defaultReadable,
        runtimeBinding,
        type: schema.type,
        description: schema.description,
        icon,
        category: categoryName,
        display: {
          type: displayType,
          name: displayName,
          rank: isLoopBlock ? idx + 1 : idx - loopBlockCount,
        },
      })
    }

    let loopBlockCount = 0

    for (let blockIdx = 0; blockIdx < pathSteps.length; blockIdx++) {
      const pathBlock = pathSteps[blockIdx]
      let bindingName =
        automation.definition.stepNames?.[pathBlock.id] || pathBlock.name

      let schema = cloneDeep(pathBlock?.schema?.outputs?.properties) ?? {}
      // Treat both legacy LOOP and LOOP_V2 container as a loop block
      let isLoopBlock = false
      if (pathBlock.blockToLoop) {
        isLoopBlock =
          pathBlock.stepId === ActionStepID.LOOP &&
          pathBlock.blockToLoop in blocks
      }
      if (pathBlock.stepId === AutomationActionStepId.LOOP_V2) {
        isLoopBlock = true
      }

      // Only inject currentItem for steps INSIDE the loop
      // - legacy: when selected block is the looped step
      // - v2: when selected block is a child of the loop subflow
      if (isLoopBlock && loopBlockCount == 0) {
        const insideV2 = Boolean(block?.isLoopV2Child)
        const isLegacyLoop = pathBlock.stepId === ActionStepID.LOOP
        const shouldShowCurrentItem = isLegacyLoop || insideV2
        if (shouldShowCurrentItem) {
          schema = {
            currentItem: {
              type: AutomationIOType.STRING,
              description: "the item currently being executed",
            },
          }
        }
      }
      const icon = isTrigger(pathBlock)
        ? pathBlock.icon
        : isLoopBlock
          ? "Reuse"
          : pathBlock.icon

      if (blockIdx === 0 && isTrigger(pathBlock)) {
        if (isRowUpdateTrigger(pathBlock) || isRowSaveTrigger(pathBlock)) {
          const rowTrigger = pathBlock

          const inputs = rowTrigger.inputs as Exclude<
            AutomationTriggerInputs<typeof pathBlock.stepId>,
            void
          >
          let table: any = get(tables).list.find(
            (table: Table) => table._id === inputs.tableId
          )

          for (const key in table?.schema) {
            schema[key] = {
              type: table.schema[key].type,
              subtype: table.schema[key].subtype,
            }
          }
          delete schema.row
        } else if (isAppTrigger(pathBlock)) {
          const appActionTrigger = pathBlock
          const inputs = appActionTrigger.inputs as Exclude<
            AutomationTriggerInputs<typeof pathBlock.stepId>,
            void
          >
          schema = Object.fromEntries(
            Object.keys(inputs.fields || {}).map(key => [
              key,
              { type: inputs.fields?.[key] },
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

      // For Loop V2 blocks, when selecting a step AFTER the loop, expose
      // per-child drilldowns under items.
      const targetInsideLoopV2 = Boolean(block?.isLoopV2Child)
      if (
        pathBlock.stepId === AutomationActionStepId.LOOP_V2 &&
        !targetInsideLoopV2
      ) {
        const children: AutomationStep[] = pathBlock.inputs?.children || []
        for (const child of children) {
          const childName =
            automation.definition.stepNames?.[child.id] || child.name
          addBinding(
            `items.${child.id}`,
            {
              type: AutomationIOType.ARRAY,
              description: `Per-iteration results for ${childName}. Index into [i].outputs.<prop>.`,
            },
            icon,
            blockIdx,
            isLoopBlock,
            pathBlock,
            bindingName,
            {
              displayName: `Items › ${childName}`,
              readableChildName: childName,
            }
          )
        }
      }

      Object.entries(schema).forEach(([name, value]) => {
        addBinding(
          name,
          value,
          icon,
          blockIdx,
          isLoopBlock,
          pathBlock,
          bindingName
        )
      })
    }

    if (pathSteps.length > 0) {
      const previousStep = pathSteps[pathSteps.length - 1]
      const previousStepIndex = pathSteps.length - 1
      const previousSchema =
        cloneDeep(previousStep?.schema?.outputs?.properties) ?? {}

      const isCodeStep =
        previousStep.stepId === AutomationActionStepId.EXECUTE_SCRIPT ||
        previousStep.stepId === AutomationActionStepId.EXECUTE_SCRIPT_V2

      Object.entries(previousSchema).forEach(([name, value]) => {
        if (!name) return

        const runtimeBinding = store.actions.determineRuntimeBinding(
          name,
          previousStepIndex,
          false,
          automation,
          currentBlock,
          pathSteps
        )

        if (!runtimeBinding) return

        const previousRuntimeBinding = runtimeBinding
          .replace(new RegExp(`^steps\\.${previousStep.id}\\.`), "previous.")
          .replace(
            new RegExp(`^steps\\["${previousStep.id}"\\]\\.`),
            "previous."
          )

        bindings.push({
          readableBinding: `Previous step.${name}`,
          runtimeBinding: previousRuntimeBinding,
          type: value.type,
          description: value.description,
          icon: previousStep.icon || "brackets-square",
          category: "Previous step",
          display: {
            type: value.type,
            name: `previous.${name}`,
            rank: -1,
          },
        })
      })

      if (isCodeStep && previousSchema.value) {
        bindings.push({
          readableBinding: "Previous step.value",
          runtimeBinding: "previous.value",
          type: previousSchema.value.type,
          description: "The output value from the previous code step",
          icon: previousStep.icon || "code",
          category: "Previous step",
          display: {
            type: previousSchema.value.type,
            name: "previous.value",
            rank: -2,
          },
        })
      }
    }

    // Remove currentItem when not inside a loop, but keep loop outputs
    const insideLegacyLoop = Boolean(block?.looped)
    const insideLoopV2 = Boolean(block?.isLoopV2Child)
    if (!insideLegacyLoop && !insideLoopV2) {
      bindings = bindings.filter(
        x =>
          !(
            x.runtimeBinding?.startsWith?.("loop.currentItem") ||
            x.readableBinding?.startsWith?.("loop.currentItem")
          )
      )
    }

    // Remove loop items
    if (!insideLegacyLoop && !insideLoopV2) {
      bindings = bindings.filter(x => !x.readableBinding.includes("loop"))
    }
    return bindings
  },

  determineReadableBinding: (
    name: string,
    block: AutomationStep | AutomationTrigger
  ) => {
    const rowTriggers: string[] = [
      TriggerStepID.ROW_UPDATED,
      TriggerStepID.ROW_SAVED,
      TriggerStepID.ROW_DELETED,
      TriggerStepID.ROW_ACTION,
    ]

    const isTrigger = block.type === AutomationStepType.TRIGGER
    const isAppTrigger = block.stepId === AutomationTriggerStepId.APP
    const isRowTrigger = rowTriggers.includes(block.stepId)

    let readableBinding = ""
    if (isTrigger) {
      if (isAppTrigger) {
        readableBinding = `trigger.fields.${name}`
      } else if (isRowTrigger) {
        let noRowKeywordBindings = ["id", "revision", "oldRow"]
        readableBinding = noRowKeywordBindings.includes(name)
          ? `trigger.${name}`
          : `trigger.row.${name}`
      } else {
        readableBinding = `trigger.${name}`
      }
    }

    return readableBinding
  },

  determineRuntimeBinding: (
    name: string,
    idx: number,
    isLoopBlock: boolean,
    automation: Automation,
    currentBlock: AutomationStep | AutomationTrigger | undefined,
    pathSteps: (AutomationStep | AutomationTrigger)[]
  ) => {
    // Legacy support for EXECUTE_SCRIPT steps
    const isJSScript =
      currentBlock?.stepId === AutomationActionStepId.EXECUTE_SCRIPT

    /* Begin special cases for generating custom schemas based on triggers */
    if (
      idx === 0 &&
      automation.definition.trigger?.event === AutomationEventType.APP_TRIGGER
    ) {
      return isJSScript
        ? `trigger.fields["${name}"]`
        : `trigger.fields.[${name}]`
    }

    if (
      idx === 0 &&
      (automation.definition.trigger?.event ===
        AutomationEventType.ROW_UPDATE ||
        automation.definition.trigger?.event === AutomationEventType.ROW_SAVE)
    ) {
      let noRowKeywordBindings = ["id", "revision", "oldRow"]
      if (!noRowKeywordBindings.includes(name)) {
        return isJSScript ? `trigger.row["${name}"]` : `trigger.row.[${name}]`
      }
    }
    /* End special cases for generating custom schemas based on triggers */

    if (isLoopBlock) {
      if (name === "currentItem") {
        return "loop.currentItem"
      }

      // For legacy loops, outputs are stored under the looped child step id
      const loopStep = pathSteps[idx]
      const legacyLoopChildId = loopStep?.blockToLoop
      const stepId = legacyLoopChildId || loopStep?.id
      if (!stepId) {
        notifications.error("Error generating binding: Step ID not found.")
        return
      }
      return isJSScript
        ? `steps["${stepId}"].${name}`
        : `steps.${stepId}.${name}`
    }

    if (idx === 0) {
      return `trigger.[${name}]`
    }

    const stepId = pathSteps[idx]?.id
    if (!stepId) {
      notifications.error("Error generating binding: Step ID not found.")
      return
    }
    return isJSScript ? `steps["${stepId}"].${name}` : `steps.${stepId}.${name}`
  },

  determineCategoryName: (
    idx: number,
    isLoopBlock: boolean,
    bindingName: string | undefined,
    loopBlockCount: number
  ) => {
    if (idx === 0) return "Trigger outputs"
    if (isLoopBlock) return `${bindingName || "Loop"} outputs`
    return bindingName
      ? `${bindingName} outputs`
      : `Step ${idx - loopBlockCount} outputs`
  },

  processBlockInputs: async (
    block: AutomationStep | AutomationTrigger,
    data: FormUpdate
  ): Promise<Automation | undefined> => {
    // Create new modified block
    let newBlock: { inputs: any } & (AutomationStep | AutomationTrigger) = {
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
      console.error("Could not process input blocks. No selected automation")
      return
    }
    const newAutomation = store.actions.getUpdatedDefinition(
      automation,
      newBlock
    )

    // Don't save if no changes were made
    if (JSON.stringify(newAutomation) === JSON.stringify(automation)) {
      return
    }

    return newAutomation
  },

  updateBlockInputs: async (
    block: AutomationStep,
    data: Record<string, any>
  ) => {
    const newAutomation = await store.actions.processBlockInputs(block, data)
    if (!newAutomation) {
      return
    }
    await store.actions.save(newAutomation)
  },

  test: async (automation: Automation, testData: any) => {
    let result: TestAutomationResponse
    try {
      result = await API.testAutomation(automation._id!, testData)
    } catch (err: any) {
      const message = err.message || err.status || JSON.stringify(err)
      throw `Automation test failed - ${message}`
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

  constructBlock: (
    type: BlockDefinitionTypes,
    stepId: string,
    blockDefinition: any
  ) => {
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
    return store.actions.constructBlock(
      BlockDefinitionTypes.ACTION,
      "BRANCH",
      branchDefinition
    )
  },

  /**
   * Take a newly constructed block and insert it in the automation tree
   * at the specified location.
   *
   * @param {Object} block the new block
   * @param {Array<Object>} pathWay location of insert point
   */
  addBlockToAutomation: async (
    block: AutomationStep,
    pathWay: Array<BlockPath>
  ) => {
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
      | AutomationStep
      | AutomationTrigger
      | AutomationStep[]
      | undefined = undefined

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
      if (
        Number.isInteger(branchIdx) &&
        !Array.isArray(cache) &&
        isBranchStep(cache)
      ) {
        const branchId = cache.inputs.branches[branchIdx].id
        const children = cache.inputs.children?.[branchId] || []

        if (final) {
          insertBlock(children, stepIdx)
          cache = children
        } else {
          cache = children[stepIdx]
        }
        return
      }

      // Handle Loop V2 children inside a subflow
      if (
        !Array.isArray(cache) &&
        cache.stepId === AutomationActionStepId.LOOP_V2
      ) {
        const children = cache.inputs?.children || []
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
   * Append a new block inside a Loop V2 subflow's children array.
   *
   * Notes:
   * - `loopId` should be the id of the Loop V2 container. However in some
   *   cases callers may pass the id of a child that lives inside the loop.
   *   To make this resilient, we detect this and resolve the parent loop
   *   via the last hop's `loopStepId` from the child's `pathTo`.
   */
  addBlockToLoopChildren: async (
    loopId: string,
    block: AutomationStep,
    insertIndex?: number
  ): Promise<boolean> => {
    const automation = get(selectedAutomation)?.data
    if (!automation) return false

    const blockRefs = get(selectedAutomation)?.blockRefs || {}
    const originalRef = blockRefs[loopId]
    if (!originalRef) return false

    const resolveLoopRef = () => {
      let ref = originalRef
      let node = automationStore.actions.getBlockByRef(automation, ref)

      if (!node || node.stepId !== AutomationActionStepId.LOOP_V2) {
        const parentLoopId = originalRef.pathTo?.at(-1)?.loopStepId
        if (!parentLoopId) return null
        const parentRef = blockRefs[parentLoopId]
        if (!parentRef) return null
        ref = parentRef
        node = automationStore.actions.getBlockByRef(automation, ref)
      }

      if (!node || node.stepId !== AutomationActionStepId.LOOP_V2) {
        return null
      }
      return { ref }
    }

    const resolved = resolveLoopRef()
    if (!resolved) return false

    // Mutate a copy of the automation, update loop children and persist via updateStep
    const newAutomation = cloneDeep(automation)
    const editableLoopNode = automationStore.actions.getBlockByRef(
      newAutomation,
      resolved.ref
    ) as AutomationStep | undefined

    if (!editableLoopNode || !isLoopV2Step(editableLoopNode)) return false

    const children: AutomationStep[] = editableLoopNode.inputs?.children || []
    const targetIndex = Math.max(
      0,
      Math.min(
        typeof insertIndex === "number" ? insertIndex : children.length,
        children.length
      )
    )
    const updatedChildren = children.slice()
    updatedChildren.splice(targetIndex, 0, block)

    editableLoopNode.inputs = {
      ...(editableLoopNode.inputs || {}),
      children: updatedChildren,
    }

    try {
      const updated = automationStore.actions.updateStep(
        resolved.ref.pathTo,
        newAutomation,
        editableLoopNode
      )
      await store.actions.save(updated)
      return true
    } catch (_e) {
      notifications.error("Error adding subflow step")
      return false
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
  branchAutomation: async (path: Array<BlockPath>, automation: Automation) => {
    const insertPoint = path.at(-1)
    if (!insertPoint) {
      return
    }
    let newAutomation = cloneDeep(automation)

    // Build utilities
    const createBranch = (name: string): Branch => ({
      name,
      ...store.actions.generateDefaultConditions(),
      id: generate(),
    })

    // Traverse the path and resolve the array (container) that holds the
    // siblings of the insertion point, accounting for branches and Loop V2 subflows.
    let container: AutomationStep[] = newAutomation.definition.steps
    let current: AutomationStep | AutomationTrigger | undefined = undefined
    let atRoot = false

    path.forEach((hop: BlockPath, idx: number, path: BlockPath[]) => {
      const final = idx === path.length - 1
      const { stepIdx, branchIdx, loopStepId } = hop

      // First hop from the root
      if (idx === 0) {
        if (final) {
          // Insert at the root level (top-level chain after trigger)
          atRoot = true
          return
        }
        current = newAutomation.definition.steps[Math.max(stepIdx - 1, 0)]
        return
      }

      // Inside a branch lane
      if (Number.isInteger(branchIdx)) {
        if (current && isBranchStep(current)) {
          const branchId = current.inputs.branches[branchIdx].id
          const children = current.inputs.children?.[branchId] ?? []
          if (final) {
            container = children
          } else {
            current = children[stepIdx]
          }
          return
        }
      }

      // Inside a Loop V2 subflow
      if (loopStepId) {
        if (current && isLoopV2Step(current)) {
          const children = current.inputs.children ?? []
          if (final) {
            container = children
          } else {
            current = children[stepIdx]
          }
          return
        }
      }

      if (final) {
        container = newAutomation.definition.steps
      } else {
        current = newAutomation.definition.steps[Math.max(stepIdx - 1, 0)]
      }
    })

    // Compute the index relative to the resolved container
    const insertIdx = atRoot ? insertPoint.stepIdx - 1 : insertPoint.stepIdx

    // Case 1: user clicked above an existing Branch step — append a branch
    if (
      insertIdx >= 0 &&
      container[insertIdx]?.stepId === AutomationActionStepId.BRANCH
    ) {
      const branchNode = container[insertIdx] as BranchStep
      const branches = branchNode.inputs.branches
      const branchEntry = createBranch(`Branch ${branches.length + 1}`)
      branches.splice(branches.length, 0, branchEntry)
      branchNode.inputs.children = {
        ...(branchNode.inputs.children || {}),
        [branchEntry.id]: [],
      }
      try {
        await store.actions.save(newAutomation)
      } catch (e) {
        notifications.error("Error adding branch to automation")
        console.error("Error adding automation branch", e)
      }
      return
    }

    const newBranch = store.actions.generateBranchBlock()

    // Default branch node count is 2. Build 2 default entries
    newBranch.inputs.branches = Array.from({ length: 2 }).map((_, idx) =>
      createBranch(`Branch ${idx + 1}`)
    )

    // Init the branch children. Shift all steps following the new branch step
    // into the 0th branch.
    newBranch.inputs.children = newBranch.inputs.branches.reduce(
      (acc: Record<string, AutomationStep[]>, branch: Branch, idx: number) => {
        acc[branch.id] = idx === 0 ? container.slice(insertIdx + 1) : []
        return acc
      },
      {}
    )

    // Truncate container after the insertion point and push the new branch
    container.splice(insertIdx + 1)
    container.push(newBranch)

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
    block: BranchStep
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
    pathTo: Array<BlockPath>,
    automation: Automation,
    block: BranchStep
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
  shiftBranch: (pathTo: Array<any>, block: BranchStep, direction = -1) => {
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
    let cache: Array<{ node: any; context: AutomationStep[] }> = []

    path.forEach((path, pathIdx, array) => {
      const { stepIdx, branchIdx, loopStepId } = path
      const final = pathIdx === array.length - 1

      // Initialise traversal at root level (after trigger)
      if (!cache.length) {
        if (final) {
          return
        }
        const stepsWithTrigger = [
          newAutomation.definition.trigger,
          ...newAutomation.definition.steps,
        ]
        const rootNode = stepsWithTrigger[stepIdx]
        cache = [
          {
            node: rootNode,
            context: newAutomation.definition.steps,
          },
        ]
        return
      }

      const current = cache.at(-1)

      // Traverse into Loop V2 subflow children when present
      if (loopStepId) {
        let loopNode = current?.node
        if (!loopNode || loopNode.id !== loopStepId) {
          loopNode = current?.context?.find((n: any) => n?.id === loopStepId)
        }

        if (loopNode && isLoopV2Step(loopNode)) {
          const children = (loopNode.inputs?.children || []) as AutomationStep[]
          if (final) {
            cache.push({ node: children[stepIdx], context: children })
          } else {
            cache.push({ node: children[stepIdx], context: children })
          }
          return
        }
      }

      // Traverse into branch children
      if (Number.isInteger(branchIdx)) {
        const branchHost = current?.node
        const branches = branchHost?.inputs?.branches
        const childrenMap = branchHost?.inputs?.children

        const branchId = branches[branchIdx]?.id
        const children = childrenMap[branchId] as AutomationStep[]

        if (final) {
          // 2 is the minimum number of branches on a branch node
          const minBranches = branches.length === 2

          // Delete the target branch and its contents
          branchHost.inputs.branches.splice(branchIdx, 1)
          delete branchHost.inputs.children[branchId]

          if (minBranches) {
            const lastBranchId = branchHost.inputs.branches[0].id
            const lastBranchContent = branchHost.inputs.children[lastBranchId]

            // Take the remaining branch and push all children onto the context
            const parentContext: AutomationStep[] = current?.context
              ? current.context
              : newAutomation.definition.steps

            // Find and remove the branch host from its parent context
            const hostIndex = parentContext.findIndex(
              n => n.id === branchHost.id
            )
            if (hostIndex !== -1) {
              // Remove the branch node and splice in remaining content
              parentContext.splice(hostIndex, 1, ...lastBranchContent)
            }
          }

          return
        }

        cache.push({ node: children?.[stepIdx], context: children || [] })
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
  deleteAutomationBlock: async (pathTo: Array<BlockPath>) => {
    const automation = get(selectedAutomation)?.data
    if (!automation) {
      return
    }

    const lastHop: BlockPath | undefined = pathTo?.at(-1)
    const loopId: string | undefined = lastHop?.loopStepId
    const isInsideBranch = Number.isInteger(lastHop?.branchIdx)

    if (
      loopId != null &&
      typeof lastHop?.stepIdx === "number" &&
      !isInsideBranch
    ) {
      let newAutomation = cloneDeep(automation)
      try {
        const loopRef = get(selectedAutomation)?.blockRefs?.[loopId]
        const loopNode = store.actions.getBlockByRef(newAutomation, loopRef)

        if (loopNode && loopNode.stepId === AutomationActionStepId.LOOP_V2) {
          const children: AutomationStep[] = (
            loopNode.inputs?.children || []
          ).slice()

          children.splice(lastHop.stepIdx, 1)
          if (
            children[lastHop.stepIdx]?.stepId === AutomationActionStepId.BRANCH
          ) {
            children.splice(lastHop.stepIdx, 1)
          }

          loopNode.inputs = { ...(loopNode.inputs || {}), children }
          await store.actions.save(newAutomation)
          return
        }
      } catch (e) {
        console.error("Loop V2 cascade delete fallback", e)
      }
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
      disabled: true,
    }
    const response = await store.actions.save(automation)
    return response
  },

  duplicate: async (automation: Automation) => {
    const { automations } = get(store)
    const response = await store.actions.save({
      ...automation,
      name: getSequentialName(
        automations.map(x => x.name),
        automation.name
      ),
      _id: undefined,
      _rev: undefined,
      disabled: true,
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
      await deploymentStore.publishApp()
      notifications.success(
        `Automation ${
          automation.disabled ? "disabled" : "enabled"
        } successfully`
      )

      await workspaceDeploymentStore.fetch()
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
      delete state.testResults
      state.showTestModal = false
      delete state.selectedNodeId
      state.showLogsPanel = false
      state.showLogDetailsPanel = false
      delete state.selectedLog
      delete state.selectedLogStepData
      return state
    })
  },

  getDefinition: (id: string): Automation | undefined => {
    return get(store.store).automations?.find(x => x._id === id)
  },

  getBlockDefinition: (block?: AutomationStep | AutomationTrigger) => {
    if (!block) {
      return
    }
    const isTrigger = block?.type === AutomationStepType.TRIGGER
    const definitionType = isTrigger
      ? BlockDefinitionTypes.TRIGGER
      : BlockDefinitionTypes.ACTION
    const definitions = get(store).blockDefinitions[definitionType]
    if (isTrigger) {
      const triggerDefs =
        definitions as Partial<GetAutomationTriggerDefinitionsResponse>
      return triggerDefs[block.stepId as AutomationTriggerStepId]
    }

    const stepDefs =
      definitions as Partial<GetAutomationActionDefinitionsResponse>
    return stepDefs[block.stepId as AutomationActionStepId]
  },

  /**
   * Determine if the trigger block type is a row trigger type
   * that supports oldRow/row
   * @param trigger
   * @returns {boolean}
   */
  isRowTrigger: (
    block?: AutomationTrigger | AutomationStep | undefined
  ): boolean => {
    if (!block || block.type !== AutomationStepType.TRIGGER) {
      return false
    }
    const stepId = block.stepId as AutomationTriggerStepId

    return RowTriggers.includes(stepId)
  },

  /**
   * Determine if the block is a row step type
   * The determines if something has a row/oldrow ux
   */
  isRowStep: (
    block?: AutomationTrigger | AutomationStep | undefined
  ): boolean => {
    if (!block || block.type !== AutomationStepType.ACTION) {
      return false
    }
    const stepId = block.stepId as AutomationActionStepId
    const rowSteps = [
      AutomationActionStepId.UPDATE_ROW,
      AutomationActionStepId.CREATE_ROW,
    ]
    return rowSteps.includes(stepId)
  },

  /**
   * Handler for row trigger automation updates.
   * @param {object} update - An automation block.inputs update object
   * @param {string} [update.tableId] - The ID of the table
   * @param {object} [update.filters] - Filter configuration for the row trigger
   * @param {object} [update.filters-def] - Filter definitions for the row trigger
   * @example
   * // Example with tableId
   * onRowTriggerUpdate({
   *   "tableId" : "ta_bb_employee"
   * })
   * @example
   * // Example with filters
   * onRowTriggerUpdate({
   *   filters: {
   *     equal: { "1:Approved": "true" }
   *   },
   *   "filters-def": [{
   *     id: "oH1T4S49n",
   *     field: "1:Approved",
   *     operator: "equal",
   *     value: "true",
   *     valueType: "Value",
   *     type: "string"
   *   }]
   * })
   */
  onRowTriggerUpdate: async (update: FormUpdate, block: AutomationTrigger) => {
    if (
      ["tableId", AutomationCustomIOType.FILTERS, "meta"].some(key =>
        Object.hasOwn(update, key)
      )
    ) {
      try {
        const automation = get(selectedAutomation)?.data

        if (!automation) {
          console.error("No automation for update")
          return
        }

        let updatedAutomation: Automation | undefined

        if (
          Object.hasOwn(update, "tableId") &&
          automation.testData?.row?.tableId !== update.tableId
        ) {
          const reqSchema = getSchemaForDatasourcePlus(update.tableId, {
            searchableSchema: true,
          }).schema

          updatedAutomation = await automationStore.actions.processBlockInputs(
            block,
            {
              schema: reqSchema,
              ...update,
            }
          )

          const refeshedTestData: AutomationTriggerResultOutputs = {
            row: { tableId: update.tableId },
            oldRow: { tableId: update.tableId },
            meta: {},
            id: "",
            revision: "",
          }

          // Reset testData when tableId changes
          updatedAutomation = updatedAutomation
            ? {
                ...updatedAutomation,
                testData: refeshedTestData,
              }
            : undefined
        } else {
          // For filters update, just process block inputs without resetting testData
          updatedAutomation = await automationStore.actions.processBlockInputs(
            block,
            update
          )
        }

        if (updatedAutomation) {
          await automationStore.actions.save(updatedAutomation)
        }
      } catch (e) {
        console.error("Error saving automation", e)
        notifications.error("Error saving automation")
      }
    }
  },

  onAppTriggerUpdate: async (update: FormUpdate, block: AutomationTrigger) => {
    try {
      // Parse the block inputs as usual
      const updatedAutomation =
        await automationStore.actions.processBlockInputs(block, {
          schema: {},
          ...update,
        })

      if (!updatedAutomation) {
        return
      }
      // Exclude default or invalid data from the test data
      let updatedFields: Record<string, any> = {}
      const inputs: Record<string, any> | void = block?.inputs
      const fieldsRequest = update.fields as Record<string, unknown>

      for (const key of Object.keys(inputs?.fields || {})) {
        if (Object.hasOwn(fieldsRequest, key)) {
          if (key !== "") {
            updatedFields[key] = updatedAutomation.testData?.fields?.[key]
          }
        }
      }

      // Save the entire automation and reset the testData
      await automationStore.actions.save({
        ...updatedAutomation,
        testData: {
          fields: updatedFields,
        },
      })
    } catch (e) {
      console.error("Error saving automation", e)
      notifications.error("Error saving automation")
    }
  },

  // Step Update Update
  requestUpdate: Utils.sequential(
    async (update: FormUpdate, block: AutomationTrigger | AutomationStep) => {
      if (!block || !update) {
        console.error("Invalid update. Block and update body required")
        return
      }

      const request = cloneDeep(update)

      const rowSteps = [
        AutomationTriggerStepId.ROW_DELETED,
        AutomationTriggerStepId.ROW_SAVED,
        AutomationTriggerStepId.ROW_UPDATED,
      ]

      // Process app trigger updates
      if (isTrigger(block)) {
        // Row trigger
        if (rowSteps.includes(block.stepId!)) {
          await store.actions.onRowTriggerUpdate(request, block)
          return
        }
        // App trigger
        if (block.stepId === AutomationTriggerStepId.APP) {
          await store.actions.onAppTriggerUpdate(request, block)
          return
        }
      }

      // We need to cache the schema as part of the definition because it is
      // used in the server to detect relationships. It would be far better to
      // instead fetch the schema in the backend at runtime.
      // If _tableId is explicitly included in the update request, the schema will be requested
      let schema: Record<any, any> = {}
      if (request?._tableId) {
        schema = getSchemaForDatasourcePlus(request._tableId, {
          searchableSchema: true,
        }).schema
        delete request._tableId
      }
      try {
        const data = { schema, ...request }
        const stepBlock = block as AutomationStep
        await automationStore.actions.updateBlockInputs(stepBlock, data)
      } catch (error) {
        console.error("Error saving automation", error)
        notifications.error("Error saving automation")
      }
    }
  ),

  save: async (automation: Automation) => {
    const response = await API.updateAutomation(automation)

    // Mark automation as having unpublished changes
    if (response.automation._id) {
      workspaceDeploymentStore.setAutomationUnpublishedChanges(
        response.automation._id
      )
    }

    store.actions.replace(response.automation._id!, response.automation)
    store.actions.select(response.automation._id!)
    return response.automation
  },

  delete: async (automation: Automation) => {
    const isRowAction = sdk.automations.isRowAction(automation)
    if (isRowAction) {
      const rowAction = automation.definition.trigger as RowActionTrigger
      const inputs = rowAction.inputs as AutomationTriggerInputs<
        typeof rowAction.stepId
      >

      await rowActions.delete(inputs.tableId, inputs.rowActionId)
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
    await deploymentStore.publishApp()
  },

  /**
   * Update or clear the name of the target block from
   * the selected automation.
   *
   * @param block
   * @param newName
   */
  updateBlockTitle: async (
    block: AutomationStep | AutomationTrigger,
    newName: string
  ) => {
    if (newName.trim().length === 0) {
      await automationStore.actions.deleteAutomationName(block.id)
    } else {
      await automationStore.actions.saveAutomationName(block.id, newName)
    }
  },

  /**
   * Update the resource role for the automation resource
   * @param role
   * @returns
   */
  setPermissions: async (role?: string, automation?: Automation) => {
    if (!role || !automation?._id) {
      return
    }
    await permissions.save({
      level: PermissionLevel.EXECUTE,
      role,
      resource: automation?._id,
    })
  },

  getPermissions: async (automationId?: string) => {
    if (!automationId) {
      return
    }
    const perms = await permissions.forResource(automationId)
    if (!perms[PermissionLevel.EXECUTE]) {
      return "BASIC"
    } else {
      return perms[PermissionLevel.EXECUTE].role
    }
  },

  processBlockResults: (
    testResults?: TestAutomationResponse,
    block?: AutomationStep | AutomationTrigger
  ) => {
    if (!testResults || !block) {
      return
    }

    // DidNotTriggerResponse result for a row step filter
    if (
      isTrigger(block) &&
      isDidNotTriggerResponse(testResults) &&
      FilterableRowTriggers.includes(block.stepId)
    ) {
      return testResults
    }

    // Process the step/trigger automation results as normal.
    const stepTestResults = testResults as AutomationResults
    return (stepTestResults?.steps || []).find(step =>
      block.id ? step.id === block.id : step.stepId === block.stepId
    )
  },

  /**
   * Remove the target loop block from the automation and save.
   * @param blockRef The target loop block
   * @returns
   */
  removeLooping: async (blockRef?: BlockRef) => {
    if (!blockRef) {
      return
    }
    const blockRefs = get(selectedAutomation)?.blockRefs || {}
    const automation = get(selectedAutomation)?.data

    // Legacy LOOP: referenced via `looped`
    if (blockRef.looped) {
      const loopBlockRef = blockRefs[blockRef.looped]
      if (loopBlockRef) {
        await automationStore.actions.deleteAutomationBlock(loopBlockRef.pathTo)
      }
      return
    }

    // Loop V2 unwrap: only when parent loop has exactly one child (the target)
    const lastHop: any = blockRef.pathTo?.at(-1)
    const parentLoopId: string | undefined = lastHop?.loopStepId
    if (!automation || !parentLoopId) {
      return
    }

    const loopRef = blockRefs[parentLoopId]
    if (!loopRef) {
      return
    }

    try {
      const loopNode = automationStore.actions.getBlockByRef(
        automation,
        loopRef
      )
      if (!loopNode || loopNode.stepId !== AutomationActionStepId.LOOP_V2) {
        console.error("Parent is not a Loop V2 node")
        return
      }

      const children = (loopNode.inputs?.children || []).slice()
      if (children.length !== 1) {
        notifications.info(
          "Stop Looping is only available when the loop contains a single step."
        )
        return
      }

      const updated = automationStore.actions.updateStep(
        loopRef.pathTo,
        automation,
        cloneDeep(children[0])
      )
      await automationStore.actions.save(updated)
      await automationStore.actions.selectNode(children[0].id)
    } catch (e) {
      notifications.error("Error removing loop from step")
      console.error("Error unwrapping from Loop V2", e)
    }
  },

  /**
   * Creates a brand new loop block using the blockRef id as the
   * blockToLoop value. The new loop block is then added to the automation and saved
   * @param blockRef The block to be looped
   * @returns
   */
  addLooping: async (blockRef?: BlockRef) => {
    if (!blockRef) {
      return
    }
    const loopDefinition = get(store).blockDefinitions.ACTION.LOOP
    const loopBlock = automationStore.actions.constructBlock(
      BlockDefinitionTypes.ACTION,
      AutomationActionStepId.LOOP,
      loopDefinition
    )
    const blockDest = blockRef.pathTo.at(-1)
    loopBlock.blockToLoop = blockDest!.id

    await automationStore.actions.addBlockToAutomation(
      loopBlock,
      blockRef.pathTo
    )
  },

  /**
   * Wrap the target step in a Loop V2 container and move the step into
   * the loop's children as the first child.
   * @param blockRef The step to wrap
   */
  wrapStepInLoopV2: async (blockRef?: BlockRef) => {
    if (!blockRef) {
      return
    }
    const automation = get(selectedAutomation)?.data
    if (!automation) {
      return
    }

    try {
      const pathSteps = automationStore.actions.getPathSteps(
        blockRef.pathTo,
        automation
      )
      const targetStep = pathSteps.at(-1)
      if (!targetStep || Array.isArray(targetStep)) {
        console.error("Invalid target step for Loop V2 wrap")
        return
      }

      const loopDefinition = get(store).blockDefinitions.ACTION.LOOP_V2
      const loopBlock = automationStore.actions.constructBlock(
        BlockDefinitionTypes.ACTION,
        AutomationActionStepId.LOOP_V2,
        loopDefinition
      )

      loopBlock.inputs = {
        ...(loopBlock.inputs || {}),
        children: [cloneDeep(targetStep)],
      }

      const updated = automationStore.actions.updateStep(
        blockRef.pathTo,
        automation,
        loopBlock
      )

      await automationStore.actions.save(updated)
      await automationStore.actions.selectNode(targetStep.id)
    } catch (e) {
      notifications.error("Error wrapping step in Loop")
      console.error("Error wrapping step in Loop V2", e)
    }
  },

  /**
   * Focus the automation canvas on one particular step in the
   * automation. Open the sidebar and set the data mode.
   * @param blockId
   * @param mode Defaults to DataMode.Input
   */
  selectNode: async (blockId?: string, mode?: DataMode) => {
    store.update(state => {
      return {
        ...state,
        selectedNodeId: blockId,
        selectedNodeMode: mode ?? DataMode.INPUT,
      }
    })
  },

  openActionPanel: (block: BlockRef) => {
    store.update(state => ({
      ...state,
      actionPanelBlock: block,
      selectedNodeId: undefined,
    }))
  },
  closeActionPanel: () => {
    store.update(state => ({
      ...state,
      actionPanelBlock: undefined,
    }))
  },

  openLogPanel: (
    log: AutomationLog,
    stepData: AutomationStepResult | AutomationTriggerResult
  ) => {
    store.update(state => ({
      ...state,
      showLogDetailsPanel: true,
      selectedLog: log,
      selectedLogStepData: stepData,
      selectedNodeId: undefined,
      actionPanelBlock: undefined,
    }))
  },

  closeLogPanel: () => {
    store.update(state => ({
      ...state,
      showLogDetailsPanel: false,
      selectedLog: undefined,
      selectedLogStepData: undefined,
    }))
  },

  openLogsPanel: () => {
    store.update(state => ({
      ...state,
      showLogsPanel: true,
      selectedNodeId: undefined,
      actionPanelBlock: undefined,
      showLogDetailsPanel: false,
    }))
  },

  closeLogsPanel: () => {
    store.update(state => ({
      ...state,
      showLogsPanel: false,
    }))
  },

  selectLogForDetails: (log: any) => {
    store.update(state => ({
      ...state,
      selectedLog: log,
      showLogDetailsPanel: false,
    }))
  },
})

export interface AutomationContext {
  state?: Record<string, any>
  user: SelfResponse | null
  trigger?: AutomationTriggerResultOutputs
  steps: Record<string, AutomationStep>
  env?: Record<string, any>
  settings: Record<string, any>
}

class SelectedAutomationStore extends DerivedBudiStore<
  AutomationStoreState,
  SelectedAutomationState
> {
  constructor(automationStore: AutomationStore) {
    const makeDerivedStore = () => {
      return derived(automationStore, ($store): SelectedAutomationState => {
        if (!$store.selectedAutomationId) {
          return {
            blockRefs: {},
            ...$store,
          }
        }

        const selected = $store.automations?.find(
          x => x._id === $store.selectedAutomationId
        )

        if (!selected) {
          return {
            blockRefs: {},
            ...$store,
          }
        }

        const blockRefs: Record<string, BlockRef> = {}
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

class AutomationStore extends DerivedBudiStore<
  AutomationStoreState,
  DerivedAutomationStoreState
> {
  history: HistoryStore<Automation>
  actions: ReturnType<typeof automationActions>
  selected: SelectedAutomationStore

  constructor() {
    const makeDerivedStore = (store: Readable<AutomationStoreState>) => {
      return derived(
        [store, workspaceDeploymentStore],
        ([$store, $workspaceDeploymentStore]): DerivedAutomationStoreState => {
          return {
            ...$store,
            automations: $store.automations.map<UIAutomation>(a => ({
              ...a,
              publishStatus: $workspaceDeploymentStore.automations[a._id!] || {
                state: PublishResourceState.DISABLED,
                unpublishedChanges: true,
              },
            })),
          }
        }
      )
    }

    super(initialAutomationState, makeDerivedStore)
    this.actions = automationActions(this)
    this.history = createHistoryStore({
      getDoc: this.actions.getDefinition.bind(this),
      selectDoc: this.actions.select.bind(this),
    })

    // Then wrap save and delete with history
    const originalSave = this.actions.save.bind(this.actions)
    const originalDelete = this.actions.delete.bind(this.actions)
    this.actions.save = this.history.wrapSaveDoc(originalSave)
    this.actions.delete = this.history.wrapDeleteDoc(originalDelete)

    this.selected = new SelectedAutomationStore(this)
  }
}

export const automationStore = new AutomationStore()

export const automationHistoryStore = automationStore.history
export const selectedAutomation = automationStore.selected

/**
 * Pad out a base default context for subscribers
 */
const emptyContext: AutomationContext = {
  user: {},
  steps: {},
  settings: {
    url: "",
    company: "",
    logo: "",
  },
}

/**
 * Extract and build automation trigger evaluation context
 *
 * @param automation
 * @param tables
 * @param results
 * @returns
 */
const extractTriggerContext = (
  automation: Automation,
  tables: Table[],
  results?: TestAutomationResponse
) => {
  const testData: AutomationTriggerResultOutputs | undefined =
    automation?.testData

  const triggerDef = automation?.definition?.trigger

  const triggerInputs = triggerDef
    ? (triggerDef.inputs as AutomationTriggerInputs<typeof triggerDef.stepId>)
    : undefined

  let triggerData: AutomationTriggerResultOutputs | undefined

  if (results && isAutomationResults(results)) {
    const automationTrigger: AutomationTriggerResult | undefined =
      results?.trigger

    const outputs: AutomationTriggerResultOutputs | undefined =
      automationTrigger?.outputs
    triggerData = outputs ? outputs : undefined

    if (triggerData && triggerDef) {
      if (isRowActionTrigger(triggerDef)) {
        const rowActionInputs: RowActionTriggerInputs =
          triggerInputs as RowActionTriggerInputs
        const rowActionTableId = rowActionInputs.tableId
        const rowActionTable = tables.find(
          table => table._id === rowActionTableId
        )

        const rowTriggerOutputs = triggerData as RowActionTriggerOutputs

        if (rowActionTable) {
          // Row action table must always be retrieved as it is never
          // returned in the test results
          rowTriggerOutputs.table = rowActionTable
        }
      } else if (isWebhookTrigger(triggerDef)) {
        const webhookTrigger = triggerData as WebhookTriggerOutputs
        // Ensure it displays in the event that the configuration was been skipped
        webhookTrigger.body = webhookTrigger.body ?? {}
      }
    }

    // Clean up unnecessary data from the context
    // Meta contains UI/UX config data. Non-bindable
    delete triggerData?.meta
  } else {
    // Substitute test data in place of the trigger data if the test hasn't been run
    triggerData = testData
  }

  return triggerData
}

/**
 * Build state context containing either stubs detailing where the
 * state context is set or it will reflected real test data
 *
 * @param results
 * @param blockRefs
 * @returns
 */
const extractStateContext = (
  results: TestAutomationResponse | undefined,
  blockRefs: Record<string, BlockRef>
) => {
  if (results && isAutomationResults(results) && results.state) {
    return results.state
  }
  const selectedNodeId = get(automationStore).selectedNodeId
  const auto = get(selectedAutomation).data
  const { stepNames } = auto?.definition || {}

  // Determine if any state vars set.
  const stateSteps = Object.entries(blockRefs).filter(
    ([id, entry]: [string, any]) => {
      return (
        entry.stepId === AutomationActionStepId.EXTRACT_STATE &&
        id !== selectedNodeId &&
        entry?.inputs?.key
      )
    }
  )

  if (!stateSteps.length) {
    return
  }

  const stubs = stateSteps.reduce(
    (acc: Record<string, any>, [id, entry]: [string, any]) => {
      if (!acc[entry.inputs.key]) {
        acc[entry.inputs.key] = {
          steps: [],
          description:
            "An updateable state variable. This will be replaced with a real value on test or at runtime",
        }
      }
      const displayName = stepNames?.[id] || entry.name
      // Show which state steps are modifying the variable
      acc[entry.inputs.key].steps.push(displayName)
      return acc
    },
    {}
  )

  return stubs
}

/**
 * Env vars require a license. In the event they are empty or unavailablethe
 * UI wont display an empty section in the context
 * @param variables
 * @returns
 */
const buildEnvironmentContext = (variables: EnvVar[]) => {
  return variables.length
    ? variables.reduce(
        (acc: Record<string, any>, variable: Record<string, any>) => {
          acc[variable.name] = ""
          return acc
        },
        {}
      )
    : undefined
}

/**
 * Build an automation evaluation context with a mixture of either
 * stub data or real automation test response data.
 */
const generateContext = () => {
  if (!organisation || !automationStore?.selected || !environment || !tables) {
    return readable(emptyContext)
  }
  return derived(
    [
      organisation,
      automationStore,
      automationStore.selected,
      environment,
      tables,
    ],
    ([
      $organisation,
      $automationStore,
      $selectedAutomation,
      $env,
      $tables,
    ]): AutomationContext => {
      const { platformUrl: url, company, logoUrl: logo } = $organisation

      const results = $automationStore.testResults

      let triggerData: AutomationTriggerResultOutputs | undefined =
        extractTriggerContext($selectedAutomation.data!, $tables.list)

      // AppSelf context required to mirror server user context
      const userContext = $automationStore.appSelf || {}

      // Extract step results from a valid response
      const stepResults =
        results && isAutomationResults(results) ? results?.steps : []

      // Result data from a completed test run
      // Initially contain info around
      const stepContext = stepResults.reduce(
        (acc: Record<string, any>, res: Record<string, any>) => {
          acc[res.id] = res.outputs
          return acc
        },
        {}
      )

      const envVars = buildEnvironmentContext($env.variables)
      const stateContext = extractStateContext(
        results,
        $selectedAutomation.blockRefs
      )

      return {
        ...(triggerData ? { trigger: { ...triggerData } } : {}),
        ...(stateContext ? { state: stateContext } : {}),
        ...(envVars ? { env: envVars } : {}),
        user: userContext,
        steps: stepContext,
        settings: { url, company, logo },
      }
    },
    emptyContext
  )
}

/**
 * Generates a derived store acting as an evaluation context
 * for bindings in automations
 *
 * @returns {Readable<AutomationContext>}
 */
export const evaluationContext: Readable<AutomationContext> = generateContext()
