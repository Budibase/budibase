import {
  decodeJSBinding,
  isJSBinding,
  encodeJSBinding,
} from "@budibase/string-templates"
import sdk from "../sdk"
import { AutomationAttachment, FieldType, Row } from "@budibase/types"
import { LoopInput, LoopStepType } from "../definitions/automations"
import { objectStore, context } from "@budibase/backend-core"
import * as uuid from "uuid"

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
export function cleanInputValues(inputs: Record<string, any>, schema?: any) {
  if (schema == null) {
    return inputs
  }
  for (let inputKey of Object.keys(inputs)) {
    let input = inputs[inputKey]
    if (typeof input !== "string") {
      continue
    }
    let propSchema = schema.properties[inputKey]
    if (!propSchema) {
      continue
    }
    if (propSchema.type === "boolean") {
      let lcInput = input.toLowerCase()
      if (lcInput === "true") {
        inputs[inputKey] = true
      }
      if (lcInput === "false") {
        inputs[inputKey] = false
      }
    }
    if (propSchema.type === "number") {
      let floatInput = parseFloat(input)
      if (!isNaN(floatInput)) {
        inputs[inputKey] = floatInput
      }
    }
  }
  //Check if input field for Update Row should be a relationship and cast to array
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
  return cleanInputValues(row, { properties: table.schema })
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

export async function sendAutomationAttachmentsToStorage(
  tableId: string,
  row: Row
) {
  let table = await sdk.tables.getTable(tableId)
  const attachmentRows: { [key: string]: any } = {}

  Object.entries(row).forEach(([prop, value]) => {
    const schema = table.schema[prop]
    if (
      Object.hasOwn(table.schema, prop) &&
      schema?.type === (FieldType.ATTACHMENTS || FieldType.ATTACHMENT_SINGLE)
    ) {
      attachmentRows[prop] = value
    }
  })
  for (const prop in attachmentRows) {
    const attachments = attachmentRows[prop]
    let updatedAttachments = []
    if (attachments.length) {
      updatedAttachments = await Promise.all(
        attachments.map(async (attachment: AutomationAttachment) => {
          let s3Key
          let { path, content } = await objectStore.processAutomationAttachment(
            attachment
          )
          const extension = attachment.filename.split(".").pop() || ""
          // If the path is an attachment that already exists, we don't want to stream it again,
          // just use the existing s3 key else it doesn't exist and we need to upload
          if (path?.includes(`${context.getProdAppId()}/attachments/`)) {
            s3Key = attachment.url
          } else {
            const processedFileName = `${uuid.v4()}.${extension}`
            s3Key = `${context.getProdAppId()}/attachments/${processedFileName}`
            await objectStore.streamUpload({
              bucket: objectStore.ObjectStoreBuckets.APPS,
              stream: content,
              filename: s3Key,
            })
          }

          return {
            size: 10,
            name: attachment.filename,
            extension,
            key: s3Key,
          }
        })
      )
    }
    row[prop] = updatedAttachments
  }

  return row
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

export function typecastForLooping(input: LoopInput) {
  if (!input || !input.binding) {
    return null
  }
  try {
    switch (input.option) {
      case LoopStepType.ARRAY:
        if (typeof input.binding === "string") {
          return JSON.parse(input.binding)
        }
        break
      case LoopStepType.STRING:
        if (Array.isArray(input.binding)) {
          return input.binding.join(",")
        }
        break
    }
  } catch (err) {
    throw new Error("Unable to cast to correct type")
  }
  return input.binding
}
