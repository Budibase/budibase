import { writable, get, derived } from "svelte/store"
import { API } from "api"
import { cloneDeep } from "lodash/fp"
import { generate } from "shortid"
import { createHistoryStore } from "stores/builder/history"
import { environment, licensing } from "stores/portal"
import { notifications } from "@budibase/bbui"
import { updateReferencesInObject, getEnvironmentBindings } from "dataBinding"
import { AutomationTriggerStepId, AutomationEventType } from "@budibase/types"
import { FIELDS } from "constants/backend"
import {
  updateBindingsInSteps,
  getNewStepName,
} from "helpers/automations/nameHelpers"

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
  automationDisplayData: {},

  // registered on screen.
  // may not be the right store
  blocks: {},
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

const updateStepReferences = (steps, modifiedIndex, action) => {
  steps.forEach(step => {
    updateReferencesInObject({
      obj: step.inputs,
      modifiedIndex,
      action,
      label: "steps",
    })
  })
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
  // Should this be in the store?
  // or just a context item.
  registerBlock: (block, pathTo) => {
    // console.log("Register ", block)
    /*
      Traverse before even rendering
      Push all data into a core location i.e here

      Derived store?
      blocks:
        {
          [step.id]:{
            path: [{step:2, id: abc123 },{branch:0, step:1, id: xyz789}]
            bindings: []
            // byName
            // byStepIdx
          }
        }
    */
    store.update(state => {
      state.blocks = {
        ...state.blocks,
        [block.id]: {
          bindings: block.inputs.text,
        },
      }
      return state
    })
  },
  // build and store ONCE
  // make it derived?
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
  //TESTING retrieve all preceding
  getAvailableBindings: (block, automation) => {
    if (!block || !automation) {
      return []
    }

    // Find previous steps to the selected one
    let allSteps = [...automation.steps]

    if (automation.trigger) {
      allSteps = [automation.trigger, ...allSteps]
    }

    if (1 == 1) {
      return
    }
    let blockIdx = allSteps.findIndex(step => step.id === block.id)

    // Extract all outputs from all previous steps as available bindingsx§x
    let bindings = []
    let loopBlockCount = 0
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

    const determineRuntimeBinding = (name, idx, isLoopBlock, bindingName) => {
      let runtimeName

      /* Begin special cases for generating custom schemas based on triggers */
      if (
        idx === 0 &&
        automation.trigger?.event === AutomationEventType.APP_TRIGGER
      ) {
        return `trigger.fields.${name}`
      }

      if (
        idx === 0 &&
        (automation.trigger?.event === AutomationEventType.ROW_UPDATE ||
          automation.trigger?.event === AutomationEventType.ROW_SAVE)
      ) {
        let noRowKeywordBindings = ["id", "revision", "oldRow"]
        if (!noRowKeywordBindings.includes(name)) return `trigger.row.${name}`
      }
      /* End special cases for generating custom schemas based on triggers */

      let hasUserDefinedName = automation.stepNames?.[allSteps[idx]?.id]
      if (isLoopBlock) {
        runtimeName = `loop.${name}`
      } else if (block.name.startsWith("JS")) {
        runtimeName = hasUserDefinedName
          ? `stepsByName[${bindingName}].${name}`
          : `steps[${idx - loopBlockCount}].${name}`
      } else {
        runtimeName = hasUserDefinedName
          ? `stepsByName.${bindingName}.${name}`
          : `steps.${idx - loopBlockCount}.${name}`
      }
      return idx === 0 ? `trigger.${name}` : runtimeName
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
          bindingName && !isLoopBlock
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

    for (let idx = 0; idx < blockIdx; idx++) {
      let wasLoopBlock = allSteps[idx - 1]?.stepId === ActionStepID.LOOP
      let isLoopBlock =
        allSteps[idx]?.stepId === ActionStepID.LOOP &&
        allSteps.some(x => x.blockToLoop === block.id)
      let schema = cloneDeep(allSteps[idx]?.schema?.outputs?.properties) ?? {}
      if (allSteps[idx]?.name.includes("Looping")) {
        isLoopBlock = true
        loopBlockCount++
      }
      let bindingName =
        automation.stepNames?.[allSteps[idx].id] || allSteps[idx].name

      if (isLoopBlock) {
        schema = {
          currentItem: {
            type: "string",
            description: "the item currently being executed",
          },
        }
      }

      if (
        idx === 0 &&
        automation.trigger?.event === AutomationEventType.APP_TRIGGER
      ) {
        schema = Object.fromEntries(
          Object.keys(automation.trigger.inputs.fields || []).map(key => [
            key,
            { type: automation.trigger.inputs.fields[key] },
          ])
        )
      }
      if (
        (idx === 0 &&
          automation.trigger.event === AutomationEventType.ROW_UPDATE) ||
        (idx === 0 && automation.trigger.event === AutomationEventType.ROW_SAVE)
      ) {
        let table = $tables.list.find(
          table => table._id === automation.trigger.inputs.tableId
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
      }
      let icon =
        idx === 0
          ? automation.trigger.icon
          : isLoopBlock
          ? "Reuse"
          : allSteps[idx].icon

      if (wasLoopBlock) {
        loopBlockCount++
        schema = cloneDeep(allSteps[idx - 1]?.schema?.outputs?.properties)
      }
      Object.entries(schema).forEach(([name, value]) => {
        addBinding(name, value, icon, idx, isLoopBlock, bindingName)
      })
    }

    // for (let idx = 0; idx < blockIdx; idx++) {
    //   let wasLoopBlock = allSteps[idx - 1]?.stepId === ActionStepID.LOOP
    //   let isLoopBlock =
    //     allSteps[idx]?.stepId === ActionStepID.LOOP &&
    //     allSteps.some(x => x.blockToLoop === block.id)
    //   let schema = cloneDeep(allSteps[idx]?.schema?.outputs?.properties) ?? {}
    //   if (allSteps[idx]?.name.includes("Looping")) {
    //     isLoopBlock = true
    //     loopBlockCount++
    //   }
    //   let bindingName =
    //     automation.stepNames?.[allSteps[idx].id] || allSteps[idx].name

    //   if (isLoopBlock) {
    //     schema = {
    //       currentItem: {
    //         type: "string",
    //         description: "the item currently being executed",
    //       },
    //     }
    //   }

    //   if (
    //     idx === 0 &&
    //     automation.trigger?.event === AutomationEventType.APP_TRIGGER
    //   ) {
    //     schema = Object.fromEntries(
    //       Object.keys(automation.trigger.inputs.fields || []).map(key => [
    //         key,
    //         { type: automation.trigger.inputs.fields[key] },
    //       ])
    //     )
    //   }
    //   if (
    //     (idx === 0 &&
    //       automation.trigger.event === AutomationEventType.ROW_UPDATE) ||
    //     (idx === 0 && automation.trigger.event === AutomationEventType.ROW_SAVE)
    //   ) {
    //     let table = $tables.list.find(
    //       table => table._id === automation.trigger.inputs.tableId
    //     )
    //     // We want to generate our own schema for the bindings from the table schema itself
    //     for (const key in table?.schema) {
    //       schema[key] = {
    //         type: table.schema[key].type,
    //         subtype: table.schema[key].subtype,
    //       }
    //     }
    //     // remove the original binding
    //     delete schema.row
    //   }
    //   let icon =
    //     idx === 0
    //       ? automation.trigger.icon
    //       : isLoopBlock
    //       ? "Reuse"
    //       : allSteps[idx].icon

    //   if (wasLoopBlock) {
    //     loopBlockCount++
    //     schema = cloneDeep(allSteps[idx - 1]?.schema?.outputs?.properties)
    //   }
    //   Object.entries(schema).forEach(([name, value]) => {
    //     addBinding(name, value, icon, idx, isLoopBlock, bindingName)
    //   })
    // }
    return bindings
  },

  // $: automationStore.actions.traverse($selectedAutomation)
  getPathBindings: step => {
    console.log("Hello world", step)
    // get(store)
    // build the full path worth of bindings
    /*
      [..globals],
      blocks[...step.id].binding,
      ppath.
    */
    return []
  },
  traverse: automation => {
    let blocks = []
    if (automation.definition.trigger) {
      blocks.push(automation.definition.trigger)
    }
    blocks = blocks.concat(automation.definition.steps || [])

    const treeTraverse = (block, pathTo, stepIdx, branchIdx) => {
      const pathToCurrentNode = [
        ...(pathTo || []),
        {
          ...(Number.isInteger(branchIdx) ? { branchIdx } : {}),
          stepIdx,
          id: block.id,
          ...(block.stepId === "TRIGGER" ? { isTrigger: true } : {}),
        },
      ]
      const branches = block.inputs?.branches || []

      branches.forEach((branch, bIdx) => {
        block.inputs?.children[branch.name].forEach((bBlock, sIdx) => {
          treeTraverse(bBlock, pathToCurrentNode, sIdx, bIdx)
        })
      })

      if (block.stepId !== "BRANCH") {
        //dev, log.text
        console.log(pathToCurrentNode, block.inputs.text)
        //store.actions.registerBlock(block)
      }
      store.actions.registerBlock(block)
    }

    //maybe a cfg block for cleanliness
    blocks.forEach((block, idx) => treeTraverse(block, null, idx))
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
      API.getAutomations({ enrich: true }),
      API.getAutomationDefinitions(),
    ])
    store.update(state => {
      state.automations = automationResponse.automations
      state.automations.sort((a, b) => {
        return a.name < b.name ? -1 : 1
      })
      state.automationDisplayData = automationResponse.builderData
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
    await API.deleteAutomation({
      automationId: automation?._id,
      automationRev: automation?._rev,
    })

    store.update(state => {
      // Remove the automation
      state.automations = state.automations.filter(
        x => x._id !== automation._id
      )

      // Select a new automation if required
      if (automation._id === state.selectedAutomationId) {
        state.selectedAutomationId = state.automations[0]?._id || null
      }

      // Clear out automationDisplayData for the automation
      delete state.automationDisplayData[automation._id]
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
    const automation = get(selectedAutomation)
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
    let newAutomation = cloneDeep(automation)
    if (automation.definition.trigger?.id === block.id) {
      newAutomation.definition.trigger = block
    } else {
      const idx = automation.definition.steps.findIndex(x => x.id === block.id)
      newAutomation.definition.steps.splice(idx, 1, block)
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
    let newAutomation = cloneDeep(get(selectedAutomation))
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
      id: generate(), // this can this be relied on
    }
    newName = getNewStepName(get(selectedAutomation), newStep)
    newStep.name = newName
    return newStep
  },
  addBlockToAutomation: async (block, blockIdx) => {
    const automation = get(selectedAutomation)
    let newAutomation = cloneDeep(automation)
    if (!automation) {
      return
    }

    try {
      updateStepReferences(newAutomation.definition.steps, blockIdx, "add")
    } catch (e) {
      notifications.error("Error adding automation block")
    }
    newAutomation.definition.steps.splice(blockIdx, 0, block)
    await store.actions.save(newAutomation)
  },
  saveAutomationName: async (blockId, name) => {
    const automation = get(selectedAutomation)
    let newAutomation = cloneDeep(automation)
    if (!newAutomation) {
      return
    }

    const stepIndex = newAutomation.definition.steps.findIndex(
      step => step.id === blockId
    )

    if (stepIndex !== -1) {
      const oldName = newAutomation.definition.steps[stepIndex].name
      const newName = name.trim()

      newAutomation.definition.stepNames = {
        ...newAutomation.definition.stepNames,
        [blockId]: newName,
      }

      newAutomation.definition.steps[stepIndex].name = newName

      newAutomation.definition.steps = updateBindingsInSteps(
        newAutomation.definition.steps,
        oldName,
        newName,
        stepIndex
      )

      await store.actions.save(newAutomation)
    }
  },
  deleteAutomationName: async blockId => {
    const automation = get(selectedAutomation)
    let newAutomation = cloneDeep(automation)
    if (!automation) {
      return
    }
    if (newAutomation.definition.stepNames) {
      delete newAutomation.definition.stepNames[blockId]
    }

    await store.actions.save(newAutomation)
  },

  deleteAutomationBlock: async (block, blockIdx) => {
    const automation = get(selectedAutomation)
    let newAutomation = cloneDeep(automation)

    // Delete trigger if required
    if (newAutomation.definition.trigger?.id === block.id) {
      delete newAutomation.definition.trigger
    } else {
      // Otherwise remove step
      newAutomation.definition.steps = newAutomation.definition.steps.filter(
        step => step.id !== block.id
      )
      delete newAutomation.definition.stepNames?.[block.id]
    }
    try {
      updateStepReferences(newAutomation.definition.steps, blockIdx, "delete")
    } catch (e) {
      notifications.error("Error deleting automation block")
    }

    await store.actions.save(newAutomation)
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
  return $automationStore.automations?.find(
    x => x._id === $automationStore.selectedAutomationId
  )
})

export const selectedAutomationDisplayData = derived(
  [automationStore, selectedAutomation],
  ([$automationStore, $selectedAutomation]) => {
    if (!$selectedAutomation?._id) {
      return null
    }
    return $automationStore.automationDisplayData[$selectedAutomation._id]
  }
)
