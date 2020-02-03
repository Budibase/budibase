import { generateSchema } from "./indexSchemaCreator"
import { has, isString, difference, find } from "lodash/fp"
import { Buffer } from "safe-buffer"
import { StringDecoder } from "string_decoder"
import { getType } from "../types"
import { isSomething } from "../common"

export const BUFFER_MAX_BYTES = 524288 // 0.5Mb

export const CONTINUE_READING_RECORDS = "CONTINUE_READING"
export const READ_REMAINING_TEXT = "READ_REMAINING"
export const CANCEL_READ = "CANCEL"

export const getIndexWriter = (
  hierarchy,
  indexNode,
  readableStream,
  writableStream,
  end
) => {
  const schema = generateSchema(hierarchy, indexNode)

  return {
    read: read(readableStream, schema),
    updateIndex: updateIndex(readableStream, writableStream, schema, end),
  }
}

export const getIndexReader = (hierarchy, indexNode, readableStream) =>
  read(readableStream, generateSchema(hierarchy, indexNode))

const updateIndex = (readableStream, writableStream, schema) => async (
  itemsToWrite,
  keysToRemove
) => {
  const write = newOutputWriter(BUFFER_MAX_BYTES, writableStream)
  const writtenItems = []
  await read(readableStream, schema)(
    async indexedItem => {
      const updated = find(i => indexedItem.key === i.key)(itemsToWrite)
      const removed = find(k => indexedItem.key === k)(keysToRemove)

      if (isSomething(removed)) return CONTINUE_READING_RECORDS

      if (isSomething(updated)) {
        const serializedItem = serializeItem(schema, updated)
        await write(serializedItem)
        writtenItems.push(updated)
      } else {
        await write(serializeItem(schema, indexedItem))
      }

      return CONTINUE_READING_RECORDS
    },
    async text => await write(text)
  )

  if (writtenItems.length !== itemsToWrite.length) {
    const toAdd = difference(itemsToWrite, writtenItems)
    for (let added of toAdd) {
      await write(serializeItem(schema, added))
    }
  } else if (writtenItems.length === 0) {
    // potentially are no records
    await write("")
  }

  await write()
  await writableStream.end()
}

const read = (readableStream, schema) => async (onGetItem, onGetText) => {
  const readInput = newInputReader(readableStream)
  let text = await readInput()
  let status = CONTINUE_READING_RECORDS
  while (text.length > 0) {
    if (status === READ_REMAINING_TEXT) {
      await onGetText(text)
      continue
    }

    if (status === CANCEL_READ) {
      return
    }

    let rowText = ""
    let currentCharIndex = 0
    for (let currentChar of text) {
      rowText += currentChar
      if (currentChar === "\r") {
        status = await onGetItem(deserializeRow(schema, rowText))
        rowText = ""
        if (status === READ_REMAINING_TEXT) {
          break
        }
      }
      currentCharIndex++
    }

    if (currentCharIndex < text.length - 1) {
      await onGetText(text.substring(currentCharIndex + 1))
    }

    text = await readInput()
  }

  await readableStream.destroy()
}

const newOutputWriter = (flushBoundary, writableStream) => {
  let currentBuffer = null

  return async text => {
    if (isString(text) && currentBuffer === null)
      currentBuffer = Buffer.from(text, "utf8")
    else if (isString(text))
      currentBuffer = Buffer.concat([currentBuffer, Buffer.from(text, "utf8")])

    if (
      currentBuffer !== null &&
      (currentBuffer.length > flushBoundary || !isString(text))
    ) {
      await writableStream.write(currentBuffer)
      currentBuffer = null
    }
  }
}

const newInputReader = readableStream => {
  const decoder = new StringDecoder("utf8")
  let remainingBytes = []

  return async () => {
    let nextBytesBuffer = await readableStream.read(BUFFER_MAX_BYTES)
    const remainingBuffer = Buffer.from(remainingBytes)

    if (!nextBytesBuffer) nextBytesBuffer = Buffer.from([])

    const moreToRead = nextBytesBuffer.length === BUFFER_MAX_BYTES

    const buffer = Buffer.concat(
      [remainingBuffer, nextBytesBuffer],
      remainingBuffer.length + nextBytesBuffer.length
    )

    const text = decoder.write(buffer)
    remainingBytes = decoder.end(buffer)

    if (!moreToRead && remainingBytes.length > 0) {
      // if for any reason, we have remaining bytes at the end
      // of the stream, just discard - dont see why this should
      // ever happen, but if it does, it could cause a stack overflow
      remainingBytes = []
    }

    return text
  }
}

const deserializeRow = (schema, rowText) => {
  let currentPropIndex = 0
  let currentCharIndex = 0
  let currentValueText = ""
  let isEscaped = false
  const item = {}

  const setCurrentProp = () => {
    const currentProp = schema[currentPropIndex]
    const type = getType(currentProp.type)
    const value =
      currentValueText === ""
        ? type.getDefaultValue()
        : type.safeParseValue(currentValueText)
    item[currentProp.name] = value
  }

  while (currentPropIndex < schema.length) {
    if (currentCharIndex < rowText.length) {
      const currentChar = rowText[currentCharIndex]
      if (isEscaped) {
        if (currentChar === "r") {
          currentValueText += "\r"
        } else {
          currentValueText += currentChar
        }
        isEscaped = false
      } else {
        if (currentChar === ",") {
          setCurrentProp()
          currentValueText = ""
          currentPropIndex++
        } else if (currentChar === "\\") {
          isEscaped = true
        } else {
          currentValueText += currentChar
        }
      }
      currentCharIndex++
    } else {
      currentValueText = ""
      setCurrentProp()
      currentPropIndex++
    }
  }

  return item
}

export const serializeItem = (schema, item) => {
  let rowText = ""

  for (let prop of schema) {
    const type = getType(prop.type)
    const value = has(prop.name)(item)
      ? item[prop.name]
      : type.getDefaultValue()

    const valStr = type.stringify(value)

    for (let i = 0; i < valStr.length; i++) {
      const currentChar = valStr[i]
      if (currentChar === "," || currentChar === "\r" || currentChar === "\\") {
        rowText += "\\"
      }

      if (currentChar === "\r") {
        rowText += "r"
      } else {
        rowText += currentChar
      }
    }

    rowText += ","
  }

  rowText += "\r"
  return rowText
}
