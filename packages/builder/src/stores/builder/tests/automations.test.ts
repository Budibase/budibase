import { it, expect, describe, beforeEach, vi, TestContext } from "vitest"
import { cloneDeep, difference } from "lodash/fp"
import { get, writable } from "svelte/store"
import { API } from "@/api"
import { appStore } from "@/stores/builder"
import {
  initialAutomationState,
  AutomationStore,
} from "@/stores/builder/automations"
import {
  baseAutomation,
  apiDefinitions,
} from "@/stores/builder/tests/fixtures/automations"
import {
  FetchAutomationResponse,
  GetAutomationStepDefinitionsResponse,
  AutomationTriggerStepId,
  BlockDefinitions,
  Automation,
  UpdateAutomationResponse,
  DeleteAutomationResponse,
  TestAutomationResponse,
  AutomationResults,
  AutomationActionStepId,
  AutomationTrigger,
  ServerLogStep,
  ServerLogStepInputs,
  AutomationStep,
  AutomationTriggerResult,
  BlockDefinitionTypes,
  RowActionTriggerInputs,
  BlockPath,
  LoopStep,
} from "@budibase/types"
import { Helpers } from "@budibase/bbui"
import { AutomationState, DerivedAutomationState } from "@/types/automations"

interface CustomContext extends TestContext {
  bb: BBContext
}

interface BBContext {
  store: AutomationState
  automationStore: AutomationStore
  selected: DerivedAutomationState
}

vi.mock("@/stores/builder", async () => {
  const mockAppStore = writable()
  const appStore = {
    subscribe: mockAppStore.subscribe,
    update: mockAppStore.update,
    set: mockAppStore.set,
  }
  const mockTableStore = writable()
  const tables = {
    subscribe: mockTableStore.subscribe,
    update: mockTableStore.update,
    set: mockTableStore.set,
  }

  return {
    appStore,
    tables,
  }
})

vi.mock("@/stores/portal", async () => {
  const mockLicensingStore = writable()
  const licensingStore = {
    subscribe: mockLicensingStore.subscribe,
    update: mockLicensingStore.update,
    set: mockLicensingStore.set,
  }
  const mockOrgStore = writable()
  const organisation = {
    subscribe: mockOrgStore.subscribe,
    update: mockOrgStore.update,
    set: mockOrgStore.set,
  }
  const envStore = writable()
  const environment = {
    subscribe: envStore.subscribe,
    update: envStore.update,
    set: envStore.set,
  }
  return {
    licensingStore,
    organisation,
    environment,
  }
})

vi.mock("@/api", () => {
  return {
    API: {
      getAutomations: vi.fn(),
      getAutomationDefinitions: vi.fn(),
      updateAutomation: vi.fn(),
      deleteAutomation: vi.fn(),
      testAutomation: vi.fn(),
      rowActions: {
        delete: vi.fn(),
      },
    },
  }
})

/**
 * Load and store all static, core block definitions in to the supplied
 * budibase context object
 * @param bb
 */
const loadDefintions = (bb: BBContext) => {
  const { trigger, action }: GetAutomationStepDefinitionsResponse =
    apiDefinitions()

  bb.automationStore.update(state => ({
    ...state,
    blockDefinitions: bb.automationStore.processDefintions(trigger, action),
  }))
}

/**
 * Take an automation and some optional outputs and generate a valid base set
 * of test results.
 *
 * @param auto
 * @param outputs
 * @returns
 */
const generateBaseResults = (
  auto: Automation,
  outputs: Record<string, any> = {}
): AutomationResults => {
  const triggerResults = {
    id: auto.definition.trigger.id,
    stepId: auto.definition.trigger.stepId,
    inputs: null,
    outputs: {
      automation: {}, // target automation
      ...outputs,
      user: {}, // context user
    },
  } as AutomationTriggerResult

  /* 
    Also remember the bunch of other result data.
    Below are from the run of an row action

    automation {}
    user {}
    fields {}
    row {}
    oldRow {}
    id "ro_ta_bb_employee_7465c5e666c949089d1ec66c5f306cdc"
    revision "1-d9fdc39a38748a606ae0e502a6b5c006"
    table {}
  */

  return {
    trigger: triggerResults,
    steps: [triggerResults],
  }
}

/**
 * Generate an action block
 * @param bb
 * @param definitionKey
 * @returns
 */
const dispenseBlock = (
  bb: BBContext,
  definitionKey: keyof BlockDefinitions[BlockDefinitionTypes.ACTION]
) => {
  const def = bb.store.blockDefinitions.ACTION[definitionKey]!
  return bb.automationStore.constructBlock(
    BlockDefinitionTypes.ACTION,
    def.stepId!,
    def
  )
}

describe("Automation store", () => {
  beforeEach<CustomContext>(async ctx => {
    const automationStore = new AutomationStore()
    console.log()
    ctx.bb = {
      get store() {
        return get(automationStore)
      },
      get selected() {
        return get(automationStore.selected)
      },
      automationStore,
    }
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // We filter the possible step actions to exclude ROW_ACTION
  const confirmAPIStepProcessing = (
    api: GetAutomationStepDefinitionsResponse,
    bb: BBContext
  ) => {
    expect(api.trigger[AutomationTriggerStepId.ROW_ACTION]).toBeDefined()

    const expectedCreateable: Record<string, any> = cloneDeep(api.trigger)
    delete expectedCreateable[AutomationTriggerStepId.ROW_ACTION]

    const updated: BlockDefinitions = bb.automationStore.processDefintions(
      api.trigger,
      api.action
    )

    // No changes from the response
    expect(updated.TRIGGER).toStrictEqual(api.trigger)
    expect(updated.ACTION).toStrictEqual(api.action)

    // ROW_ACTION Should be removed
    expect(updated.CREATABLE_TRIGGER).toStrictEqual(expectedCreateable)

    return updated
  }

  it<CustomContext>("Create base store with defaults", ({ bb }) => {
    expect(bb.store).toStrictEqual(initialAutomationState)
  })

  // AutomationResults | DidNotTriggerResponse | AutomationJob
  it<CustomContext>("Should test an automation on the server and store any results", async ({
    bb,
  }) => {
    const auto1: Automation = baseAutomation()
    const fields = {
      fields: {
        hello: true,
      },
    }

    const testResults = generateBaseResults(auto1, {
      fields: {
        hello: true,
      },
    })

    const testAutomationSpy = vi
      .spyOn(API, "testAutomation")
      .mockImplementation((): Promise<TestAutomationResponse> => {
        return Promise.resolve(testResults)
      })

    await bb.automationStore.test(auto1, fields)

    expect(testAutomationSpy).toHaveBeenCalledWith(auto1._id, fields)
    expect(bb.store.testResults).toStrictEqual(testResults)
  })

  it<CustomContext>("Should catch a test fail and throw any response data", async ({
    bb,
  }) => {
    const auto1: Automation = baseAutomation()

    let respType
    const respTypes: any = {
      message: "Test response text",
      status: "success", // AutomationStatus
      error: {
        some: "message",
      },
    }

    // Reject w/message
    const testAutomationSpy = vi
      .spyOn(API, "testAutomation")
      .mockImplementation((): Promise<TestAutomationResponse> => {
        return Promise.reject({
          [respType!]: respTypes[respType!],
        })
      })

    const fakeTestData = {
      fields: {
        test1: "testing",
      },
    }

    respType = "message"
    await expect(bb.automationStore.test(auto1, fakeTestData)).rejects.toThrow(
      `Automation test failed - ${respTypes.message}`
    )

    respType = "status"
    await expect(bb.automationStore.test(auto1, fakeTestData)).rejects.toThrow(
      `Automation test failed - ${respTypes.status}`
    )

    respType = "error"
    await expect(bb.automationStore.test(auto1, fakeTestData)).rejects.toThrow(
      `Automation test failed - ${JSON.stringify({
        [respType!]: respTypes[respType!],
      })}`
    )

    respType = ""

    expect(testAutomationSpy).toHaveBeenCalledWith(auto1._id, fakeTestData)
  })

  it<CustomContext>("Should save the automation if the inputs have changed", async ({
    bb,
  }) => {
    const auto1: Automation = baseAutomation()

    loadDefintions(bb)

    const processInputsSpy = vi
      .spyOn(bb.automationStore, "processBlockInputs")
      .mockImplementation((): Promise<Automation | undefined> => {
        return Promise.resolve(auto1)
      })

    const saveAutoSpy = vi
      .spyOn(bb.automationStore, "save")
      .mockImplementation((): Promise<Automation> => {
        return Promise.resolve(auto1)
      })

    const sampleInputs = {
      test: true,
    }

    const logDefinition = bb.store.blockDefinitions.ACTION.SERVER_LOG
    const logBlock = bb.automationStore.constructBlock(
      BlockDefinitionTypes.ACTION,
      logDefinition?.stepId!,
      logDefinition
    )

    await bb.automationStore.updateBlockInputs(logBlock, sampleInputs)

    expect(processInputsSpy).toBeCalledWith(logBlock, sampleInputs)
    expect(saveAutoSpy).toBeCalledWith(auto1)
  })

  it<CustomContext>("Should not update the automation if the inputs are unchanged", async ({
    bb,
  }) => {
    const auto1: Automation = baseAutomation()

    loadDefintions(bb)

    const processInputsSpy = vi
      .spyOn(bb.automationStore, "processBlockInputs")
      .mockImplementation((): Promise<Automation | undefined> => {
        return Promise.resolve(undefined)
      })

    const saveAutoSpy = vi
      .spyOn(bb.automationStore, "save")
      .mockImplementation((): Promise<Automation> => {
        return Promise.resolve(auto1)
      })

    const sampleInputs = {
      test: true,
    }

    const logDefinition = bb.store.blockDefinitions.ACTION.SERVER_LOG
    const logBlock = bb.automationStore.constructBlock(
      BlockDefinitionTypes.ACTION,
      logDefinition?.stepId!,
      logDefinition
    )

    await bb.automationStore.updateBlockInputs(logBlock, sampleInputs)

    expect(processInputsSpy).toBeCalledWith(logBlock, sampleInputs)
    expect(saveAutoSpy).not.toBeCalled()
  })

  it<CustomContext>("Should return an updated automation if inputs have been altered", async ({
    bb,
  }) => {
    const auto1: Automation = baseAutomation()

    loadDefintions(bb)

    // Add the updated block to the store
    bb.automationStore.update(state => ({
      ...state,
      automations: [auto1],
    }))

    bb.automationStore.select(auto1._id!)

    const logDefinition = bb.store.blockDefinitions.ACTION.SERVER_LOG
    const logBlock = bb.automationStore.constructBlock(
      BlockDefinitionTypes.ACTION,
      logDefinition?.stepId!,
      logDefinition
    )

    auto1.definition.steps.push(logBlock)

    // Expected update
    const updated = cloneDeep(auto1)
    const updatedInputs: ServerLogStepInputs = { text: "altered" }
    updated.definition.steps[0].inputs = updatedInputs

    const getUpdatedSpy = vi
      .spyOn(bb.automationStore, "getUpdatedDefinition")
      .mockImplementation((): Automation => {
        return updated
      })

    const updatedAutomation = await bb.automationStore.processBlockInputs(
      logBlock,
      {
        text: "altered",
        // Should be purged
        empty: null,
        invalid: undefined,
        deleteme: "",
      }
    )

    expect(updatedAutomation).toStrictEqual(updated)
    expect(getUpdatedSpy).toHaveBeenCalled()
  })

  it<CustomContext>("Should return nothing if block inputs are unchanged", async ({
    bb,
  }) => {
    const auto1: Automation = baseAutomation()

    loadDefintions(bb)

    // Add the updated block to the store
    bb.automationStore.update(state => ({
      ...state,
      automations: [auto1],
    }))

    bb.automationStore.select(auto1._id!)

    const logDefinition = bb.store.blockDefinitions.ACTION.SERVER_LOG
    const logBlock = bb.automationStore.constructBlock(
      BlockDefinitionTypes.ACTION,
      logDefinition?.stepId!,
      logDefinition
    )
    logBlock.inputs = {
      text: "original",
    }
    auto1.definition.steps.push(logBlock)

    const getUpdatedSpy = vi
      .spyOn(bb.automationStore, "getUpdatedDefinition")
      .mockImplementation((): Automation => {
        return auto1
      })

    bb.automationStore.select(auto1._id!)

    const response = await bb.automationStore.processBlockInputs(logBlock, {
      text: "original",
    })

    // The block inputs were the same so the automation is unchan
    expect(response).toBeUndefined()
    expect(getUpdatedSpy).toHaveBeenCalled()
  })

  it<CustomContext>("Should return nothing if no automation is selected when processing block inputs", async ({
    bb,
  }) => {
    const auto1: Automation = baseAutomation()

    // Add the updated block to the store
    bb.automationStore.update(state => ({
      ...state,
      automations: [auto1],
    }))

    const getUpdatedSpy = vi
      .spyOn(bb.automationStore, "getUpdatedDefinition")
      .mockImplementation((): Automation => {
        return auto1
      })

    const response = await bb.automationStore.processBlockInputs(
      {} as AutomationStep,
      {
        text: "original",
      }
    )

    // No auto is selected
    expect(response).toBeUndefined()
    expect(getUpdatedSpy).not.toHaveBeenCalled()
  })

  it<CustomContext>("Should fetch and store base automations and definitions", async ({
    bb,
  }) => {
    // Allow chaining
    const auto1: Automation = baseAutomation()
    auto1.name = "a test"
    const auto2: Automation = baseAutomation()
    auto2.name = "b test"
    const auto3: Automation = baseAutomation()
    auto3.name = "0 test"

    // API automations
    const baseAutos = [auto1, auto2, auto3]

    // Automations are sorted by name before being stored
    const baseAutosByName = [auto3, auto1, auto2]

    const automationFetchSpy = vi
      .spyOn(API, "getAutomations")
      .mockImplementation((): Promise<FetchAutomationResponse> => {
        return Promise.resolve({ automations: baseAutos })
      })

    const resp: GetAutomationStepDefinitionsResponse = apiDefinitions()
    const definitionFetchSpy = vi
      .spyOn(API, "getAutomationDefinitions")
      .mockImplementation((): Promise<GetAutomationStepDefinitionsResponse> => {
        return Promise.resolve(resp)
      })

    // Confirm default, empty block definitions
    for (const entry in bb.store.blockDefinitions as BlockDefinitions) {
      const key = entry as keyof BlockDefinitions
      expect(Object.keys(bb.store.blockDefinitions[key]).length).toBe(0)
    }

    // Fetch automations
    await bb.automationStore.fetch()

    expect(automationFetchSpy).toHaveBeenCalled()
    expect(definitionFetchSpy).toHaveBeenCalled()

    // Confirm automations were processed and sorted by name
    expect(bb.store.automations).toStrictEqual(baseAutosByName)

    const updated = confirmAPIStepProcessing(resp, bb)
    expect(bb.store.blockDefinitions).toStrictEqual(updated)
  })

  it<CustomContext>("Process step definitions and remove unnecessary ones", ({
    bb,
  }) => {
    const resp: GetAutomationStepDefinitionsResponse = apiDefinitions()

    confirmAPIStepProcessing(resp, bb)
  })

  it<CustomContext>("Should fetch an automation definition from the store by id", ({
    bb,
  }) => {
    const auto1: Automation = baseAutomation()
    auto1.name = "a test"
    const auto2: Automation = baseAutomation()
    auto2.name = "b test"

    // Init the automations
    bb.automationStore.update(state => ({
      ...state,
      automations: [auto1, auto2],
    }))

    const found = bb.automationStore.getDefinition(auto1._id!)
    expect(auto1.name).toEqual(found?.name)
  })

  it<CustomContext>("Will not return an automation definition if the _id is not found", ({
    bb,
  }) => {
    const auto1: Automation = baseAutomation()
    auto1.name = "a test"
    const auto2: Automation = baseAutomation()
    auto2.name = "b test"

    // Check that an empty store doesn't cause an issue
    const emptyCheck = bb.automationStore.getDefinition(auto1._id!)
    expect(emptyCheck).toBeUndefined()

    // Init the automations
    bb.automationStore.update(state => ({
      ...state,
      automations: [auto1, auto2],
    }))

    const noMatch = bb.automationStore.getDefinition("an invalid id")
    expect(noMatch).toBeUndefined()
  })

  it<CustomContext>("Should mark a valid automation _id as selected", ({
    bb,
  }) => {
    const auto1: Automation = baseAutomation()
    const auto2: Automation = baseAutomation()

    bb.automationStore.update(state => ({
      ...state,
      automations: [auto1, auto2],
    }))

    bb.automationStore.select(auto2._id!)

    expect(bb.store.selectedAutomationId).toEqual(auto2._id)
    expect(bb.selected.data?._id).toEqual(auto2._id)
  })

  it<CustomContext>("Should ignore selection if targeting the same automation", ({
    bb,
  }) => {
    const auto1: Automation = baseAutomation()

    bb.automationStore.update(state => ({
      ...state,
      automations: [auto1],
      selectedAutomationId: auto1._id!,
    }))

    bb.automationStore.select(auto1._id!)

    expect(bb.store.selectedAutomationId).toEqual(auto1._id)
  })

  it<CustomContext>("Should change selection when a different automation is already selected", ({
    bb,
  }) => {
    const auto1: Automation = baseAutomation()
    const auto2: Automation = baseAutomation()

    bb.automationStore.update(state => ({
      ...state,
      automations: [auto1, auto2],
      testResults: generateBaseResults(auto2, { fields: { test: 123 } }),
      selectedAutomationId: auto1._id!,
    }))

    bb.automationStore.select(auto2._id!)

    expect(bb.store.selectedAutomationId).toEqual(auto2._id)
    expect(bb.store.testResults).toBeUndefined()
  })

  // DEAN - makes sense to do the node select tests in or around here

  it<CustomContext>("Should update an existing automation on save", async ({
    bb,
  }) => {
    const auto1: Automation = baseAutomation()
    auto1.name = "b"
    const auto2: Automation = baseAutomation()
    auto2.name = "a"

    loadDefintions(bb)

    bb.automationStore.update(state => ({
      ...state,
      automations: [auto1, auto2],
      testResults: generateBaseResults(auto2, { fields: { test: 123 } }),
      selectedAutomationId: auto1._id!,
    }))

    const auto1Modified = cloneDeep(auto1)

    const logDefinition = bb.store.blockDefinitions.ACTION.SERVER_LOG
    const logBlock = bb.automationStore.constructBlock(
      BlockDefinitionTypes.ACTION,
      logDefinition?.stepId!,
      logDefinition
    )
    logBlock.name = "new log step"

    auto1Modified.definition.steps.push(logBlock)

    // Required for save
    const definitionFetchSpy = vi
      .spyOn(API, "getAutomationDefinitions")
      .mockImplementation((): Promise<GetAutomationStepDefinitionsResponse> => {
        return Promise.resolve(apiDefinitions())
      })

    // Required for save
    const automationFetchSpy = vi
      .spyOn(API, "getAutomations")
      .mockImplementation((): Promise<FetchAutomationResponse> => {
        return Promise.resolve({ automations: [auto1Modified, auto2] })
      })

    const updateSpy = vi
      .spyOn(API, "updateAutomation")
      .mockImplementation((): Promise<UpdateAutomationResponse> => {
        return Promise.resolve({
          message: "updated?",
          automation: auto1Modified,
        })
      })

    const updatedAuto = await bb.automationStore.save(auto1Modified)

    expect(updateSpy).toHaveBeenCalledWith(auto1Modified)
    expect(automationFetchSpy).toHaveBeenCalled()
    expect(definitionFetchSpy).toHaveBeenCalled()
    expect(updatedAuto).toStrictEqual(auto1Modified)

    // All should be present and in the correct order
    expect(bb.store.automations.map(auto => auto._id)).toStrictEqual([
      auto2._id,
      auto1._id,
    ])

    expect(bb.store.selectedAutomationId).toEqual(auto1._id)
  })

  it<CustomContext>("Should create an new automation and select it", async ({
    bb,
  }) => {
    const auto1: Automation = baseAutomation()
    auto1.name = "b"
    const auto2: Automation = baseAutomation()
    auto2.name = "a"

    bb.automationStore.update(state => ({
      ...state,
      automations: [auto1, auto2],
      selectedAutomationId: auto1._id!,
    }))

    const automationFetchSpy = vi
      .spyOn(API, "getAutomations")
      .mockImplementation((): Promise<FetchAutomationResponse> => {
        return Promise.resolve({ automations: [auto1, auto2] })
      })

    const updateSpy = vi
      .spyOn(API, "updateAutomation")
      .mockImplementation((): Promise<UpdateAutomationResponse> => {
        return Promise.resolve({
          message: "new auto",
          automation: auto2,
        })
      })

    // Required for save
    const definitionFetchSpy = vi
      .spyOn(API, "getAutomationDefinitions")
      .mockImplementation((): Promise<GetAutomationStepDefinitionsResponse> => {
        return Promise.resolve(apiDefinitions())
      })

    const updatedAuto = await bb.automationStore.save(auto2)

    expect(updateSpy).toHaveBeenCalledWith(auto2)
    expect(automationFetchSpy).toHaveBeenCalled()
    expect(definitionFetchSpy).toHaveBeenCalled()
    expect(updatedAuto).toStrictEqual(auto2)

    // All should be present and in the correct order
    expect(bb.store.automations.map(auto => auto._id)).toStrictEqual([
      auto2._id,
      auto1._id,
    ])

    // Should switch to the new automation
    expect(bb.store.selectedAutomationId).toEqual(updatedAuto._id)
  })

  it<CustomContext>("Should delete a valid automation while its selected", async ({
    bb,
  }) => {
    const auto1: Automation = baseAutomation()
    auto1.name = "b"
    const auto2: Automation = baseAutomation()
    auto2.name = "a"
    const auto3: Automation = baseAutomation()
    auto2.name = "c"

    bb.automationStore.update(state => ({
      ...state,
      automations: [auto1, auto2, auto3],
      selectedAutomationId: auto1._id!,
    }))

    const deleteAutoSpy = vi
      .spyOn(API, "deleteAutomation")
      .mockImplementation((): Promise<DeleteAutomationResponse> => {
        return Promise.resolve({ id: auto1._id!, ok: true, rev: auto1._rev! })
      })

    const rowActionSpy = vi
      .spyOn(API.rowActions, "delete")
      .mockImplementation((): Promise<void> => {
        return Promise.resolve()
      })

    await bb.automationStore.delete(auto2)

    // Not a row action
    expect(rowActionSpy).not.toHaveBeenCalled()

    expect(deleteAutoSpy).toHaveBeenCalledWith(auto2._id!, auto2._rev!)

    // The automation is deleted
    expect(bb.store.automations).toStrictEqual([auto1, auto3])

    // The first automation is now selected, if available.
    expect(bb.store.selectedAutomationId).toStrictEqual(auto1._id!)
  })

  it<CustomContext>("Should execute a row action delete with the appropriate trigger data", async ({
    bb,
  }) => {
    const auto1: Automation = baseAutomation(AutomationTriggerStepId.ROW_ACTION)
    auto1.name = "b"

    auto1.definition.trigger.inputs = {
      tableId: "sometable",
      rowActionId: "somerowaction",
    } as RowActionTriggerInputs

    const auto2: Automation = baseAutomation()
    auto2.name = "a"

    bb.automationStore.update(state => ({
      ...state,
      automations: [auto1, auto2],
      selectedAutomationId: auto1._id!,
    }))

    const deleteAutoSpy = vi.spyOn(API, "deleteAutomation")

    const rowActionDeleteSpy = vi
      .spyOn(API.rowActions, "delete")
      .mockImplementation((tableId, rowId): Promise<void> => {
        return Promise.resolve()
      })

    await bb.automationStore.delete(auto1)

    expect(deleteAutoSpy).not.toHaveBeenCalled()

    // Should actually execute a row action delete
    expect(rowActionDeleteSpy).toHaveBeenCalledWith(
      "sometable",
      "somerowaction"
    )

    expect(bb.store.automations.map(auto => auto._id)).toStrictEqual([
      auto2._id,
    ])

    expect(bb.store.selectedAutomationId).toEqual(auto2._id!)
  })

  it<CustomContext>("Should toggle automation disabled state", async ({
    bb,
  }) => {
    const auto1: Automation = baseAutomation()
    auto1.name = "b"
    const auto2: Automation = baseAutomation()
    auto1.name = "a"

    bb.automationStore.update(state => ({
      ...state,
      automations: [auto2, auto1],
    }))

    const altered = cloneDeep(auto1)
    altered.disabled = true

    expect(auto1.disabled).toBeUndefined()

    const automationFetchSpy = vi
      .spyOn(API, "getAutomations")
      .mockImplementation((): Promise<FetchAutomationResponse> => {
        return Promise.resolve({ automations: [auto1, auto2] })
      })

    const updateSpy = vi
      .spyOn(API, "updateAutomation")
      .mockImplementation((): Promise<UpdateAutomationResponse> => {
        return Promise.resolve({
          message: "updated?",
          automation: altered,
        })
      })

    // This mutates the original in the store value...
    await bb.automationStore.toggleDisabled(auto1._id!)

    // Send the update
    expect(updateSpy).toHaveBeenCalledWith(altered)
    expect(automationFetchSpy).toHaveBeenCalled()

    const updated = bb.automationStore.getDefinition(auto1._id!)

    // Verify that the state was updated
    expect(updated).toStrictEqual(altered)
  })

  it<CustomContext>("Should not toggle automation disabled state if key is invalid", async ({
    bb,
  }) => {
    const auto1: Automation = baseAutomation()

    // Confirm empty state
    expect(bb.store.automations.length).toBe(0)

    bb.automationStore.update(state => ({
      ...state,
      automations: [auto1],
    }))

    expect(auto1.disabled).toBeUndefined()

    const automationFetchSpy = vi.spyOn(API, "getAutomations")

    const updateSpy = vi.spyOn(API, "updateAutomation")

    // This mutates the original in the store value...
    await bb.automationStore.toggleDisabled("fake")

    // Ensure nothing happens
    expect(updateSpy).not.toHaveBeenCalled()
    expect(automationFetchSpy).not.toHaveBeenCalled()

    const updated = bb.automationStore.getDefinition(auto1._id!)

    // Verify that the state was not updated
    expect(updated).toStrictEqual(auto1)
  })

  it<CustomContext>("Should duplicate the provided automation, giving it a '- copy' suffix", async ({
    bb,
  }) => {
    const auto1: Automation = baseAutomation()
    auto1.name = "b"
    const auto2: Automation = baseAutomation()
    auto2.name = "a"

    bb.automationStore.update(state => ({
      ...state,
      automations: [auto2, auto1],
      selectedAutomationId: auto1._id!,
    }))

    // Need to mock out the potential response with id and rev first
    const dupe = {
      ...auto1,
      name: `${auto1.name} - copy`,
      _id: Helpers.uuid(),
      _rev: Helpers.uuid(),
    }

    // Required for save
    const definitionFetchSpy = vi
      .spyOn(API, "getAutomationDefinitions")
      .mockImplementation((): Promise<GetAutomationStepDefinitionsResponse> => {
        return Promise.resolve(apiDefinitions())
      })

    const automationFetchSpy = vi
      .spyOn(API, "getAutomations")
      .mockImplementation((): Promise<FetchAutomationResponse> => {
        return Promise.resolve({ automations: [auto2, auto1, dupe] })
      })

    const updateSpy = vi
      .spyOn(API, "updateAutomation")
      .mockImplementation((): Promise<UpdateAutomationResponse> => {
        return Promise.resolve({
          message: "updated",
          automation: dupe,
        })
      })

    // Create an empty request to create a new automation
    const req = {
      ...dupe,
      _id: undefined,
      _rev: undefined,
    }

    const def = bb.automationStore.getDefinition(auto1._id!)
    const duplicate = await bb.automationStore.duplicate(def!)

    expect(updateSpy).toHaveBeenCalledWith(req)
    expect(duplicate.name).toEqual(auto1.name + " - copy")
    expect(automationFetchSpy).toHaveBeenCalled()
    expect(definitionFetchSpy).toBeCalled()

    // Sorted automations after the update
    expect(bb.store.automations).toStrictEqual([auto2, auto1, duplicate])
    // Duplicate is now selected
    expect(bb.store.selectedAutomationId).toEqual(dupe._id)
  })

  it<CustomContext>("Should create a brand new automation", async ({ bb }) => {
    const auto1: Automation = baseAutomation()
    auto1.name = "b"
    const auto2: Automation = baseAutomation()
    auto2.name = "a"

    loadDefintions(bb)

    bb.automationStore.update(state => ({
      ...state,
      automations: [auto2, auto1],
      selectedAutomationId: auto1._id!,
    }))

    appStore.update(state => ({ ...state, appId: "testApp" }))

    // The type of automation to be created
    const triggerVal = bb.store.blockDefinitions.TRIGGER.APP
    const triggerBlock = bb.automationStore.constructBlock(
      BlockDefinitionTypes.TRIGGER,
      triggerVal?.stepId!,
      triggerVal
    )

    // Sample automation. Should match the api request and appStore state
    const newAuto: Automation = baseAutomation(
      AutomationTriggerStepId.APP,
      get(appStore).appId
    )

    // Create automation request with app id set from local store.
    const request: Automation = {
      name: "0 my auto",
      type: "automation",
      appId: get(appStore).appId,
      definition: {
        steps: [],
        trigger: triggerBlock,
      },
      disabled: false,
    }

    // Required for save
    const definitionFetchSpy = vi
      .spyOn(API, "getAutomationDefinitions")
      .mockImplementation((): Promise<GetAutomationStepDefinitionsResponse> => {
        return Promise.resolve(apiDefinitions())
      })

    const automationFetchSpy = vi
      .spyOn(API, "getAutomations")
      .mockImplementation((): Promise<FetchAutomationResponse> => {
        return Promise.resolve({ automations: [auto2, auto1, newAuto] })
      })

    const updateSpy = vi
      .spyOn(API, "updateAutomation")
      .mockImplementation((): Promise<UpdateAutomationResponse> => {
        return Promise.resolve({
          message: "updated",
          automation: newAuto,
        })
      })

    const resp = await bb.automationStore.create(
      "0 my auto",
      triggerBlock as AutomationTrigger
    )

    expect(updateSpy).toHaveBeenCalledWith(request)
    expect(automationFetchSpy).toHaveBeenCalled()
    expect(definitionFetchSpy).toHaveBeenCalled()
    expect(resp).toStrictEqual(newAuto)

    // Automations present and sorted
    expect(bb.store.automations).toStrictEqual([newAuto, auto2, auto1])
    expect(bb.store.selectedAutomationId).toEqual(newAuto._id)
    const def = bb.automationStore.getDefinition(newAuto._id!)
    expect(def).toBeDefined()
  })

  // Websocket update events - BuilderSocketEvent.AutomationChange
  it<CustomContext>("Should clear out an automation marked for delete", async ({
    bb,
  }) => {
    const auto1: Automation = baseAutomation()
    auto1.name = "b"
    const auto2: Automation = baseAutomation()
    auto1.name = "a"

    bb.automationStore.update(state => ({
      ...state,
      automations: [auto2, auto1],
      selectedAutomationId: auto1._id!,
    }))

    // Pass only the id
    bb.automationStore.replace(auto1._id!)

    const deleted = bb.automationStore.getDefinition(auto1._id!)
    expect(deleted).toBeUndefined()

    // Select the remaining
    expect(bb.store.selectedAutomationId).toBe(auto2._id)
  })

  // Websocket update events - BuilderSocketEvent.AutomationChange
  it<CustomContext>("Should replace an automation with an updated version", async ({
    bb,
  }) => {
    const auto1: Automation = baseAutomation()
    auto1.name = "b"
    const auto2: Automation = baseAutomation()
    auto1.name = "a"

    const update1 = cloneDeep(auto1)
    update1.name = "a replaced"

    bb.automationStore.update(state => ({
      ...state,
      automations: [auto2, auto1],
      selectedAutomationId: auto1._id!,
    }))

    // Actually replace the auto with an updated version of itself
    bb.automationStore.replace(auto1._id!, update1)

    const updated1 = bb.automationStore.getDefinition(auto1._id!)
    expect(updated1).toStrictEqual(update1)

    // Should still be selected
    expect(bb.store.selectedAutomationId).toBe(auto1._id)
  })

  // Websocket update events - BuilderSocketEvent.AutomationChange
  it<CustomContext>("Should add push a new automation when attempting to replace an unknown", async ({
    bb,
  }) => {
    const auto1: Automation = baseAutomation()
    auto1.name = "b"
    const auto2: Automation = baseAutomation()
    auto1.name = "a"

    // New auto created by someone else and retrieved by the websocket event
    const auto3: Automation = baseAutomation()
    auto3.name = "0"

    bb.automationStore.update(state => ({
      ...state,
      automations: [auto2, auto1],
      selectedAutomationId: auto1._id!,
    }))

    // Make the request to replace a non existing auto
    bb.automationStore.replace(auto3._id!, auto3)

    // TODO: verify that this is correct. This would leave the array unsorted
    // When we save/update/delete the fetch will sort
    expect(bb.store.automations).toStrictEqual([auto2, auto1, auto3])
  })

  it<CustomContext>("Should build and return a valid block with the default name", ({
    bb,
  }) => {
    const auto1: Automation = baseAutomation()

    loadDefintions(bb)

    const logDefinition = bb.store.blockDefinitions.ACTION.SERVER_LOG
    const logBlock = bb.automationStore.constructBlock(
      BlockDefinitionTypes.ACTION,
      logDefinition?.stepId!,
      logDefinition
    )

    auto1.definition.steps.push(logBlock)

    bb.automationStore.update(state => ({
      ...state,
      automations: [auto1],
      selectedAutomationId: auto1._id!,
    }))

    expect(logBlock.stepId).toBe(AutomationActionStepId.SERVER_LOG)

    // Unchanged default name
    expect(logBlock.name).toBe("Backend log")
  })

  // More complex stucture but the naming convention should be retained
  it<CustomContext>("Should build and return a valid block with a unique name per step type", async ({
    bb,
  }) => {
    const auto1: Automation = baseAutomation()

    loadDefintions(bb)

    // Init step definitions
    bb.automationStore.update(state => ({
      ...state,
      automations: [auto1],
      selectedAutomationId: auto1._id!,
    }))

    // Build a log step
    const logDefinition = bb.store.blockDefinitions.ACTION.SERVER_LOG
    const logBlock = bb.automationStore.constructBlock(
      BlockDefinitionTypes.ACTION,
      logDefinition?.stepId!,
      logDefinition
    )

    // Add the first step of the automation
    auto1.definition.steps.push(logBlock)

    // Insert a branch into the automation at step 1
    const branched = bb.automationStore.branchAutomation(
      [{ stepIdx: 1, id: logBlock._id }],
      auto1
    )

    // Add a server log step to the branch to the first/left branch node.
    const logBlock_B0 = bb.automationStore.constructBlock(
      BlockDefinitionTypes.ACTION,
      logDefinition?.stepId!,
      logDefinition
    )

    const path: BlockPath[] = [
      { stepIdx: 2, id: logBlock_B0._id },
      { branchIdx: 0, stepIdx: 0 },
    ]

    const updatedB1 = bb.automationStore.addBlockToAutomation(
      branched!,
      logBlock_B0,
      path
    )

    bb.automationStore.update(state => ({
      ...state,
      automations: [updatedB1!],
      selectedAutomationId: auto1._id!,
    }))

    // Add a step to second branch
    const logBlock_B1 = bb.automationStore.constructBlock(
      BlockDefinitionTypes.ACTION,
      logDefinition?.stepId!,
      logDefinition
    )
    const updatedB2 = bb.automationStore.addBlockToAutomation(
      updatedB1!,
      logBlock_B1,
      [{ stepIdx: 2 }, { branchIdx: 1, stepIdx: 0 }]
    )

    bb.automationStore.update(state => ({
      ...state,
      automations: [updatedB2!],
      selectedAutomationId: auto1._id!,
    }))

    // Unchanged default name
    expect(logBlock.name).toBe("Backend log")
    expect(logBlock.stepId).toBe(AutomationActionStepId.SERVER_LOG)

    // Branch log step names
    expect(logBlock_B0.name).toBe("Backend log 2")
    expect(logBlock_B1.name).toBe("Backend log 3")

    // Build a server log in the branch
    const logBlock3: ServerLogStep = bb.automationStore.constructBlock(
      BlockDefinitionTypes.ACTION,
      logDefinition?.stepId!,
      logDefinition
    )

    // Recurring block names with the same definition are appended with the
    // the number of occurrences in the automation at the time of creation
    expect(logBlock3.stepId).toBe(AutomationActionStepId.SERVER_LOG)
    expect(logBlock3.name).toBe("Backend log 4")
  })

  // More complex stucture but the naming convention should be retained
  it<CustomContext>("Should delete the first step in the root of the automation", async ({
    bb,
  }) => {
    const auto1: Automation = baseAutomation()

    loadDefintions(bb)

    // Init step definitions
    bb.automationStore.update(state => ({
      ...state,
      automations: [auto1],
      selectedAutomationId: auto1._id!,
    }))

    // Build a log step
    const logBlock = dispenseBlock(bb, "SERVER_LOG")

    // Build a js step
    const jsBlock = dispenseBlock(bb, "EXECUTE_SCRIPT_V2")

    // Add the blocks
    auto1.definition.steps.push(logBlock)
    auto1.definition.steps.push(jsBlock)

    bb.automationStore.update(state => ({
      ...state,
      automations: [auto1!],
      selectedAutomationId: auto1._id!,
    }))

    const result = bb.automationStore.deleteBlock([{ stepIdx: 1 }], auto1)
    expect(result).not.toBeUndefined()

    const { deleted, newAutomation } = result!

    expect(deleted).toStrictEqual([logBlock])
    expect(newAutomation.definition.steps.length).toBe(1)
    expect(newAutomation.definition.steps[0].id).toStrictEqual(jsBlock.id)
  })

  it<CustomContext>("Should delete any non-zero index postions in the root of the automation", async ({
    bb,
  }) => {
    const auto1: Automation = baseAutomation()

    loadDefintions(bb)

    // Init step definitions
    bb.automationStore.update(state => ({
      ...state,
      automations: [auto1],
      selectedAutomationId: auto1._id!,
    }))

    // Build a log step
    const logBlock = dispenseBlock(bb, "SERVER_LOG")

    // Build a js step
    const jsBlock = dispenseBlock(bb, "EXECUTE_SCRIPT_V2")

    // Add the blocks
    auto1.definition.steps.push(logBlock)
    auto1.definition.steps.push(jsBlock)

    // Offset by the trigger 0,1,[2]
    const result = bb.automationStore.deleteBlock([{ stepIdx: 2 }], auto1)
    expect(result).not.toBeUndefined()

    const { deleted, newAutomation } = result!

    // Confirm the remaining
    expect(newAutomation.definition.steps.length).toBe(1)
    expect(newAutomation.definition.steps[0]).toStrictEqual(logBlock)

    // Confirm the deleted steps
    expect(deleted).toStrictEqual([jsBlock])
  })

  it<CustomContext>("Should delete a looped step in the root of an automation", async ({
    bb,
  }) => {
    const auto1: Automation = baseAutomation()

    loadDefintions(bb)

    // Build a log step
    const logBlock = dispenseBlock(bb, "SERVER_LOG")

    // Build a js step
    const jsBlock = dispenseBlock(bb, "EXECUTE_SCRIPT_V2")

    // Add the blocks
    auto1.definition.steps.push(logBlock)
    auto1.definition.steps.push(jsBlock)

    // Loop the block
    const looped = bb.automationStore.loopBlock([{ stepIdx: 2 }], auto1)

    // Update the state.
    bb.automationStore.update(state => ({
      ...state,
      automations: [looped],
      selectedAutomationId: looped._id!,
    }))

    // Verify the loop is present
    expect(looped.definition.steps.length).toBe(3)

    // Expect that the loop block to match the target
    const loopBlock = looped.definition.steps.find(
      (step: AutomationStep) => step.blockToLoop === jsBlock.id
    )
    expect(loopBlock).not.toBeUndefined()

    const targetIdx = looped.definition.steps.findIndex(
      (step: AutomationStep) => step.id === jsBlock.id
    )

    // 0th is considered the trigger, +1 offset
    const result = bb.automationStore.deleteBlock(
      [{ stepIdx: targetIdx + 1 }],
      looped
    )

    expect(result).not.toBeUndefined()

    const { deleted, newAutomation } = result!

    // Confirm the remaining
    expect(newAutomation.definition.steps.length).toBe(1)
    expect(newAutomation.definition.steps[0]).toStrictEqual(logBlock)

    // Confirm the deleted steps
    expect(deleted.length).toBe(2)
    const deletedIds = deleted.map(step => step.id)
    const match = [loopBlock, jsBlock].filter(step =>
      deletedIds.includes(step.id)
    )
    expect(match.length).toBe(2)
  })

  it<CustomContext>("Should delete a looped step in the branched location of the automation", async ({
    bb,
  }) => {
    const auto1: Automation = baseAutomation()

    loadDefintions(bb)

    // Build a log step
    const logBlock = dispenseBlock(bb, "SERVER_LOG")

    // Build a js step
    const jsBlock = dispenseBlock(bb, "EXECUTE_SCRIPT_V2")

    // Add the blocks
    auto1.definition.steps.push(logBlock)
    auto1.definition.steps.push(jsBlock)

    // Insert a branch into the automation at step 1
    const branched1 = bb.automationStore.branchAutomation(
      [{ stepIdx: 1 }],
      auto1
    )

    // Add the branched automation to the store.
    bb.automationStore.update(state => ({
      ...state,
      automations: [branched1],
      selectedAutomationId: branched1._id,
    }))

    // Insert a new log block under the JS block in branch b0
    const jsBlockRef = bb.selected.blockRefs[jsBlock.id]
    const logBlockB0 = dispenseBlock(bb, "SERVER_LOG")
    const updated = bb.automationStore.addBlockToAutomation(
      branched1,
      logBlockB0,
      jsBlockRef.pathTo
    )

    // Store the update auto
    bb.automationStore.update(state => ({
      ...state,
      automations: [updated],
    }))

    // Loop the new log block and store the update.
    const logBlockB0Ref = bb.selected.blockRefs[logBlockB0.id]
    const looped = bb.automationStore.loopBlock(logBlockB0Ref.pathTo, updated)
    bb.automationStore.update(state => ({
      ...state,
      automations: [looped],
    }))

    // Verify the loop - Could use as base fn for loop expectations
    const loopedBlockB0Ref = bb.selected.blockRefs[logBlockB0.id]
    const loopId = loopedBlockB0Ref.looped
    expect(loopId).toBeDefined()

    const loopB0Ref = bb.selected.blockRefs[loopId!]
    expect(loopB0Ref).toBeDefined()

    const loopBlockPath = bb.automationStore.getPathSteps(
      loopB0Ref.pathTo,
      looped
    )
    const loopBlock = loopBlockPath.at(-1) as LoopStep
    expect(loopBlock.stepId).toBe(AutomationActionStepId.LOOP)
    expect(loopBlock.blockToLoop).toBe(logBlockB0.id)

    // Delete the looped block.
    const result = bb.automationStore.deleteBlock(
      loopedBlockB0Ref.pathTo,
      looped
    )
    const { deleted, newAutomation } = result!

    bb.automationStore.update(state => ({
      ...state,
      automations: [newAutomation],
    }))

    // Confirm the deleted steps
    expect(deleted.length).toBe(2)
    const deletedIds = deleted.map(step => step.id)
    const match = [loopBlock, logBlockB0].filter(step =>
      deletedIds.includes(step.id)
    )
    expect(match.length).toBe(2)
  })
})

/**
 * DELETE BLOCK
 *
 * 0th sIdx block
 *
 * 1+ sIdx block
 *
 * 1+ sIdx > branch > branch block 0 > 0th sIdx
 *
 * delete looped
 *
 * much deeper nesting, possibly
 *
 * selected node AND not selected.
 *
 */

/**
 * LOOPING
 *
 * Adding and removing.
 * Root and branch.
 */

/**
 * BRANCHING
 *
 * From root, from branch
 */

/**
 * TRAVERSAL AND BLOCK REFERENCES
 *
 * Registration
 *
 * Metadata: terminating (true|false), looped, blockToLoop etc
 *
 */

/**
 * EVALUATION CONTEXT
 *
 * user, should reflect the current user.
 * env, conditional based on license.
 * trigger, should reflect the chosen auto type and any test data
 * steps - conditional depending on selected node position
 *
 * With test data, without test data.
 *
 * Data in, Data out.
 */

/**
 * MOVE BLOCK
 *
 * Root, branch, branch 0th (slightly different use case here.)
 *
 * Looped blocks. Verify origin and destination nodes.
 */
