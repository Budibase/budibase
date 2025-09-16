import { context, objectStore } from "@budibase/backend-core"
import {
  decodeJSBinding,
  encodeJSBinding,
  isJSBinding,
} from "@budibase/string-templates"
import {
  Automation,
  AutomationActionStepId,
  AutomationAttachment,
  AutomationStep,
  AutomationStepResult,
  AutomationStepStatus,
  BaseIOStructure,
  BranchStep,
  FieldSchema,
  FieldType,
  LoopStorage,
  LoopV2Step,
  Row,
} from "@budibase/types"
import { cloneDeep, isPlainObject } from "lodash"
import path from "path"
import * as uuid from "uuid"
import env from "../environment"
import sdk from "../sdk"

/**
 * When values are input to the system generally they will be of type string as this is required for template strings.
 * This can generate some odd scenarios as the Schema of the automation requires a number but the builder might supply
 * a string with template syntax to get the number from the rest of the context. To support this the server has to
 * make sure that the post template statement can be cast into the correct type, this function does this for numbers
 * and booleans.
 *
 * @param inputs An object of inputs, please note this will not recurse down into any objects within, it simply
 * cleanses the top level inputs, however it can be used by recursively calling it deeper into the object structures if
 * the schema is known.
 * @param schema The defined schema of the inputs, in the form of JSON schema. The schema definition of an
 * automation is the likely use case of this, however validate.js syntax can be converted closely enough to use this by
 * wrapping the schema properties in a top level "properties" object.
 * @returns The inputs object which has had all the various types supported by this function converted to their
 * primitive types.
 */
export function cleanInputValues<T extends Record<string, any>>(
  inputs: T,
  schema?: Partial<Record<keyof T, FieldSchema | BaseIOStructure>>
): T {
  const keys = Object.keys(inputs) as (keyof T)[]
  for (let inputKey of keys) {
    let input = inputs[inputKey]
    if (typeof input !== "string") {
      continue
    }
    let propSchema = schema?.[inputKey]
    if (!propSchema) {
      continue
    }
    if (propSchema.type === "boolean") {
      let lcInput = input.toLowerCase()
      if (lcInput === "true") {
        // @ts-expect-error - indexing a generic on purpose
        inputs[inputKey] = true
      }
      if (lcInput === "false") {
        // @ts-expect-error - indexing a generic on purpose
        inputs[inputKey] = false
      }
    }
    if (propSchema.type === "number") {
      let floatInput = parseFloat(input)
      if (!isNaN(floatInput)) {
        // @ts-expect-error - indexing a generic on purpose
        inputs[inputKey] = floatInput
      }
    }
  }
  //Check if input field for Update Row should be a relationship and cast to array
  if (inputs?.row) {
    for (let key in inputs.row) {
      if (
        inputs.schema?.[key]?.type === "link" &&
        inputs.row[key] &&
        typeof inputs.row[key] === "string"
      ) {
        try {
          inputs.row[key] = JSON.parse(inputs.row[key])
        } catch (e) {
          //Link is not an array or object, so continue
        }
      }
    }
  }
  return inputs
}

/**
 * Given a row input like a save or update row we need to clean the inputs against a schema that is not part of
 * the automation but is instead part of the Table/Table. This function will get the table schema and use it to instead
 * perform the cleanInputValues function on the input row.
 *
 * @param tableId The ID of the Table/Table which the schema is to be retrieved for.
 * @param row The input row structure which requires clean-up after having been through template statements.
 * @returns The cleaned up rows object, will should now have all the required primitive types.
 */
export async function cleanUpRow(tableId: string, row: Row) {
  let table = await sdk.tables.getTable(tableId)
  return cleanInputValues(row, table.schema)
}

export function getError(err: any) {
  if (err == null) {
    return "No error provided."
  }
  if (
    typeof err === "object" &&
    (err.toString == null || err.toString() === "[object Object]")
  ) {
    return JSON.stringify(err)
  }
  return typeof err !== "string" ? err.toString() : err
}

export function guardAttachment(attachmentObject: any) {
  if (
    attachmentObject &&
    (!("url" in attachmentObject) || !("filename" in attachmentObject))
  ) {
    const providedKeys = Object.keys(attachmentObject).join(", ")
    throw new Error(
      `Attachments must have both "url" and "filename" keys. You have provided: ${providedKeys}`
    )
  }
}

export async function sendAutomationAttachmentsToStorage(
  tableId: string,
  row: Row
): Promise<Row> {
  const table = await sdk.tables.getTable(tableId)
  const attachmentRows: Record<
    string,
    AutomationAttachment[] | AutomationAttachment
  > = {}

  for (const [prop, value] of Object.entries(row)) {
    const schema = table.schema[prop]
    if (
      schema?.type === FieldType.ATTACHMENTS ||
      schema?.type === FieldType.ATTACHMENT_SINGLE ||
      schema?.type === FieldType.SIGNATURE_SINGLE
    ) {
      if (Array.isArray(value)) {
        value.forEach(item => guardAttachment(item))
      } else {
        guardAttachment(value)
      }
      attachmentRows[prop] = value
    }
  }

  for (const [prop, attachments] of Object.entries(attachmentRows)) {
    if (!attachments) {
      continue
    } else if (Array.isArray(attachments)) {
      if (attachments.length) {
        row[prop] = await Promise.all(
          attachments.map(attachment => generateAttachmentRow(attachment))
        )
      }
    } else if (Object.keys(row[prop]).length > 0) {
      row[prop] = await generateAttachmentRow(attachments)
    }
  }

  return row
}
async function generateAttachmentRow(attachment: AutomationAttachment) {
  const prodAppId = context.getProdWorkspaceId()

  async function uploadToS3(
    extension: string,
    content: objectStore.StreamTypes
  ) {
    const fileName = `${uuid.v4()}${extension}`
    const s3Key = `${prodAppId}/attachments/${fileName}`

    await objectStore.streamUpload({
      bucket: objectStore.ObjectStoreBuckets.APPS,
      stream: content,
      filename: s3Key,
    })

    return s3Key
  }

  async function getSize(s3Key: string) {
    return (
      await objectStore.getObjectMetadata(
        objectStore.ObjectStoreBuckets.APPS,
        s3Key
      )
    ).ContentLength
  }

  try {
    const { filename } = attachment
    let extension = path.extname(filename)
    if (extension.startsWith(".")) {
      extension = extension.substring(1, extension.length)
    }
    const attachmentResult =
      await objectStore.processAutomationAttachment(attachment)

    let s3Key = ""
    if (
      "path" in attachmentResult &&
      attachmentResult.path.startsWith(`${prodAppId}/attachments/`)
    ) {
      s3Key = attachmentResult.path
    } else {
      s3Key = await uploadToS3(extension, attachmentResult.content)
    }

    const size = await getSize(s3Key)

    return {
      size,
      extension,
      name: filename,
      key: s3Key,
    }
  } catch (error) {
    console.error("Failed to process attachment:", error)
    throw error
  }
}
export function substituteLoopStep(hbsString: string, substitute: string) {
  let checkForJS = isJSBinding(hbsString)
  let substitutedHbsString = ""
  let open = checkForJS ? `$("` : "{{"
  let closed = checkForJS ? `")` : "}}"
  if (checkForJS) {
    hbsString = decodeJSBinding(hbsString) as string
  }
  let pointer = 0,
    openPointer = 0,
    closedPointer = 0
  while (pointer < hbsString?.length) {
    openPointer = hbsString.indexOf(open, pointer)
    closedPointer = hbsString.indexOf(closed, pointer) + 2
    if (openPointer < 0 || closedPointer < 0) {
      substitutedHbsString += hbsString.substring(pointer)
      break
    }
    let before = hbsString.substring(pointer, openPointer)
    let block = hbsString
      .substring(openPointer, closedPointer)
      .replace(/loop/, substitute)
    substitutedHbsString += before + block
    pointer = closedPointer
  }
  if (checkForJS) {
    substitutedHbsString = encodeJSBinding(substitutedHbsString)
  }
  return substitutedHbsString
}

export function stringSplit(value: string | string[]) {
  if (value == null) {
    return []
  }
  if (Array.isArray(value)) {
    return value
  }
  if (typeof value !== "string") {
    throw new Error(`Unable to split value of type ${typeof value}: ${value}`)
  }
  const splitOnNewLine = value.split("\n")
  if (splitOnNewLine.length > 1) {
    return splitOnNewLine
  }
  return value.split(",")
}

export function matchesLoopFailureCondition(
  step: LoopV2Step,
  currentItem: any
) {
  const { failure } = step.inputs
  if (!failure) {
    return false
  }

  if (isPlainObject(currentItem)) {
    return Object.values(currentItem).some(e => e === failure)
  }

  return currentItem === failure
}

// Returns an array of the things to loop over for a given LoopStep.  This
// function handles the various ways that a LoopStep can be configured, parsing
// the input and returning an array of items to loop over.
export function getLoopIterable(step: LoopV2Step): any[] {
  let input = step.inputs.binding

  if (Array.isArray(input)) {
    return input
  } else if (typeof input === "string") {
    if (input === "") {
      input = []
    } else {
      try {
        input = JSON.parse(input)
      } catch (e) {
        input = stringSplit(input)
      }
    }
  }

  return Array.isArray(input) ? input : [input]
}

export function getLoopMaxIterations(loopStep: LoopV2Step): number {
  const loopMaxIterations =
    typeof loopStep.inputs.iterations === "string"
      ? parseInt(loopStep.inputs.iterations)
      : loopStep.inputs.iterations
  return Math.min(
    loopMaxIterations || env.AUTOMATION_MAX_ITERATIONS,
    env.AUTOMATION_MAX_ITERATIONS
  )
}

export function getMaxStoredResults(step: LoopV2Step): number {
  const DEFAULT_MAX_STORED_RESULTS = env.AUTOMATION_MAX_STORED_LOOP_RESULTS

  const options = step.inputs.resultOptions

  // If summarizeOnly is true, don't store any results
  if (options?.summarizeOnly) {
    return 0
  }

  const userMax = options?.maxStoredIterations
  if (userMax !== undefined && userMax > 0) {
    return Math.min(userMax, DEFAULT_MAX_STORED_RESULTS)
  }
  return DEFAULT_MAX_STORED_RESULTS
}

export function convertLegacyLoopOutputs(items: Record<string, any>) {
  const itemKey = Object.keys(items)[0]
  items = items[itemKey].map(({ outputs }: AutomationStepResult) => {
    return outputs
  })

  return items
}

export function initializeLoopStorage(
  children: AutomationStep[],
  maxStoredResults: number
): LoopStorage {
  const storage: LoopStorage = {
    results: {},
    summary: {
      totalProcessed: 0,
      successCount: 0,
      failureCount: 0,
    },
    nestedSummaries: {},
    maxStoredResults,
  }

  // Initialize result arrays for each child step
  for (const { id } of children) {
    storage.results[id] = []
    storage.nestedSummaries[id] = []
  }

  return storage
}

export function processStandardResult(
  storage: LoopStorage,
  result: AutomationStepResult,
  iteration: number
): void {
  storage.summary.totalProcessed++
  if (result.outputs.success) {
    storage.summary.successCount++
  } else {
    storage.summary.failureCount++
    if (!storage.summary.firstFailure) {
      storage.summary.firstFailure = {
        iteration,
        error:
          result.outputs.response ||
          result.outputs.error ||
          result.outputs.response?.message ||
          "Unknown error",
      }
    }
  }

  if (result.outputs.summary) {
    storage.nestedSummaries[result.id].push(result.outputs.summary)
  }

  storage.results[result.id].push(result)
  // If we exceed max, remove the oldest
  if (storage.results[result.id].length > storage.maxStoredResults) {
    storage.results[result.id].shift()
  }
}

export function buildLoopOutput(
  storage: LoopStorage,
  status?: AutomationStepStatus,
  iterations?: number,
  forceFailure = false
): Record<string, any> {
  let { summary } = storage
  let success = summary.failureCount === 0
  if (
    forceFailure ||
    status === AutomationStepStatus.MAX_ITERATIONS ||
    status === AutomationStepStatus.FAILURE_CONDITION
  ) {
    success = false
  }

  const output: Record<string, any> = {
    success,
    iterations: iterations || summary.totalProcessed,
    summary,
  }

  if (status) {
    output.status = status
  }

  // Only include items if we have stored results (not when summarizeOnly)
  if (Object.keys(storage.results).length > 0 && storage.maxStoredResults > 0) {
    output.items = storage.results
  }

  if (Object.values(storage.nestedSummaries).some(arr => arr.length > 0)) {
    output.nestedSummaries = storage.nestedSummaries
  }

  return output
}

/**
 * Pre-processes an automation definition to transform legacy LOOP steps
 * into the new LOOP_V2 format. This allows the execution engine to only
 * handle LOOP_V2 steps, simplifying the runtime logic.
 *
 * @param automation The automation to preprocess
 * @returns A new automation with legacy loops transformed
 */
export function preprocessAutomation(automation: Automation): Automation {
  const processed = cloneDeep(automation)
  processed.definition.steps = preprocessSteps(processed.definition.steps)
  return processed
}

/**
 * Recursively processes an array of automation steps to transform legacy LOOP steps
 * into LOOP_V2 format. This handles both main step arrays and nested children in
 * branch steps and existing loop steps.
 *
 * @param steps Array of automation steps to process
 * @returns Transformed array of steps
 */
function preprocessSteps(steps: AutomationStep[]): AutomationStep[] {
  const transformedSteps: AutomationStep[] = []

  let i = 0
  while (i < steps.length) {
    const step = steps[i]

    if (step.stepId === AutomationActionStepId.LOOP) {
      const nextStep = steps[i + 1]

      const processedChildStep = preprocessSteps([nextStep])[0]

      const loopV2Step: LoopV2Step = {
        ...step,
        stepId: AutomationActionStepId.LOOP_V2,
        inputs: {
          ...step.inputs,
          children: [processedChildStep],
        },
        isLegacyLoop: true,
      }
      transformedSteps.push(loopV2Step)

      // Skip the next step since it's now a child of the loop
      i += 2
    } else if (step.stepId === AutomationActionStepId.BRANCH) {
      const branchStep = step as BranchStep
      const processedBranchStep = { ...branchStep }

      if (branchStep.inputs?.children) {
        const processedChildren: Record<string, AutomationStep[]> = {}
        for (const [branchId, branchSteps] of Object.entries(
          branchStep.inputs.children
        )) {
          processedChildren[branchId] = preprocessSteps(
            branchSteps as AutomationStep[]
          )
        }
        processedBranchStep.inputs = {
          ...branchStep.inputs,
          children: processedChildren,
        }
      }

      transformedSteps.push(processedBranchStep)
      i++
    } else {
      transformedSteps.push(step)
      i++
    }
  }

  return transformedSteps
}
