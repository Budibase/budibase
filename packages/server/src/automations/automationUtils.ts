import {
  decodeJSBinding,
  isJSBinding,
  encodeJSBinding,
} from "@budibase/string-templates"
import sdk from "../sdk"
import {
  AutomationAttachment,
  FieldType,
  Row,
  LoopStepType,
  LoopStepInputs,
} from "@budibase/types"
import { objectStore, context } from "@budibase/backend-core"
import * as uuid from "uuid"
import path from "path"

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
  inputs: any,
  schema?: any
): T {
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
  const prodAppId = context.getProdAppId()

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
    const attachmentResult = await objectStore.processAutomationAttachment(
      attachment
    )

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

export function typecastForLooping(input: LoopStepInputs) {
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

export function ensureMaxIterationsAsNumber(
  value: number | string | undefined
): number | undefined {
  if (typeof value === "number") return value
  if (typeof value === "string") {
    return parseInt(value)
  }
  return undefined
}
