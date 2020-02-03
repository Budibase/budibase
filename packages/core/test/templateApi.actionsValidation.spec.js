import { validateActions, validateTrigger } from "../src/templateApi/validate"
import { createValidActionsAndTriggers } from "./specHelpers"

describe("templateApi actions validation", () => {
  it("should return no errors when all actions are valid", () => {
    const { allActions } = createValidActionsAndTriggers()
    const result = validateActions(allActions)
    expect(result).toEqual([])
  })

  it("should return error for empty behaviourName", () => {
    const { allActions, logMessage } = createValidActionsAndTriggers()
    logMessage.behaviourName = ""
    const result = validateActions(allActions)
    expect(result.length).toBe(1)
    expect(result[0].field).toEqual("behaviourName")
  })

  it("should return error for empty behaviourSource", () => {
    const { allActions, logMessage } = createValidActionsAndTriggers()
    logMessage.behaviourSource = ""
    const result = validateActions(allActions)
    expect(result.length).toBe(1)
    expect(result[0].field).toEqual("behaviourSource")
  })

  it("should return error for empty name", () => {
    const { allActions, logMessage } = createValidActionsAndTriggers()
    logMessage.name = ""
    const result = validateActions(allActions)
    expect(result.length).toBe(1)
    expect(result[0].field).toEqual("name")
  })

  it("should return error for duplicate name", () => {
    const {
      allActions,
      logMessage,
      measureCallTime,
    } = createValidActionsAndTriggers()
    logMessage.name = measureCallTime.name
    const result = validateActions(allActions)
    expect(result.length).toBe(1)
    expect(result[0].field).toEqual("")
  })
})

describe("tempalteApi triggers validation", () => {
  it("should return error when actionName is empty", () => {
    const { allActions, logOnErrorTrigger } = createValidActionsAndTriggers()
    logOnErrorTrigger.actionName = ""
    const result = validateTrigger(logOnErrorTrigger, allActions)
    expect(result.length).toBe(1)
    expect(result[0].field).toEqual("actionName")
  })

  it("should return error when eventName is empty", () => {
    const { allActions, logOnErrorTrigger } = createValidActionsAndTriggers()
    logOnErrorTrigger.eventName = ""
    const result = validateTrigger(logOnErrorTrigger, allActions)
    expect(result.length).toBe(1)
    expect(result[0].field).toEqual("eventName")
  })

  it("should return error when eventName does not exist in allowed events", () => {
    const { allActions, logOnErrorTrigger } = createValidActionsAndTriggers()
    logOnErrorTrigger.eventName = "non existant event name"
    const result = validateTrigger(logOnErrorTrigger, allActions)
    expect(result.length).toBe(1)
    expect(result[0].field).toEqual("eventName")
  })

  it("should return error when actionName does not exist in supplied actions", () => {
    const { allActions, logOnErrorTrigger } = createValidActionsAndTriggers()
    logOnErrorTrigger.actionName = "non existent action name"
    const result = validateTrigger(logOnErrorTrigger, allActions)
    expect(result.length).toBe(1)
    expect(result[0].field).toEqual("actionName")
  })

  it("should return error when optionsCreator is invalid javascript", () => {
    const { allActions, logOnErrorTrigger } = createValidActionsAndTriggers()
    logOnErrorTrigger.optionsCreator = "this is nonsense"
    const result = validateTrigger(logOnErrorTrigger, allActions)
    expect(result.length).toBe(1)
    expect(result[0].field).toEqual("optionsCreator")
  })

  it("should return error when condition is invalid javascript", () => {
    const { allActions, logOnErrorTrigger } = createValidActionsAndTriggers()
    logOnErrorTrigger.condition = "this is nonsense"
    const result = validateTrigger(logOnErrorTrigger, allActions)
    expect(result.length).toBe(1)
    expect(result[0].field).toEqual("condition")
  })

  it("should not return error when condition is empty", () => {
    const { allActions, logOnErrorTrigger } = createValidActionsAndTriggers()
    logOnErrorTrigger.condition = ""
    const result = validateTrigger(logOnErrorTrigger, allActions)
    expect(result.length).toBe(0)
  })

  it("should not return error when optionsCreator is empty", () => {
    const { allActions, logOnErrorTrigger } = createValidActionsAndTriggers()
    logOnErrorTrigger.optionsCreator = ""
    const result = validateTrigger(logOnErrorTrigger, allActions)
    expect(result.length).toBe(0)
  })
})
