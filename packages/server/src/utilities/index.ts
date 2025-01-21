import env from "../environment"
import { context } from "@budibase/backend-core"
import { generateMetadataID } from "../db/utils"
import { Document } from "@budibase/types"
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"

dayjs.extend(customParseFormat)

export function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const isDev = env.isDev

export const NUMBER_REGEX = /^[+-]?([0-9]*[.])?[0-9]+$/g
const ACCEPTED_DATE_FORMATS = [
  "MM/DD/YYYY",
  "MM/DD/YY",
  "DD/MM/YYYY",
  "DD/MM/YY",
  "YYYY/MM/DD",
  "YYYY-MM-DD",
  "YYYY-MM-DDTHH:mm",
  "YYYY-MM-DDTHH:mm:ss",
  "YYYY-MM-DDTHH:mm:ss[Z]",
  "YYYY-MM-DDTHH:mm:ss.SSS[Z]",
]

export function isDate(str: string) {
  // checks for xx/xx/xx or ISO date timestamp formats
  for (const format of ACCEPTED_DATE_FORMATS) {
    if (dayjs(str, format, true).isValid()) {
      return true
    }
  }
  return false
}

export function removeFromArray(array: any[], element: any) {
  const index = array.indexOf(element)
  if (index !== -1) {
    array.splice(index, 1)
  }
  return array
}

/**
 * Makes sure that a URL has the correct number of slashes, while maintaining the
 * http(s):// double slashes.
 * @param url The URL to test and remove any extra double slashes.
 * @return The updated url.
 */
export function checkSlashesInUrl(url: string) {
  return url.replace(/(https?:\/\/)|(\/)+/g, "$1$2")
}

export async function updateEntityMetadata(
  type: string,
  entityId: string,
  updateFn: any
) {
  const db = context.getAppDB()
  const id = generateMetadataID(type, entityId)
  // read it to see if it exists, we'll overwrite it no matter what
  let rev, metadata: Document
  try {
    const oldMetadata = await db.get<any>(id)
    rev = oldMetadata._rev
    metadata = updateFn(oldMetadata)
  } catch (err) {
    rev = null
    metadata = updateFn({})
  }
  metadata._id = id
  if (rev) {
    metadata._rev = rev
  }
  const response = await db.put(metadata)
  return {
    ...metadata,
    _id: id,
    _rev: response.rev,
  }
}

export async function saveEntityMetadata(
  type: string,
  entityId: string,
  metadata: Document
): Promise<Document> {
  return updateEntityMetadata(type, entityId, () => {
    return metadata
  })
}

export async function deleteEntityMetadata(type: string, entityId: string) {
  const db = context.getAppDB()
  const id = generateMetadataID(type, entityId)
  let rev
  try {
    const metadata = await db.get<any>(id)
    if (metadata) {
      rev = metadata._rev
    }
  } catch (err) {
    // don't need to error if it doesn't exist
  }
  if (id && rev) {
    await db.remove(id, rev)
  }
}

export function escapeDangerousCharacters(string: string) {
  return string
    .replace(/[\\]/g, "\\\\")
    .replace(/[\b]/g, "\\b")
    .replace(/[\f]/g, "\\f")
    .replace(/[\n]/g, "\\n")
    .replace(/[\r]/g, "\\r")
    .replace(/[\t]/g, "\\t")
}

export function formatBytes(bytes: string) {
  const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
  const byteIncrements = 1024
  let unit = 0
  let size = parseInt(bytes, 10) || 0
  while (size >= byteIncrements && ++unit) {
    size /= byteIncrements
  }
  return `${size.toFixed(size < 10 && unit > 0 ? 1 : 0)}${units[unit]}`
}

export function convertBookmark(bookmark: string) {
  const IS_NUMBER = /^\d+\.?\d*$/
  if (typeof bookmark === "string" && bookmark.match(IS_NUMBER)) {
    return parseFloat(bookmark)
  }
  return bookmark
}

export function isQsTrue(param: string) {
  if (typeof param === "string") {
    return param.toLowerCase() === "true"
  } else {
    return param === true
  }
}
